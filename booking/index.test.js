// @ts-check
'use strict';

/**
 * Тесты обработчика без сети и без облака: отправка письма подменяется
 * функцией-шпионом, часы — фиксированным временем.
 *
 *   npm test
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { handle, normalizePhone, createRateLimiter } = require('./index.js');

const SITE = 'https://dentalcruise.ru';
const VALID = {
  name: 'Анна',
  contact: '+7 (925) 577-76-77',
  comment: 'Болит зуб',
  consent: 'on',
  page: 'https://dentalcruise.ru/prices/?utm_source=yandex',
  referrer: 'https://ya.ru/',
  website: '',
};

/**
 * Окружение одного теста: свои часы, свой ограничитель частоты и список
 * «отправленных» писем.
 * @param {{ sendResult?: boolean }} [options]
 */
function setup({ sendResult = true } = {}) {
  let clock = Date.parse('2026-10-11T09:30:00Z');
  /** @type {{ subject: string, text: string }[]} */
  const sent = [];
  const deps = {
    allowedOrigins: [SITE, 'https://www.dentalcruise.ru'],
    limiter: createRateLimiter({ limit: 5, windowMs: 60_000, now: () => clock }),
    /** @param {{ subject: string, text: string }} mail */
    send: async (mail) => {
      sent.push(mail);
      return sendResult;
    },
    now: () => new Date(clock),
  };
  /**
   * @param {{ method?: string, body?: unknown, origin?: string, ip?: string, rawBody?: string, base64?: boolean }} [request]
   */
  const call = ({ method = 'POST', body = VALID, origin = SITE, ip = '203.0.113.7', rawBody, base64 = false } = {}) => {
    const text = rawBody ?? JSON.stringify(body);
    return handle(
      {
        httpMethod: method,
        headers: { Origin: origin, 'Content-Type': 'application/json' },
        body: base64 ? Buffer.from(text).toString('base64') : text,
        isBase64Encoded: base64,
        requestContext: { identity: { sourceIp: ip } },
      },
      deps,
    );
  };
  return { call, sent, tick: (/** @type {number} */ ms) => (clock += ms) };
}

/** @param {{ body: string }} response */
const json = (response) => JSON.parse(response.body);

// ── Телефон ──────────────────────────────────────────────────────

test('телефон в любой российской записи приводится к E.164', () => {
  assert.equal(normalizePhone('+7 (925) 577-76-77'), '+79255777677');
  assert.equal(normalizePhone('89255777677'), '+79255777677');
  assert.equal(normalizePhone('9255777677'), '+79255777677');
  assert.equal(normalizePhone('+79255777677'), '+79255777677');
});

test('неполный или не российский номер не принимается', () => {
  assert.equal(normalizePhone('+7 925 577-76-7'), null);
  assert.equal(normalizePhone('+1 212 555 0100'), null);
  assert.equal(normalizePhone(''), null);
});

// ── Заявка ───────────────────────────────────────────────────────

test('корректная заявка уходит письмом и получает { ok: true }', async () => {
  const { call, sent } = setup();
  const response = await call();

  assert.equal(response.statusCode, 200);
  assert.deepEqual(json(response), { ok: true });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].subject, 'Заявка с сайта: Анна');
  assert.equal(
    sent[0].text,
    [
      'Новая заявка с сайта',
      '',
      'Имя: Анна',
      'Телефон: +79255777677',
      'Комментарий: Болит зуб',
      'Страница: https://dentalcruise.ru/prices/?utm_source=yandex',
      'Переход с: https://ya.ru/',
      '',
      '11.10.2026, 12:30 МСК',
    ].join('\n'),
  );
});

test('IP посетителя в письмо не попадает', async () => {
  const { call, sent } = setup();
  await call({ ip: '198.51.100.23' });
  assert.ok(!sent[0].text.includes('198.51.100.23'));
  assert.ok(!sent[0].subject.includes('198.51.100.23'));
});

test('необязательные поля без значения в письмо не выводятся', async () => {
  const { call, sent } = setup();
  await call({ body: { name: 'Анна', contact: '89255777677', consent: true } });
  assert.equal(sent[0].text, ['Новая заявка с сайта', '', 'Имя: Анна', 'Телефон: +79255777677', '', '11.10.2026, 12:30 МСК'].join('\n'));
});

test('перевод строки в имени не ломает тему письма', async () => {
  const { call, sent } = setup();
  await call({ body: { ...VALID, name: 'Анна\r\nBcc: spam@example.com' } });
  assert.equal(sent[0].subject, 'Заявка с сайта: Анна Bcc: spam@example.com');
});

test('тело в Base64 тоже читается', async () => {
  const { call, sent } = setup();
  const response = await call({ base64: true });
  assert.equal(response.statusCode, 200);
  assert.equal(sent.length, 1);
});

test('без согласия — 400 и письмо не отправляется', async () => {
  const { call, sent } = setup();
  const response = await call({ body: { ...VALID, consent: '' } });
  assert.equal(response.statusCode, 400);
  assert.deepEqual(json(response), { ok: false, error: 'Нужно согласие на обработку персональных данных' });
  assert.equal(sent.length, 0);
});

test('короткое имя и неполный телефон — 400 с понятным текстом', async () => {
  const { call } = setup();
  assert.deepEqual(json(await call({ body: { ...VALID, name: 'А' } })), { ok: false, error: 'Укажите имя' });
  assert.deepEqual(json(await call({ body: { ...VALID, contact: '+7 925 577' } })), {
    ok: false,
    error: 'Введите номер в формате +7 900 000-00-00',
  });
});

test('не JSON — 400 «Некорректный запрос»', async () => {
  const { call } = setup();
  for (const rawBody of ['{name:', 'null', '"строка"']) {
    const response = await call({ rawBody });
    assert.equal(response.statusCode, 400);
    assert.deepEqual(json(response), { ok: false, error: 'Некорректный запрос' });
  }
});

test('заполненная ловушка — бот получает { ok: true }, письма нет', async () => {
  const { call, sent } = setup();
  const response = await call({ body: { ...VALID, website: 'http://spam.example' } });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(json(response), { ok: true });
  assert.equal(sent.length, 0);
});

test('почта не приняла письмо — 502 с просьбой позвонить', async () => {
  const { call } = setup({ sendResult: false });
  const response = await call();
  assert.equal(response.statusCode, 502);
  assert.deepEqual(json(response), { ok: false, error: 'Не удалось передать заявку. Позвоните нам.' });
});

// ── Частота ──────────────────────────────────────────────────────

test('шестая заявка за минуту с одного IP — 429, с другого IP — проходит', async () => {
  const { call, sent } = setup();
  for (let i = 0; i < 5; i++) assert.equal((await call()).statusCode, 200);

  const limited = await call();
  assert.equal(limited.statusCode, 429);
  assert.deepEqual(json(limited), { ok: false, error: 'Слишком много заявок. Попробуйте через минуту.' });
  assert.equal(sent.length, 5);

  assert.equal((await call({ ip: '203.0.113.8' })).statusCode, 200);
});

test('через минуту лимит снова пускает', async () => {
  const { call, tick } = setup();
  for (let i = 0; i < 5; i++) await call();
  assert.equal((await call()).statusCode, 429);
  tick(60_001);
  assert.equal((await call()).statusCode, 200);
});

test('подставной X-Forwarded-For не обходит лимит', async () => {
  // Платформа дописывает настоящий адрес клиента последним: «подделка, настоящий»
  const { call } = setup();
  for (let i = 0; i < 5; i++) await call({ ip: `10.0.0.${i}, 203.0.113.7` });
  assert.equal((await call({ ip: '10.0.0.99, 203.0.113.7' })).statusCode, 429);
});

// ── CORS и прочие методы ─────────────────────────────────────────

test('ответ разрешённому домену несёт Access-Control-Allow-Origin', async () => {
  const { call } = setup();
  const response = await call();
  assert.equal(response.headers['Access-Control-Allow-Origin'], SITE);
});

test('чужому домену заголовок CORS не выдаётся', async () => {
  const { call } = setup();
  const response = await call({ origin: 'https://evil.example' });
  assert.equal(response.headers['Access-Control-Allow-Origin'], undefined);
});

test('preflight OPTIONS с разрешённого домена — 204 с методами и заголовками', async () => {
  const { call, sent } = setup();
  const response = await call({ method: 'OPTIONS', rawBody: '' });
  assert.equal(response.statusCode, 204);
  assert.equal(response.headers['Access-Control-Allow-Origin'], SITE);
  assert.equal(response.headers['Access-Control-Allow-Methods'], 'POST, OPTIONS');
  assert.equal(response.headers['Access-Control-Allow-Headers'], 'Content-Type');
  assert.equal(sent.length, 0);
});

test('preflight с чужого домена — без разрешающих заголовков', async () => {
  const { call } = setup();
  const response = await call({ method: 'OPTIONS', rawBody: '', origin: 'https://evil.example' });
  assert.equal(response.headers['Access-Control-Allow-Origin'], undefined);
});

test('GET — проверка живости { ok: true }, прочие методы — 404', async () => {
  const { call } = setup();
  assert.deepEqual(json(await call({ method: 'GET', rawBody: '' })), { ok: true });
  const response = await call({ method: 'DELETE', rawBody: '' });
  assert.equal(response.statusCode, 404);
  assert.deepEqual(json(response), { ok: false, error: 'Не найдено' });
});
