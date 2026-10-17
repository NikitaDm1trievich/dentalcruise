/**
 * Рейтинг клиники на Яндекс Картах — подтягивается при сборке сайта.
 *
 * Резервные цифры — в src/data/home.json (раздел «Отзывы» редактора). При
 * сборке сайт открывает страницу отзывов организации на Яндекс Картах и
 * берёт из её микроразметки (schema.org) среднюю оценку и число отзывов.
 * Первое вхождение `itemProp="ratingValue"` / `"reviewCount"` на странице —
 * сама организация, дальше идут оценки отдельных отзывов.
 *
 * Сборка не должна падать из-за Яндекса: таймаут, ошибка сети, капча
 * (сборку в GitHub Actions запускают зарубежные серверы) или цифры, не
 * похожие на правду, — предупреждение в лог и резервные значения из
 * редактора. Посетитель к Яндексу не обращается: запрос делает сервер сборки.
 *
 * Сайт пересобирается раз в сутки по расписанию (.github/workflows/deploy.yml),
 * так цифры на сайте не отстают от карточки больше чем на день.
 *
 * Адрес страницы — ссылка на организацию из контактов клиники
 * (clinic.links.yandexOrg) плюс `reviews/`. Для проверки запасного пути адрес
 * можно подменить переменной сборки YANDEX_RATING_URL.
 */
import { clinic } from '../data/site';
import copy from '../data/home.json';
import { plural } from './format';

export type Rating = {
  /** Средняя оценка, 1–5 */
  value: number;
  /** Число отзывов */
  count: number;
  /** Откуда цифры: со страницы Яндекса или резервные из редактора */
  source: 'yandex' | 'fallback';
};

const TIMEOUT = 10_000;
/** Обычный браузер: на запрос без него Яндекс сразу отвечает капчей */
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
  'Accept-Language': 'ru-RU,ru;q=0.9',
  Accept: 'text/html,application/xhtml+xml',
};

/** Значение первого `<meta itemprop="<name>" content="…">` на странице. */
function metaContent(html: string, name: string): string | null {
  const tag = new RegExp(`<meta\\b[^>]*\\bitemprop=["']${name}["'][^>]*>`, 'i').exec(html)?.[0];
  return tag ? (/\bcontent=["']([^"']*)["']/i.exec(tag)?.[1] ?? null) : null;
}

/**
 * Цифры со страницы отзывов или причина, почему их нельзя брать.
 * Число отзывов меньше половины резервного — скорее чужой блок разметки
 * или урезанная страница, чем настоящее падение: такое на сайт не пускаем.
 */
export function parseRating(html: string, fallbackCount: number): { value: number; count: number } | string {
  const valueText = metaContent(html, 'ratingValue');
  const countText = metaContent(html, 'reviewCount');
  if (valueText === null || countText === null) {
    return /captcha|smartcaptcha/i.test(html) ? 'Яндекс показал капчу' : 'на странице нет микроразметки рейтинга';
  }
  const value = Number(valueText.replace(',', '.'));
  const count = Number(countText);
  if (!Number.isFinite(value) || value < 1 || value > 5) return `рейтинг «${valueText}» вне 1–5`;
  if (!Number.isInteger(count) || count <= 0) return `число отзывов «${countText}» — не целое больше нуля`;
  if (count < fallbackCount * 0.5) return `отзывов ${count} — меньше половины резервных ${fallbackCount}`;
  return { value, count };
}

async function load(): Promise<Rating> {
  const fallback: Rating = { value: copy.reviews.rating.value, count: copy.reviews.count.value, source: 'fallback' };
  const url = process.env.YANDEX_RATING_URL || new URL('reviews/', clinic.links.yandexOrg).href;

  let result: Rating = fallback;
  let problem = '';
  try {
    const response = await fetch(url, { headers: HEADERS, redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT) });
    if (!response.ok) {
      problem = `ответ ${response.status}`;
    } else if (/showcaptcha/i.test(response.url)) {
      problem = 'Яндекс показал капчу';
    } else {
      const parsed = parseRating(await response.text(), fallback.count);
      if (typeof parsed === 'string') problem = parsed;
      else result = { ...parsed, source: 'yandex' };
    }
  } catch (error) {
    problem = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  }

  if (problem) console.warn(`[рейтинг] не удалось взять рейтинг с Яндекс Карт (${url}): ${problem}. Беру резервные цифры из редактора.`);
  console.info(`[рейтинг] ${formatRating(result.value)} · отзывов ${result.count} · источник ${result.source}`);
  return result;
}

let cached: Promise<Rating> | undefined;

/**
 * Рейтинг для страниц. Запрос к Яндексу — один на всю сборку: страницы
 * получают одно и то же обещание.
 */
export function yandexRating(): Promise<Rating> {
  cached ??= load();
  return cached;
}

/**
 * Слово после числа отзывов: «63 отзыва», «60 отзывов». Формы пишет
 * владелец в редакторе через запятую — для 1, для 2–4 и для 5 («отзыв,
 * отзыва, отзывов»). Если форма одна (старое значение «отзывов») — она и
 * идёт после любого числа.
 */
export function reviewsWord(count: number): string {
  const forms = copy.reviews.countLabel.split(',').map((form) => form.trim()).filter(Boolean);
  return forms.length >= 3 ? plural(count, [forms[0], forms[1], forms[2]]) : (forms[0] ?? '');
}

/** «4.8» → «4,8»: на сайте оценка с запятой и одним знаком после неё. */
export function formatRating(value: number): string {
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
