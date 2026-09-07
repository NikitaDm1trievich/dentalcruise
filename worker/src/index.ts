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
  contact: string;
  comment: string;
};

const MAX = { name: 80, contact: 40, comment: 600 } as const;

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

  const sent = await sendToTelegram(c.env, booking, ip);
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
  const contact = str(body.contact, MAX.contact);
  const comment = str(body.comment, MAX.comment);
  const consent = body.consent === true || body.consent === 'on' || body.consent === 'true';

  if (name.length < 2) return { error: 'Укажите имя' };
  if (contact.length < 5) return { error: 'Укажите телефон или Max для связи' };
  if (!consent) return { error: 'Нужно согласие на обработку персональных данных' };

  return { name, contact, comment };
}

/** Отправка заявки в чат Telegram. */
async function sendToTelegram(env: Bindings, booking: Booking, ip: string): Promise<boolean> {
  const when = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow',
  }).format(new Date());

  const lines = [
    '<b>Новая заявка с сайта</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(booking.name)}`,
    `<b>Связь:</b> ${escapeHtml(booking.contact)}`,
  ];
  if (booking.comment) lines.push(`<b>Комментарий:</b> ${escapeHtml(booking.comment)}`);
  lines.push('', `<i>${when} МСК · ${escapeHtml(ip)}</i>`);

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

/** Экранирование под parse_mode: HTML — имя пациента приходит от пользователя. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
