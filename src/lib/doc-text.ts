/**
 * Текст юридических документов (политика, согласие, cookie) из редактора
 * в HTML.
 *
 * Владелец правит раздел документа в поле Markdown: абзацы, списки,
 * подзаголовки, жирный и курсив, ссылки. Здесь — только этот набор и
 * ничего больше: сырой HTML из текста не проходит (всё экранируется до
 * разбора), картинок и таблиц нет. Полноценная Markdown-библиотека ради
 * трёх страниц — лишняя зависимость, а узкий набор заодно не даст случайно
 * сломать вёрстку документа.
 *
 * Реквизиты, адрес, телефон и почта в тексте — метки `{ИНН}`, `{почта}`…:
 * их значения сайт берёт из контактов клиники (см. src/layouts/DocumentLayout).
 *
 * Ссылка на страницу сайта пишется от корня — `[Согласие](/consent/)`, и
 * адрес приводится к базовому пути сборки функцией `internalHref`. Голые
 * адреса `https://…` и почта становятся ссылками сами.
 */
import { fill } from './format';

export type DocTextOptions = {
  /** Значения меток `{…}` */
  values: Record<string, string>;
  /** Адрес страницы сайта по пути от корня (`/consent/` → с базовым путём) */
  internalHref: (path: string) => string;
};

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Экранированный символ Markdown (`\*`, `\_`) прячем на время разбора в
   символ из области частного использования, потом возвращаем как есть. */
const ESC = 0xe000;
const hideEscapes = (text: string) =>
  text.replace(/\\([\\`*_{}\[\]()#+\-.!>|~])/g, (_, ch: string) => String.fromCharCode(ESC + ch.charCodeAt(0)));
const showEscapes = (text: string) =>
  text.replace(/[-]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - ESC));

/** Точка, запятая, кавычка в конце голого адреса — это текст, а не адрес. */
const TRAILING = /[.,;:!?»)]+$/;

function anchor(href: string, label: string, external: boolean): string {
  const target = external ? ' target="_blank" rel="noopener"' : '';
  return `<a href="${href}"${target}>${label}</a>`;
}

/** Куда ведёт ссылка из текста. Чужие схемы (javascript: и т. п.) — не ссылка. */
function resolveHref(raw: string, internalHref: DocTextOptions['internalHref']): { href: string; external: boolean } | null {
  const href = raw.trim();
  if (/^https?:\/\//i.test(href)) return { href, external: true };
  // «//host/…» браузер читает как адрес другого сайта — это внешняя ссылка
  if (href.startsWith('//')) return { href: `https:${href}`, external: true };
  if (/^(mailto|tel):/i.test(href)) return { href, external: false };
  if (href.startsWith('/')) return { href: internalHref(href), external: false };
  if (href.startsWith('#')) return { href, external: false };
  return null;
}

/** Жирный и курсив в куске текста без ссылок. */
function emphasis(text: string): string {
  return text
    .replace(/\*\*(?=\S)([^*]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(?=\S)([^_]+?)__/g, '<strong>$1</strong>')
    .replace(/\*(?=\S)([^*]+?)\*/g, '<em>$1</em>')
    // Подчёркивание — только на границе слова: `_ym_uid` курсивом не станет
    .replace(/(^|[^\p{L}\p{N}_])_(?=\S)([^_]+?)_(?![\p{L}\p{N}_])/gu, '$1<em>$2</em>');
}

/** Голые адреса и почта — ссылками, остальное — с жирным и курсивом. */
function autolink(text: string): string {
  const pattern = /(https?:\/\/[^\s<]+)|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
  let out = '';
  let at = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    out += emphasis(text.slice(at, index));
    if (match[1]) {
      const url = match[1].replace(TRAILING, '');
      out += anchor(url, url, true) + match[1].slice(url.length);
    } else {
      const email = match[2].replace(/\.+$/, '');
      out += anchor(`mailto:${email}`, email, false) + match[2].slice(email.length);
    }
    at = index + match[0].length;
  }
  return out + emphasis(text.slice(at));
}

/** Строчная разметка: ссылки `[текст](адрес)`, `<https://…>`, голые адреса, жирный, курсив. */
function inline(text: string, options: DocTextOptions): string {
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|&lt;(https?:\/\/[^\s&]+)&gt;/g;
  let out = '';
  let at = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    out += autolink(text.slice(at, index));
    if (match[3]) {
      out += anchor(match[3], match[3], true);
    } else {
      const target = resolveHref(match[2].replace(/&amp;/g, '&'), options.internalHref);
      out += target ? anchor(escapeHtml(target.href), emphasis(match[1]), target.external) : emphasis(match[1]);
    }
    at = index + match[0].length;
  }
  return out + autolink(text.slice(at));
}

/**
 * Markdown раздела документа → HTML. Подзаголовки внутри раздела (`###`)
 * становятся h3: заголовок самого раздела на странице — h2.
 */
export function renderDocText(markdown: string | null | undefined, options: DocTextOptions): string {
  if (!markdown) return '';
  const values = Object.fromEntries(Object.entries(options.values).map(([key, value]) => [key, escapeHtml(value)]));
  const source = fill(hideEscapes(escapeHtml(markdown.replace(/\r\n?/g, '\n'))), values, { partial: true });

  const blocks: string[] = [];
  let paragraph: string[] = [];
  let list: { tag: 'ul' | 'ol'; items: string[] } | null = null;

  const line = (text: string) => inline(text.replace(/(?: {2,}|\\)$/, '\n'), options).replace(/\n/g, '<br>');
  const flushParagraph = () => {
    if (paragraph.length) blocks.push(`<p>${paragraph.map(line).join(' ').replace(/<br> /g, '<br>')}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push(`<${list.tag}>${list.items.map((item) => `<li>${line(item)}</li>`).join('')}</${list.tag}>`);
    list = null;
  };

  for (const raw of source.split('\n')) {
    const text = raw.trimEnd();
    const heading = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*$/.exec(text);
    const bullet = /^\s*[-*+]\s+(.*)$/.exec(text);
    const numbered = /^\s*\d{1,3}[.)]\s+(.*)$/.exec(text);

    if (!text.trim()) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      const tag = heading[1].length <= 3 ? 'h3' : 'h4';
      blocks.push(`<${tag}>${inline(heading[2], options)}</${tag}>`);
    } else if (bullet || numbered) {
      flushParagraph();
      const tag = bullet ? 'ul' : 'ol';
      if (list && list.tag !== tag) flushList();
      list ??= { tag, items: [] };
      list.items.push((bullet ?? numbered)![1]);
    } else if (list && /^\s+\S/.test(raw)) {
      // Продолжение пункта списка — строка с отступом
      list.items[list.items.length - 1] += ` ${text.trim()}`;
    } else {
      flushList();
      paragraph.push(text.trim());
    }
  }
  flushParagraph();
  flushList();

  return showEscapes(blocks.join('\n'));
}
