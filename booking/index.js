// @ts-check
'use strict';

/**
 * Приём заявок с формы записи сайта «Дентал Круиз» — Yandex Cloud Functions,
 * среда Node.js 22, точка входа `index.handler`.
 *
 * Заявка уходит письмом на почту клиники через Yandex Cloud Postbox и больше
 * нигде не сохраняется: письмо в ящике Яндекс 360 и есть хранилище. Вся
 * обработка — в России: персональные данные пациентов медорганизация обязана
 * впервые записывать в базы на территории РФ (152-ФЗ, ч. 5 ст. 18).
 *
 * Ключей в коде и в настройках нет: функции назначен сервисный аккаунт
 * с ролью postbox.sender, и платформа сама передаёт его IAM-токен
 * в context.token при каждом вызове.
 *
 * Снаружи функцию вызывает API Gateway (openapi.yaml): POST и OPTIONS
 * на /booking, GET на /health. Остальные пути шлюз отбивает сам, поэтому
 * здесь маршрут выбирается только по методу.
 */

const MAX = Object.freeze({ name: 80, contact: 40, comment: 600, page: 300, referrer: 300 });

/** Не больше 5 заявок за 60 секунд с одного IP — в пределах экземпляра функции, см. createRateLimiter */
const RATE = Object.freeze({ limit: 5, windowMs: 60_000 });

const POSTBOX_URL = 'https://postbox.cloud.yandex.net/v2/email/outbound-emails';
/** Функции даётся до 10 секунд (README) — ответ почты ждём не дольше 8 */
const POSTBOX_TIMEOUT_MS = 8_000;

const ERRORS = Object.freeze({
  badRequest: 'Некорректный запрос',
  name: 'Укажите имя',
  phone: 'Введите номер в формате +7 900 000-00-00',
  consent: 'Нужно согласие на обработку персональных данных',
  tooMany: 'Слишком много заявок. Попробуйте через минуту.',
  notSent: 'Не удалось передать заявку. Позвоните нам.',
  notFound: 'Не найдено',
});

/**
 * @typedef {object} Booking
 * @property {string} name
 * @property {string} contact Телефон в E.164: +79255777677
 * @property {string} comment
 * @property {string} page Адрес страницы, с которой ушла заявка (вместе с utm-метками)
 * @property {string} referrer Откуда пришёл посетитель
 */

/**
 * HTTP-запрос в том виде, в каком его передаёт Cloud Functions (через API Gateway).
 * @typedef {object} HttpEvent
 * @property {string} [httpMethod]
 * @property {Record<string, string>} [headers]
 * @property {string} [body]
 * @property {boolean} [isBase64Encoded]
 * @property {{ identity?: { sourceIp?: string } }} [requestContext]
 */

/**
 * @typedef {object} HttpResponse
 * @property {number} statusCode
 * @property {Record<string, string>} headers
 * @property {string} body
 */

/** @typedef {{ subject: string, text: string }} Mail */

/**
 * @typedef {object} RateLimiter
 * @property {(key: string) => boolean} hit Засчитать запрос; false — лимит исчерпан
 */

/**
 * Всё, что обработчику нужно снаружи. В облаке это переменные окружения,
 * Postbox и настоящие часы; в тестах — подмены без сети.
 * @typedef {object} Deps
 * @property {string[]} allowedOrigins Домены, которым разрешено слать заявки (CORS)
 * @property {RateLimiter} limiter
 * @property {(mail: Mail) => Promise<boolean>} send true — письмо принято к отправке
 * @property {() => Date} now
 */

/**
 * Обработка одного HTTP-запроса. Контракт тот же, что был у Cloudflare Worker:
 * ответ `{ ok: true }` или `{ ok: false, error }` со статусом 400, 429 или 502;
 * текст `error` форма показывает пользователю как есть.
 *
 * @param {HttpEvent} event
 * @param {Deps} deps
 * @returns {Promise<HttpResponse>}
 */
async function handle(event, deps) {
  const origin = header(event, 'origin');
  const cors = corsHeaders(origin, deps.allowedOrigins);
  const method = (event.httpMethod ?? '').toUpperCase();

  if (method === 'OPTIONS') {
    // Preflight: браузер спрашивает разрешения перед POST с JSON.
    // Чужому домену разрешающих заголовков не даём — браузер сам отменит запрос.
    /** @type {Record<string, string>} */
    const preflight = cors['Access-Control-Allow-Origin']
      ? {
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      : {};
    return { statusCode: 204, headers: { ...cors, ...preflight }, body: '' };
  }
  if (method === 'GET') return reply(200, { ok: true }, cors);
  if (method !== 'POST') return reply(404, { ok: false, error: ERRORS.notFound }, cors);

  // ── Частота: защита от перебора и спама ──────────────────────
  // IP нужен только здесь, как ключ ограничителя; дальше он не идёт.
  if (!deps.limiter.hit(clientIp(event))) {
    return reply(429, { ok: false, error: ERRORS.tooMany }, cors);
  }

  const body = parseBody(event);
  if (!body) return reply(400, { ok: false, error: ERRORS.badRequest }, cors);

  // ── Ловушка для ботов ────────────────────────────────────────
  // Поле скрыто от людей. Заполнено — значит это бот. Отвечаем 200,
  // чтобы он не понял, что отсеян, но никуда ничего не шлём.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return reply(200, { ok: true }, cors);
  }

  const booking = validate(body);
  if ('error' in booking) return reply(400, { ok: false, error: booking.error }, cors);

  const sent = await deps.send(buildMail(booking, deps.now()));
  if (!sent) return reply(502, { ok: false, error: ERRORS.notSent }, cors);

  return reply(200, { ok: true }, cors);
}

/**
 * Проверка и нормализация полей формы.
 * @param {Record<string, unknown>} body
 * @returns {Booking | { error: string }}
 */
function validate(body) {
  /** @param {unknown} value @param {number} limit */
  const str = (value, limit) => (typeof value === 'string' ? value.trim().slice(0, limit) : '');

  const name = str(body.name, MAX.name);
  const contact = normalizePhone(str(body.contact, MAX.contact));
  const comment = str(body.comment, MAX.comment);
  const page = str(body.page, MAX.page);
  const referrer = str(body.referrer, MAX.referrer);
  const consent = body.consent === true || body.consent === 'on' || body.consent === 'true';

  if (name.length < 2) return { error: ERRORS.name };
  if (!contact) return { error: ERRORS.phone };
  if (!consent) return { error: ERRORS.consent };

  return { name, contact, comment, page, referrer };
}

/**
 * Телефон → E.164 («+79255777677») или null, если это не российский номер.
 *
 * Принимаются 11 цифр с ведущей 7; 8 вместо 7 — старый межгород; десять цифр —
 * номер без кода страны (российские номера с 7 не начинаются, поэтому неполный
 * «+7 925 577-76-7» сюда не проскочит). Строже — первая цифра 9 и т.п. — не
 * проверяем: городские номера тоже нужны. Форма присылает уже E.164
 * (src/lib/phone.ts), но старая версия сайта и ручные запросы шлют что угодно —
 * нормализуем и здесь.
 *
 *   '+7 (925) 577-76-77' → '+79255777677'
 *   '89255777677'        → '+79255777677'
 *   '9255777677'         → '+79255777677'
 *   '+1 212 555 0100'    → null
 *
 * @param {string} raw
 * @returns {string | null}
 */
function normalizePhone(raw) {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 10 && !digits.startsWith('7')) digits = `7${digits}`;
  else if (digits.length === 11 && digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  return /^7\d{10}$/.test(digits) ? `+${digits}` : null;
}

/**
 * Письмо администратору. Обычный текст, без HTML — экранировать нечего.
 * IP посетителя в письмо не пишем: это персональные данные, и почте они
 * ни к чему — от спама защищает ограничитель частоты.
 *
 * @param {Booking} booking
 * @param {Date} date
 * @returns {Mail}
 */
function buildMail(booking, date) {
  const when = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow',
  }).format(date);

  const lines = ['Новая заявка с сайта', '', `Имя: ${booking.name}`, `Телефон: ${booking.contact}`];
  if (booking.comment) lines.push(`Комментарий: ${booking.comment}`);
  if (booking.page) lines.push(`Страница: ${booking.page}`);
  if (booking.referrer) lines.push(`Переход с: ${booking.referrer}`);
  lines.push('', `${when} МСК`);

  // Тема — одна строка: переводы строк и табуляции из имени схлопываем
  const subjectName = booking.name.replace(/\s+/g, ' ');
  return { subject: `Заявка с сайта: ${subjectName}`, text: lines.join('\n') };
}

/**
 * Ограничитель частоты: не больше `limit` запросов с одного ключа за `windowMs`.
 *
 * Счётчики живут в памяти экземпляра функции. Общей памяти у экземпляров
 * Cloud Functions нет, поэтому лимит действует на каждый экземпляр отдельно,
 * а при «холодном» старте обнуляется. README предписывает ограничить
 * масштабирование одним экземпляром на зону доступности — тогда с одного IP
 * пройдёт не больше limit × число зон заявок в минуту.
 *
 * @param {{ limit: number, windowMs: number, now?: () => number }} options
 * @returns {RateLimiter}
 */
function createRateLimiter({ limit, windowMs, now = Date.now }) {
  /** @type {Map<string, number[]>} */
  const hits = new Map();
  /** Порог, после которого из карты выметаются ключи без свежих запросов */
  const SWEEP_AT = 1_000;

  return {
    hit(key) {
      const current = now();
      const since = current - windowMs;

      if (hits.size >= SWEEP_AT) {
        for (const [k, stamps] of hits) {
          if (stamps[stamps.length - 1] <= since) hits.delete(k);
        }
      }

      const recent = (hits.get(key) ?? []).filter((t) => t > since);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(current);
      hits.set(key, recent);
      return true;
    },
  };
}

/**
 * Отправка письма через Yandex Cloud Postbox (SES-совместимый API).
 * Аутентификация — IAM-токен сервисного аккаунта функции в заголовке
 * X-YaCloud-SubjectToken; подпись запроса при этом не нужна.
 *
 * @param {Mail} mail
 * @param {{ token?: string, from?: string, to?: string }} options
 * @returns {Promise<boolean>}
 */
async function sendViaPostbox(mail, { token, from, to }) {
  if (!token || !from || !to) {
    // Что именно не так — без данных заявки: логи функции тоже хранятся
    console.error(
      'Postbox не настроен: ' +
        [!token && 'функции не назначен сервисный аккаунт', !from && 'нет MAIL_FROM', !to && 'нет MAIL_TO']
          .filter(Boolean)
          .join(', '),
    );
    return false;
  }

  try {
    const response = await fetch(POSTBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-YaCloud-SubjectToken': token },
      body: JSON.stringify({
        FromEmailAddress: from,
        Destination: { ToAddresses: [to] },
        Content: {
          Simple: {
            Subject: { Data: mail.subject, Charset: 'UTF-8' },
            Body: { Text: { Data: mail.text, Charset: 'UTF-8' } },
          },
        },
      }),
      signal: AbortSignal.timeout(POSTBOX_TIMEOUT_MS),
    });
    if (!response.ok) {
      // В ответе об ошибке Postbox пишет код и пояснение («sender is not allowed»,
      // «MailFromDomainNotVerifiedException»…), содержимого письма там нет
      const detail = await response.text().catch(() => '');
      console.error(`Postbox отклонил письмо: HTTP ${response.status} ${detail.slice(0, 300)}`);
    }
    return response.ok;
  } catch (err) {
    console.error(`Postbox недоступен: ${err instanceof Error ? err.name : 'ошибка'}`);
    return false;
  }
}

/**
 * Заголовок запроса без учёта регистра: платформа может передать и «Origin», и «origin».
 * @param {HttpEvent} event
 * @param {string} name
 */
function header(event, name) {
  const wanted = name.toLowerCase();
  for (const [key, value] of Object.entries(event.headers ?? {})) {
    if (key.toLowerCase() === wanted) return value;
  }
  return '';
}

/**
 * Адрес клиента. Если в запросе был X-Forwarded-For, платформа кладёт в sourceIp
 * его адреса и через запятую — настоящий адрес клиента последним. Первые
 * части клиент может подделать, последнюю — нет.
 * @param {HttpEvent} event
 */
function clientIp(event) {
  const raw = event.requestContext?.identity?.sourceIp ?? '';
  return raw.split(',').pop()?.trim() || 'unknown';
}

/**
 * Тело запроса как объект; null — если это не JSON-объект.
 * @param {HttpEvent} event
 * @returns {Record<string, unknown> | null}
 */
function parseBody(event) {
  const raw = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString('utf8') : event.body ?? '';
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Заголовки CORS. Ответ отдаётся всем, но читать его браузер позволит
 * только доменам из списка.
 * @param {string} origin
 * @param {string[]} allowed
 * @returns {Record<string, string>}
 */
function corsHeaders(origin, allowed) {
  return origin && allowed.includes(origin)
    ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
    : { Vary: 'Origin' };
}

/**
 * @param {number} statusCode
 * @param {object} payload
 * @param {Record<string, string>} cors
 * @returns {HttpResponse}
 */
function reply(statusCode, payload, cors) {
  return {
    statusCode,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  };
}

// ── Точка входа Cloud Functions ─────────────────────────────────
// Ограничитель создаётся один раз на экземпляр и переживает вызовы,
// пока экземпляр жив.
const limiter = createRateLimiter(RATE);

/**
 * @param {HttpEvent} event
 * @param {{ token?: { access_token?: string } }} [context]
 */
async function handler(event, context) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return handle(event, {
    allowedOrigins,
    limiter,
    send: (mail) =>
      sendViaPostbox(mail, {
        token: context?.token?.access_token,
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
      }),
    now: () => new Date(),
  });
}

module.exports = { handler, handle, normalizePhone, createRateLimiter };
