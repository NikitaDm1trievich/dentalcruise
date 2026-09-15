import { Hono } from 'hono';
import { cors } from 'hono/cors';

/**
 * Приём заявок с формы записи сайта «Дентал Круиз».
 *
 * Зачем нужен отдельный Worker: токен Telegram-бота нельзя класть в статику —
 * любой посетитель прочитал бы его в исходниках страницы. Здесь токен живёт
 * в секретах Cloudflare, а браузер обращается только к этому эндпоинту.
 *
 * Данные нигде не сохраняются: заявка уходит в Telegram и забывается.
 */

type Bindings = {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  ALLOWED_ORIGINS: string;
  BOOKING_LIMIT?: { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
};

type Booking = {
  name: string;
  /** Телефон в E.164: +79255777677 */
  contact: string;
  comment: string;
  /** Адрес страницы, с которой ушла заявка (вместе с utm-метками), и реферер — если сайт их прислал */
  page: string;
  referrer: string;
};

const MAX = { name: 80, contact: 40, comment: 600, page: 300, referrer: 300 } as const;

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', async (c, next) => {
  const allowed = c.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
  return cors({
    origin: (origin) => (allowed.includes(origin) ? origin : null),
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86400,
  })(c, next);
});

app.get('/health', (c) => c.json({ ok: true }));

app.post('/booking', async (c) => {
  // ── Частота: защита от перебора и спама ──────────────────────
  // IP нужен только здесь, как ключ ограничителя; дальше он не идёт.
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
  if (c.env.BOOKING_LIMIT) {
    const { success } = await c.env.BOOKING_LIMIT.limit({ key: ip });
    if (!success) {
      return c.json({ ok: false, error: 'Слишком много заявок. Попробуйте через минуту.' }, 429);
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'Некорректный запрос' }, 400);
  }

  // ── Ловушка для ботов ────────────────────────────────────────
  // Поле скрыто от людей. Заполнено — значит это бот. Отвечаем 200,
  // чтобы он не понял, что отсеян, но никуда ничего не шлём.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return c.json({ ok: true });
  }

  const booking = validate(body);
  if ('error' in booking) return c.json({ ok: false, error: booking.error }, 400);

  const sent = await sendToTelegram(c.env, booking);
  if (!sent) {
    return c.json({ ok: false, error: 'Не удалось передать заявку. Позвоните нам.' }, 502);
  }

  return c.json({ ok: true });
});

app.notFound((c) => c.json({ ok: false, error: 'Не найдено' }, 404));

export default app;

/** Проверка и нормализация полей формы. */
function validate(body: Record<string, unknown>): Booking | { error: string } {
  const str = (value: unknown, limit: number) =>
    typeof value === 'string' ? value.trim().slice(0, limit) : '';

  const name = str(body.name, MAX.name);
  const contact = normalizePhone(str(body.contact, MAX.contact));
  const comment = str(body.comment, MAX.comment);
  const page = str(body.page, MAX.page);
  const referrer = str(body.referrer, MAX.referrer);
  const consent = body.consent === true || body.consent === 'on' || body.consent === 'true';

  if (name.length < 2) return { error: 'Укажите имя' };
  if (!contact) return { error: 'Введите номер в формате +7 900 000-00-00' };
  if (!consent) return { error: 'Нужно согласие на обработку персональных данных' };

  return { name, contact, comment, page, referrer };
}

/**
 * Телефон → E.164 («+79255777677») или null, если это не российский номер.
 *
 * Принимаются 11 цифр с ведущей 7; 8 вместо 7 — старый межгород; десять цифр —
 * номер без кода страны (российские номера с 7 не начинаются, поэтому неполный
 * «+7 925 577-76-7» сюда не проскочит). Строже — первая цифра 9 и т.п. — не
 * проверяем: городские номера тоже нужны. Форма присылает уже E.164, но старая
 * версия сайта и ручные запросы шлют что угодно — нормализуем и здесь.
 *
 *   '+7 (925) 577-76-77' → '+79255777677'
 *   '89255777677'        → '+79255777677'
 *   '9255777677'         → '+79255777677'
 *   '+1 212 555 0100'    → null
 */
export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 10 && !digits.startsWith('7')) digits = `7${digits}`;
  else if (digits.length === 11 && digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  return /^7\d{10}$/.test(digits) ? `+${digits}` : null;
}

/** Отправка заявки в чат Telegram. */
async function sendToTelegram(env: Bindings, booking: Booking): Promise<boolean> {
  const when = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow',
  }).format(new Date());

  const lines = [
    '<b>Новая заявка с сайта</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(booking.name)}`,
    `<b>Телефон:</b> ${escapeHtml(booking.contact)}`,
  ];
  if (booking.comment) lines.push(`<b>Комментарий:</b> ${escapeHtml(booking.comment)}`);
  if (booking.page) lines.push(`<b>Страница:</b> ${escapeHtml(booking.page)}`);
  if (booking.referrer) lines.push(`<b>Переход с:</b> ${escapeHtml(booking.referrer)}`);
  // IP посетителя в сообщение не пишем: это персональные данные, и мессенджеру
  // они ни к чему — от спама защищает ограничитель частоты выше.
  lines.push('', `<i>${when} МСК</i>`);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: lines.join('\n'),
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}

/** Экранирование под parse_mode: HTML — текст полей приходит от пользователя. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
