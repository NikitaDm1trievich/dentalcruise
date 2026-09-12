/**
 * Общие сборщики абсолютных адресов и микроразметки.
 *
 * Зачем отдельный модуль: сайт собирается и в подпапку GitHub Pages, и в
 * корень своего домена, а в JSON-LD и в фиды нельзя отдавать относительный
 * путь — поисковик и агрегатор обязаны получить полный адрес страницы.
 * Один раз собираем его здесь, чтобы при переезде на dentalcruise.ru не
 * пришлось искать по шаблонам, где какой префикс забыли.
 */
import { withBase } from './asset';

/** Домен сборки. Подставляется из astro.config (env SITE). */
export const FALLBACK_SITE = 'https://dentalcruise.ru';

/**
 * Абсолютный адрес страницы или файла: базовый путь сборки плюс домен.
 * `path` пишем так же, как в ссылках — «/pricelist», «uslugi/vinir-emax».
 */
export function absolute(path: string, site: URL | undefined): string {
  const relative = withBase(path);
  // Внешние адреса пропускаем как есть: withBase их не трогает, и
  // склеивать их с доменом клиники нельзя.
  if (/^[a-z][a-z0-9+.-]*:/i.test(relative)) return relative;
  // Схлопываем повторяющиеся слеши: путь, начинающийся с «//», браузер и
  // URL() читают как адрес другого домена, и микроразметка уезжает в
  // несуществующий хост.
  return new URL(relative.replace(/\/{2,}/g, '/'), site ?? FALLBACK_SITE).toString();
}

/** Корень сайта — он же `@id` организации в JSON-LD. */
export function siteRoot(site: URL | undefined): string {
  return absolute('', site);
}

/** Единый идентификатор клиники: на него ссылаются врачи и услуги. */
export function clinicId(site: URL | undefined): string {
  return `${siteRoot(site)}#clinic`;
}

/**
 * Хлебные крошки для поисковика. Ссылки в разметке обязаны быть
 * абсолютными, а последний элемент — без адреса: это текущая страница.
 */
export function breadcrumbSchema(
  trail: { label: string; path?: string }[],
  site: URL | undefined,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Главная', path: '/' }, ...trail].map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.path ? { item: absolute(crumb.path, site) } : {}),
    })),
  };
}

/**
 * Цена из контента написана для человека: «от 25 000 ₽», «59 900 ₽».
 * Фидам и разметке нужно число. Возвращаем null, если числа в строке нет —
 * лучше не отдать цену, чем отдать ноль и попасть в выдачу с «0 ₽».
 */
export function priceValue(price: string | undefined): number | null {
  if (!price) return null;
  const digits = price.replace(/[^\d]/g, '');
  if (!digits) return null;
  const value = Number(digits);
  return Number.isFinite(value) && value > 0 ? value : null;
}

/** «от 25 000 ₽» — цена не точная, а нижняя граница. */
export function isFromPrice(price: string | undefined): boolean {
  return /^\s*от\b/i.test(price ?? '');
}

/** Стаж из контента — «27 лет», «3 года». В фид уходит числом. */
export function experienceYears(experience: string | undefined): number | null {
  const match = /(\d+)/.exec(experience ?? '');
  return match ? Number(match[1]) : null;
}

/** Экранирование текста для XML-фидов: & < > " в значениях недопустимы. */
export function xml(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Компактная ссылка на клинику для разметки внутренних страниц.
 *
 * Один `@id` без полей формально верен, но связать его с карточкой
 * организации робот сможет только если увидит и главную страницу. Поэтому
 * отдаём тот же идентификатор вместе с названием и адресом: страница врача
 * или услуги остаётся понятной сама по себе, а дубля полной карточки
 * клиники на каждой странице всё равно не возникает.
 */
export function clinicRef(
  site: URL | undefined,
  clinic: {
    name: string;
    phoneE164: string;
    address: { street: string; locality: string; region: string; country: string };
  },
): Record<string, unknown> {
  return {
    '@type': 'Dentist',
    '@id': clinicId(site),
    name: clinic.name,
    url: siteRoot(site),
    telephone: clinic.phoneE164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.locality,
      addressRegion: clinic.address.region,
      addressCountry: clinic.address.country,
    },
  };
}
