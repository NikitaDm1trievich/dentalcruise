/**
 * Живой предпросмотр для редактора сайта.
 *
 * Редактор (public/admin/preview.js) показывает справа настоящую страницу
 * сайта во фрейме с меткой ?cms-preview и на каждое нажатие клавиши
 * присылает сюда текущее содержимое записи. Страница сравнивает его с
 * предыдущим и подменяет изменившиеся строки прямо в тексте.
 *
 * Почему сравнение строк, а не разметка каждого поля атрибутами: полей
 * больше сотни в двух десятках компонентов, и любая новая вёрстка без
 * атрибута молча выпадала бы из предпросмотра. Строка, которую владелец
 * правит, почти всегда лежит на странице дословно, её и находим.
 *
 * Чего предпросмотр не умеет, пока запись не опубликована:
 *   • новые и удалённые элементы списков: вёрстку для них собирает сборка;
 *   • текст, который шаблон переделывает (регистр, склейка с другим полем);
 *   • новые загруженные картинки: файла ещё нет на сайте.
 * О первом страница показывает плашку.
 *
 * Безопасность: работает только внутри фрейма и только с сообщениями от
 * родительского окна. Текст вставляется через nodeValue, а не как HTML,
 * цвет применяется, только если это цвет. Подсунуть странице разметку
 * или скрипт через сообщение нельзя.
 */
import { themeEntries } from './theme-vars';

type Leaves = Map<string, string>;

interface Binding {
  node: Text;
  before: string;
  after: string;
}

const HIGHLIGHT_MS = 1200;

/** Все строковые листья записи с путями вида `hero.title`, `items.2.price`. */
function flatten(value: unknown, path = '', out: Leaves = new Map()): Leaves {
  if (typeof value === 'string' || typeof value === 'number') {
    out.set(path, String(value));
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, path ? `${path}.${index}` : String(index), out));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) flatten(item, path ? `${path}.${key}` : key, out);
  }
  return out;
}

/** Текстовые узлы внутри элемента, кроме скриптов и стилей. */
function textNodes(root: Element): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement?.closest('script, style, noscript, template')
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
}

function locate(node: Text, needle: string): Binding {
  const value = node.nodeValue ?? '';
  const at = value.indexOf(needle);
  return { node, before: value.slice(0, at), after: value.slice(at + needle.length) };
}

/**
 * Места на странице, где стоит строка. Сначала узлы, равные ей целиком:
 * так «Врачи» в заголовке не зацепит «Врачи клиники» в меню. Только если
 * таких нет, берём вхождение внутри узла, например «Стаж 3 года».
 * Короткие строки внутри узлов не ищем: «до» или «₽» нашлись бы везде.
 */
function bind(text: string, root: Element): Binding[] {
  const needle = text.trim();
  if (!needle) return [];
  const nodes = textNodes(root);

  const exact = nodes.filter((node) => node.nodeValue?.trim() === needle).map((node) => locate(node, needle));
  if (exact.length > 0 || needle.length < 4) return exact;

  return nodes.filter((node) => node.nodeValue?.includes(needle)).map((node) => locate(node, needle));
}

/**
 * Сначала ищем строку в блоке, к которому относится поле: у текстов
 * главной первый сегмент пути совпадает с id секции (`contacts.cta` лежит
 * в #contacts). Без этого правка кнопки «Записаться на приём» в блоке
 * контактов перекрашивала бы одноимённые кнопки по всей странице.
 * Блока нет или строки в нём нет — ищем по всей странице.
 */
function bindScoped(text: string, path: string): Binding[] {
  const key = path.split('.')[0];
  const scope =
    (key && (document.getElementById(key) ?? document.querySelector(`[data-cms-scope~="${CSS.escape(key)}"]`))) ||
    null;
  if (scope) {
    const inside = bind(text, scope);
    if (inside.length > 0) return inside;
  }
  return bind(text, document.body);
}

function isColor(value: string): boolean {
  return /^#[0-9a-f]{3,8}$/i.test(value) || /^(rgb|hsl)a?\([\d\s.,%/]+\)$/i.test(value);
}

function notice(message: string) {
  let bar = document.querySelector<HTMLElement>('[data-cms-preview-notice]');
  if (!bar) {
    bar = document.createElement('div');
    bar.dataset.cmsPreviewNotice = '';
    bar.setAttribute('role', 'status');
    document.body.append(bar);
  }
  bar.textContent = message;
}

function flash(element: HTMLElement) {
  element.classList.remove('dc-cms-changed');
  // Перезапуск анимации: без чтения геометрии класс не сбрасывается,
  // и вторая правка того же поля не подсвечивается.
  void element.offsetWidth;
  element.classList.add('dc-cms-changed');
  window.setTimeout(() => element.classList.remove('dc-cms-changed'), HIGHLIGHT_MS);
}

export function initCmsPreview() {
  if (!document.documentElement.classList.contains('dc-cms-preview')) return;
  if (window.parent === window) return;

  let previous: Leaves | null = null;
  const bindings = new Map<string, Binding[]>();
  let lastScrolled = '';

  window.addEventListener('message', (event) => {
    // Сообщение отправляет код редактора из главного окна, но через фрейм
    // предпросмотра, поэтому источником может оказаться любое из двух.
    if (event.source !== window.parent && event.source !== window.top) return;
    const message = event.data as { type?: string; kind?: string; data?: unknown } | null;
    if (!message || message.type !== 'dc-cms-preview') return;

    const data = message.data ?? {};

    if (message.kind === 'theme') {
      for (const [name, value] of themeEntries(data as Record<string, Record<string, string>>)) {
        if (isColor(value)) document.documentElement.style.setProperty(name, value);
      }
      return;
    }

    const leaves = flatten(data);

    // Первое сообщение — точка отсчёта: страница собрана ровно из этих данных.
    if (!previous) {
      previous = leaves;
      return;
    }

    let scrolled = false;
    for (const [path, value] of leaves) {
      const old = previous.get(path);
      if (old === undefined || old === value) continue;

      // Место строки ищем один раз, по прежнему значению, и дальше держим
      // узлы: иначе поле, стёртое до пустоты, потеряло бы привязку.
      if (!bindings.has(path)) bindings.set(path, bindScoped(old, path));
      const found = bindings.get(path) ?? [];

      for (const binding of found) {
        binding.node.nodeValue = `${binding.before}${value}${binding.after}`;
      }

      const target = found[0]?.node.parentElement;
      if (!target) continue;
      flash(target);
      if (!scrolled && path !== lastScrolled) {
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        lastScrolled = path;
        scrolled = true;
      }
    }

    const before = previous;
    const structureChanged =
      [...leaves.keys()].some((key) => !before.has(key)) || [...before.keys()].some((key) => !leaves.has(key));
    if (structureChanged) {
      notice('Добавленные и удалённые элементы появятся на странице после сохранения и публикации.');
    }

    previous = leaves;
  });
}
