/**
 * Приведение пути к базовому адресу сборки.
 *
 * Сайт собирается и в корень домена (`BASE=/`), и в подпапку GitHub Pages
 * (`BASE=/dentalcruise/`). Любая ссылка на файл из `public/` обязана пройти
 * через эту функцию, иначе в подпапке она укажет в корень домена и отдаст 404.
 *
 * Особенно это касается путей из JSON-контента: там пишут `/images/...`,
 * ничего не зная про базовый путь. Поэтому нормализуют не в шаблоне
 * страницы, а в самих компонентах, которые эти пути принимают.
 *
 * Внешние адреса (http, //, data:, mailto:, tel:) остаются как есть.
 */
const BASE = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  // Пустая строка — это корень сайта: `withBase('')` должен дать «/» или
  // «/dentalcruise/», а не пустой href. Так вызывают ссылку «На главную».
  if (path === '' || path === '/') return BASE;
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path;

  const normalized = `/${path}`.replace(/\/{2,}/g, '/');

  // Идемпотентность: путь, уже приведённый к базе, второй раз не префиксуем.
  // Иначе достаточно один раз вызвать функцию и в шаблоне, и внутри
  // компонента, чтобы получить /dentalcruise/dentalcruise/... и 404.
  if (BASE !== '/' && (normalized === BASE.replace(/\/$/, '') || normalized.startsWith(BASE))) {
    return normalized;
  }

  return `${BASE}${normalized}`.replace(/\/{2,}/g, '/');
}
