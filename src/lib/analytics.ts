/**
 * Яндекс Метрика по согласию посетителя и цели Метрики — в одном месте.
 *
 * Счётчик (tag.js) не вставляется в страницу, пока посетитель не нажал
 * «Принять» в уведомлении о cookie (components/layout/CookieBanner): так
 * обещают политика и политика cookie. Выбор хранится в localStorage
 * 12 месяцев, потом сайт спрашивает снова. Хранилище может быть недоступно
 * (приватное окно, запрет сайта) — тогда выбор живёт до конца страницы, а
 * на следующей уведомление покажется опять: без записи Метрика не грузится.
 *
 * Отказ после согласия: счётчик выключается сразу (`disableYaCounter<id>`
 * — штатный выключатель Метрики), его cookie `_ym*` и записи в
 * localStorage стираются, а со следующей страницы tag.js не загружается.
 *
 * Цели (reachGoal) уходят, только если счётчик реально загружен: без
 * согласия вызов просто ничего не делает. Идентификаторы целей описаны в
 * docs/seo.md — их же создают в интерфейсе Метрики.
 */

const KEY = 'dc_consent';
/** 12 месяцев — срок из политики cookie */
const TTL_MS = 365 * 24 * 60 * 60 * 1000;
const TAG = 'https://mc.yandex.ru/metrika/tag.js';

export type Goal = 'booking_sent' | 'phone_click' | 'max_click' | 'vk_click';

type Consent = { analytics: boolean; ts: string };
type Ym = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
type MetrikaWindow = Window & { ym?: Ym; __dcMetrika?: string } & Record<string, unknown>;

const w = window as unknown as MetrikaWindow;

/** Выбор, сделанный на этой странице, — на случай, если хранилище недоступно */
let memory: Consent | null = null;

/** Выбор посетителя: true — «Принять», false — «Отказаться», null — ещё не выбирал или выбор устарел. */
export function readConsent(): boolean | null {
  let saved: Consent | null = memory;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) saved = JSON.parse(raw) as Consent;
  } catch {
    /* хранилище недоступно или запись испорчена — считаем, что выбора нет */
  }
  if (!saved || typeof saved.analytics !== 'boolean') return null;
  const age = Date.now() - Date.parse(saved.ts);
  if (!Number.isFinite(age) || age > TTL_MS) return null;
  return saved.analytics;
}

export function saveConsent(analytics: boolean): void {
  memory = { analytics, ts: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* не запомнили — уведомление спросит снова на следующей странице */
  }
}

/** Вставить счётчик. Повторный вызов с тем же номером ничего не делает. */
export function startMetrika(id: string): void {
  if (!/^\d{5,12}$/.test(id) || w.__dcMetrika === id) return;
  // Выключатель мог остаться от отказа на этой же странице
  delete w[`disableYaCounter${id}`];
  w.__dcMetrika = id;

  if (!w.ym) {
    const ym: Ym = (...args: unknown[]) => {
      (ym.a = ym.a ?? []).push(args);
    };
    ym.l = Date.now();
    w.ym = ym;
  }
  if (!Array.from(document.scripts).some((script) => script.src === TAG)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = TAG;
    document.head.appendChild(script);
  }

  // Вебвизор (запись сеансов) выключен: политика cookie обещает, что
  // сеансы не записываются. Карта кликов и внешние ссылки — как в ней же.
  w.ym(Number(id), 'init', {
    ssr: true,
    webvisor: false,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
  });
}

/** Отказ: выключить счётчик на этой странице и стереть его следы в браузере. */
export function stopMetrika(id: string): void {
  if (/^\d{5,12}$/.test(id)) w[`disableYaCounter${id}`] = true;
  delete w.__dcMetrika;

  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter((name) => name.startsWith('_ym'));
  // Метрика ставит cookie на домен второго уровня (.dentalcruise.ru) —
  // стираем со всех доменов от текущего вверх, кроме зоны (.ru).
  const parts = location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i += 1) {
    const domain = parts.slice(i).join('.');
    domains.push(`; domain=${domain}`, `; domain=.${domain}`);
  }
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }

  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith('_ym')) window.localStorage.removeItem(key);
    }
  } catch {
    /* хранилище недоступно — и записей Метрики в нём нет */
  }
}

/** Цель Метрики. Без согласия (счётчик не загружен) — ничего не делает. */
export function reachGoal(goal: Goal): void {
  const id = w.__dcMetrika;
  if (!id || typeof w.ym !== 'function') return;
  w.ym(Number(id), 'reachGoal', goal);
}

/** Какая цель у ссылки: телефон, Max, ВКонтакте. */
function goalForLink(link: HTMLAnchorElement): Goal | null {
  const href = link.getAttribute('href') ?? '';
  if (href.startsWith('tel:')) return 'phone_click';
  let host = '';
  try {
    host = new URL(link.href).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
  if (host === 'max.ru' || host.endsWith('.max.ru')) return 'max_click';
  if (/^(m\.)?vk\.(com|ru)$/.test(host)) return 'vk_click';
  return null;
}

let clicksBound = false;

/**
 * Клики по телефону, Max и ВКонтакте — один обработчик на документ: ссылки
 * стоят в шапке, меню, подвале, нижней панели, карточках, и размечать
 * каждую отдельно значило бы забыть новую.
 */
export function trackContactClicks(): void {
  if (clicksBound) return;
  clicksBound = true;
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest?.('a[href]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const goal = goalForLink(link);
      if (goal) reachGoal(goal);
    },
    { capture: true },
  );
}
