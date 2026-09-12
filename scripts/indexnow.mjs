/**
 * Уведомление поисковиков об обновлении сайта по протоколу IndexNow.
 *
 * Обычный обход робота доходит до новой страницы за дни, иногда недели.
 * IndexNow — обратный порядок: сайт сам сообщает, что изменился, и Яндекс
 * с Bing забирают страницы в течение часов. Для клиники это значит, что
 * новый врач или новая цена попадают в поиск сразу после публикации, а не
 * к следующему месяцу.
 *
 * Запускается шагом GitHub Actions уже после выкладки. Ничего не ломает:
 * нет ключа — тихо выходит, сервис недоступен — пишет в лог и выходит.
 *
 *   node scripts/indexnow.mjs https://dentalcruise.ru/
 *
 * Права на домен подтверждает файл <ключ>.txt в корне сайта — его
 * собирает src/pages/[indexnow].txt.ts из того же значения в seo.json.
 */
import { readFileSync } from 'node:fs';

const ENDPOINT = 'https://yandex.com/indexnow';

const base = process.argv[2] ?? process.env.PAGE_URL;
if (!base) {
  console.log('IndexNow: не передан адрес сайта — пропускаем.');
  process.exit(0);
}

const key = JSON.parse(readFileSync(new URL('../src/data/seo.json', import.meta.url), 'utf8'))
  .indexNowKey.trim();
if (!key) {
  console.log('IndexNow: ключ в редакторе не заполнен — уведомление пропущено.');
  process.exit(0);
}

const root = base.endsWith('/') ? base : `${base}/`;

/* Список адресов берём из свежей карты сайта, а не из захардкоженного
   перечня: так уведомление накрывает и страницы, добавленные владельцем
   через редактор, о которых этот скрипт ничего не знает. */
let urls = [];
try {
  const response = await fetch(new URL('sitemap-0.xml', root), { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`карта сайта отдала ${response.status}`);
  const xml = await response.text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} catch (error) {
  console.log(`IndexNow: не удалось прочитать карту сайта (${error.message}) — пропускаем.`);
  process.exit(0);
}

if (urls.length === 0) {
  console.log('IndexNow: в карте сайта нет адресов — пропускаем.');
  process.exit(0);
}

const payload = {
  host: new URL(root).host,
  key,
  keyLocation: new URL(`${key}.txt`, root).toString(),
  // Ограничение протокола — 10 000 адресов на запрос. У клиники их меньше
  // сотни, но пусть предел будет записан явно.
  urlList: urls.slice(0, 10_000),
};

try {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  });
  console.log(`IndexNow: отправлено ${payload.urlList.length} адресов, ответ ${response.status}.`);
} catch (error) {
  console.log(`IndexNow: сервис недоступен (${error.message}) — сайт уже опубликован, это не ошибка.`);
}
