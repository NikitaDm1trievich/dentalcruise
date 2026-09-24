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
 * Выбор блока. В режиме выбора страница обводит блок под курсором и по
 * клику сообщает редактору, какое поле открыть. Блоки главной размечены
 * атрибутом data-cms="<коллекция>/<запись>:<путь>" (src/lib/cms-ref.ts):
 * карточки акций, врачи, вопросы и т.п. лежат в других записях, и по тексту
 * их не найти. Внутри открытой записи поле уточняется обратным поиском:
 * текст под курсором сравнивается со строками записи, как при подмене.
 * Рамка — отдельный слой поверх страницы, стили блоков не трогаются.
 * Клики в режиме выбора перехватываются: ссылка не уводит фрейм со
 * страницы, кнопка не открывает модалку.
 *
 * Безопасность: работает только внутри фрейма и только с сообщениями от
 * родительского окна. Текст вставляется через nodeValue и textContent, а
 * не как HTML, цвет применяется, только если это цвет. Подсунуть странице
 * разметку или скрипт через сообщение нельзя.
 */
import { ArrowUpRight, Lock, Pencil, createElement, type IconNode } from 'lucide';
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

/** Адрес блока из атрибута data-cms: `home/promos:items.2` → запись и путь. */
interface Ref {
  entry: string;
  path: string;
}

const ENTRY = /^[\w-]+\/[^\s:]+$/;
const PATH = /^[\w.-]*$/;

function readRef(element: Element | null): Ref | null {
  const value = element?.getAttribute('data-cms') ?? '';
  const at = value.indexOf(':');
  const entry = at < 0 ? value : value.slice(0, at);
  const path = at < 0 ? '' : value.slice(at + 1);
  return ENTRY.test(entry) && PATH.test(path) ? { entry, path } : null;
}

/** Лежит ли поле `path` внутри `prefix` (пустой префикс — вся запись). */
function within(path: string, prefix: string): boolean {
  return !prefix || path === prefix || path.startsWith(`${prefix}.`);
}

/** Самый вложенный размеченный блок записи `entry`, в котором лежит поле. */
function containerFor(entry: string | null, path: string): Element | null {
  if (!entry) return null;
  let best: Element | null = null;
  let depth = -1;
  for (const element of document.querySelectorAll('[data-cms]')) {
    const ref = readRef(element);
    if (!ref || ref.entry !== entry || !within(path, ref.path) || ref.path.length <= depth) continue;
    best = element;
    depth = ref.path.length;
  }
  return best;
}

/**
 * Сначала ищем строку в блоке, к которому относится поле: в размеченном
 * блоке открытой записи (`promo.title` → секция «Акции», `items.2.price` →
 * третья карточка файла), иначе в элементе с id, равным первому сегменту
 * пути. Без этого правка кнопки «Записаться на приём» в блоке контактов
 * перекрашивала бы одноимённые кнопки по всей странице. Блока нет или
 * строки в нём нет — ищем по всей странице.
 */
function bindScoped(text: string, path: string, entry: string | null): Binding[] {
  const key = path.split('.')[0];
  const scope = containerFor(entry, path) ?? (key ? document.getElementById(key) : null);
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

/* ── Выбор блока ─────────────────────────────────────────────────────── */

type Level = 'section' | 'item' | 'text' | 'locked';
type State = 'hover' | 'pressed' | 'selected' | 'locked';

interface Target {
  element: Element;
  level: Level;
  entry: string;
  path: string;
}

/**
 * Подписи из config.yml: preview.js читает конфиг редактора и присылает
 * дерево «коллекция → файл → поля» с name, label и label_singular. Так
 * подпись над рамкой совпадает с формой слева и не расходится с ней.
 */
interface LabelNode {
  name?: unknown;
  label?: unknown;
  label_singular?: unknown;
  files?: unknown;
  fields?: unknown;
  field?: unknown;
}

const str = (value: unknown) => (typeof value === 'string' ? value : '');
const nodes = (value: unknown): LabelNode[] =>
  Array.isArray(value) ? value.filter((item): item is LabelNode => !!item && typeof item === 'object') : [];
const children = (field: LabelNode) =>
  nodes(field.fields).length > 0 ? nodes(field.fields) : nodes(field.field ? [field.field] : []);

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Строки длиннее не сравниваем: это уже целый блок, а не одно поле. */
const MAX_FIELD_TEXT = 600;
const LOCKED_LABEL = 'Шапку, подвал и кнопки сайта меняет разработчик';

/**
 * Название блока: заголовок внутри него (имя врача, название раздела,
 * вопрос), а без заголовка — первая видимая строка.
 */
function snippet(element: Element): string {
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  for (const node of textNodes(heading ?? element)) {
    const text = normalize(node.nodeValue ?? '');
    if (!text || node.parentElement?.closest('[aria-hidden="true"]')) continue;
    return text.length > 40 ? `${text.slice(0, 39)}…` : text;
  }
  return '';
}

function isNumber(segment: string) {
  return /^\d+$/.test(segment);
}

/** Подпись поля по пути: «3. Акции › Заголовок блока», «акция «Циркониевая коронка»». */
function describe(fields: LabelNode[], path: string, element: Element): string {
  const parts: string[] = [];
  const segments = path ? path.split('.') : [];
  let current = fields;
  let list: LabelNode | null = null;

  for (const [index, segment] of segments.entries()) {
    if (isNumber(segment)) {
      // «Карточки акций › 3» → «акция «Циркониевая коронка»»: название
      // списка заменяем словом из label_singular и самим элементом.
      const listLabel = parts.pop() ?? '';
      const noun = str(list?.label_singular) || listLabel;
      const last = index === segments.length - 1;
      const name = last ? snippet(element) : '';
      parts.push(name ? `${noun} «${name}»` : `${noun} ${Number(segment) + 1}`);
      continue;
    }
    const field = current.find((item) => str(item.name) === segment);
    if (!field) {
      parts.push(segment);
      break;
    }
    parts.push(str(field.label) || segment);
    list = field;
    current = children(field);
  }
  return parts.join(' › ');
}

const ICONS: Record<'edit' | 'open' | 'locked', IconNode> = { edit: Pencil, open: ArrowUpRight, locked: Lock };

/** Слой рамки: один для наведения, второй для блока, открытого в форме. */
class Ring {
  readonly box: HTMLDivElement;
  private readonly chip: HTMLSpanElement;
  private readonly label: HTMLSpanElement;
  private icon: SVGElement | null = null;
  target: Target | null = null;

  constructor(private readonly scale: () => number) {
    this.box = document.createElement('div');
    this.box.className = 'dc-cms-hl';
    this.box.setAttribute('aria-hidden', 'true');
    this.chip = document.createElement('span');
    this.chip.className = 'dc-cms-hl__chip';
    this.label = document.createElement('span');
    this.label.className = 'dc-cms-hl__label';
    this.chip.append(this.label);
    this.box.append(this.chip);
    document.body.append(this.box);
  }

  show(target: Target, state: State, text: string, icon: keyof typeof ICONS) {
    this.target = target;
    this.box.dataset.level = target.level;
    this.box.dataset.state = state;
    this.label.textContent = text;
    const svg = createElement(ICONS[icon], { 'aria-hidden': 'true', 'stroke-width': 2 });
    if (this.icon) this.icon.replaceWith(svg);
    else this.chip.prepend(svg);
    this.icon = svg;
    this.place();
    this.box.dataset.visible = '';
  }

  setState(state: State) {
    if (this.target) this.box.dataset.state = state;
  }

  hide() {
    delete this.box.dataset.visible;
    this.target = null;
  }

  /**
   * Позиция — transform и размеры самого слоя (он fixed), раскладка
   * страницы не меняется. Карточку и текст обводим снаружи с отступом 4px,
   * секцию — внутри: она во всю ширину, внешняя рамка ушла бы за экран.
   */
  place() {
    const target = this.target;
    if (!target) return;
    if (!target.element.isConnected) {
      this.hide();
      return;
    }
    const scale = this.scale();
    const rect = target.element.getBoundingClientRect();
    let { left, top, width, height } = rect;
    let radius = 0;
    let chip: 'above' | 'below' | 'inside' = 'above';

    if (target.level === 'section') {
      // отступ 2px + рамка 2px + половина ореола 2px — всё в экранных пикселях
      const inset = 6 / scale;
      left += inset;
      top += inset;
      width -= 2 * inset;
      height -= 2 * inset;
      chip = 'inside';
    } else {
      const outset = 4 / scale;
      left -= outset;
      top -= outset;
      width += 2 * outset;
      height += 2 * outset;
      radius = (parseFloat(getComputedStyle(target.element).borderTopLeftRadius) || 0) + outset;
      if (top - this.chip.offsetHeight - 8 / scale < 0) chip = 'below';
    }

    this.box.dataset.chip = chip;
    // Высокая секция: верх ушёл за экран — подпись держим в видимой части.
    this.chip.style.top = chip === 'inside' && top < 0 ? `${-top + 8 / scale}px` : '';
    // Блок у правого края: подпись сдвигаем влево, чтобы не обрезалась.
    const overflow = left + this.chip.offsetLeft + this.chip.offsetWidth - (document.documentElement.clientWidth - 8 / scale);
    this.chip.style.translate = overflow > 0 ? `${-Math.min(overflow, Math.max(left, 0))}px 0` : '';
    this.box.style.transform = `translate(${left}px, ${top}px)`;
    this.box.style.width = `${Math.max(width, 0)}px`;
    this.box.style.height = `${Math.max(height, 0)}px`;
    this.box.style.setProperty('--dc-cms-hl-radius', `${radius}px`);
  }
}

const sameTarget = (a: Target | null, b: Target | null) =>
  !!a && !!b && a.element === b.element && a.entry === b.entry && a.path === b.path;

export function initCmsPreview() {
  if (!document.documentElement.classList.contains('dc-cms-preview')) return;
  if (window.parent === window) return;

  // Редактор открывает файлы-списки главной на их блоке (`?cms-preview#faq`).
  // Модуль грузится уже после разбора страницы, и собственный переход
  // браузера к якорю к этому моменту мог не случиться — докручиваем сами.
  const anchor = window.location.hash.slice(1);
  if (anchor) document.getElementById(decodeURIComponent(anchor))?.scrollIntoView({ block: 'start' });

  let previous: Leaves | null = null;
  const bindings = new Map<string, Binding[]>();
  let lastScrolled = '';
  /** Открытая в редакторе запись: `home/texts`, `doctors/terapevt`. */
  let current: string | null = null;
  let labels: LabelNode[] = [];
  let scale = 1;
  let picking = false;
  /** Элемент под курсором: последний и уже разобранный (кадр rAF). */
  let pending: Element | null = null;
  let hovered: Element | null = null;
  let frame = 0;

  const root = document.documentElement;
  const hover = new Ring(() => scale);
  const selected = new Ring(() => scale);
  const resized = new ResizeObserver(() => placeAll());

  function placeAll() {
    hover.place();
    selected.place();
  }

  function watch() {
    resized.disconnect();
    for (const ring of [hover, selected]) if (ring.target) resized.observe(ring.target.element);
  }

  /* ── Что под курсором ── */

  /** Поле открытой записи, чей текст совпадает с элементом или его предком. */
  function matchText(start: Element, boundary: Element, prefix: string): { element: Element; path: string } | null {
    if (!previous) return null;
    const candidates = [...previous].filter(([path, value]) => within(path, prefix) && value.trim());

    for (let element: Element | null = start; element; element = element.parentElement) {
      if (element instanceof HTMLImageElement) {
        const src = element.getAttribute('src') ?? '';
        const hit = candidates.find(([, value]) => value.startsWith('/') && src.endsWith(value));
        if (hit) return { element, path: hit[0] };
      }
      const text = normalize(element.textContent ?? '');
      if (text.length > MAX_FIELD_TEXT) break;
      if (text) {
        const hit = candidates.find(([, value]) => normalize(value) === text);
        if (hit) return { element, path: hit[0] };
      }
      if (element === boundary) break;
    }

    // «Стаж 6 лет»: поле — часть строки, остальное дописал шаблон.
    const own = normalize(
      [...start.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.nodeValue)
        .join(' '),
    );
    if (!own) return null;
    const hit = candidates.find(([, value]) => normalize(value).length >= 4 && own.includes(normalize(value)));
    return hit ? { element: start, path: hit[0] } : null;
  }

  function resolve(start: Element | null): Target | null {
    if (!start || start === document.body || start === root) return null;
    if (start.closest('.dc-cms-hl, [data-cms-preview-notice]')) return null;

    const container = start.closest('[data-cms]');
    const ref = readRef(container);

    if (current) {
      // Внутри блока открытой записи или на странице самой записи
      // (врач, услуга) ищем конкретное поле по тексту.
      const prefix = ref ? (ref.entry === current ? ref.path : null) : start.closest('main') ? '' : null;
      if (prefix !== null) {
        const hit = matchText(start, container ?? document.body, prefix);
        if (hit) return { element: hit.element, level: 'text', entry: current, path: hit.path };
      }
    }

    if (container && ref) {
      return {
        element: container,
        level: container.tagName === 'SECTION' ? 'section' : 'item',
        entry: ref.entry,
        path: ref.path,
      };
    }

    // Внутри страницы, но без поля: молчим. Снаружи — шапка, подвал,
    // нижняя панель: их меняет только разработчик.
    if (start.closest('main')) return null;
    let top = start;
    while (top.parentElement && top.parentElement !== document.body) top = top.parentElement;
    if (top.parentElement !== document.body) return null;
    return { element: top, level: 'locked', entry: '', path: '' };
  }

  /* ── Подпись над рамкой ── */

  function chip(target: Target, state: State): { text: string; icon: keyof typeof ICONS } {
    if (target.level === 'locked') return { text: LOCKED_LABEL, icon: 'locked' };

    const [collectionName, ...rest] = target.entry.split('/');
    const entryName = rest.join('/');
    const collection = labels.find((item) => str(item.name) === collectionName);
    const file = nodes(collection?.files).find((item) => str(item.name) === entryName);
    const fields = file ? nodes(file.fields) : nodes(collection?.fields);
    const where = describe(fields, target.path, target.element);

    if (target.entry === current) {
      const title = str(file?.label) || entryName;
      return { text: `${state === 'selected' ? 'Сейчас в форме' : 'Изменить'}: ${where || title}`, icon: 'edit' };
    }

    // Запись папки (врач) называем по самому блоку: там его имя.
    const title = file ? str(file.label) || entryName : snippet(target.element) || entryName;
    const place = file && where ? `${title} › ${where}` : title;
    if (current?.split('/')[0] === collectionName) return { text: `Открыть: ${place}`, icon: 'open' };
    return { text: `Открыть в разделе «${str(collection?.label) || collectionName}»: ${place}`, icon: 'open' };
  }

  function showHover(target: Target | null, state: State = 'hover') {
    if (!target || sameTarget(target, selected.target)) {
      hover.hide();
    } else {
      const { text, icon } = chip(target, target.level === 'locked' ? 'locked' : state);
      hover.show(target, target.level === 'locked' ? 'locked' : state, text, icon);
    }
    watch();
  }

  function select(target: Target | null, scroll = false) {
    if (!target || target.level === 'locked') {
      selected.hide();
    } else {
      const { text, icon } = chip(target, 'selected');
      selected.show(target, 'selected', text, icon);
      if (sameTarget(target, hover.target)) hover.hide();
      if (scroll) {
        const rect = target.element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          target.element.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    }
    watch();
  }

  /** Блок для поля, которое сейчас в фокусе в форме редактора. */
  function targetForPath(path: string): Target | null {
    if (!current || !PATH.test(path)) return null;
    const value = previous?.get(path);
    let element: Element | null = bindings.get(path)?.[0]?.node.parentElement ?? null;
    if (!element && value) {
      element = value.startsWith('/')
        ? ([...document.images].find((image) => (image.getAttribute('src') ?? '').endsWith(value)) ?? null)
        : (bindScoped(value, path, current)[0]?.node.parentElement ?? null);
    }
    if (element) return { element, level: 'text', entry: current, path };

    const container = containerFor(current, path);
    const ref = readRef(container);
    if (!container || !ref) return null;
    return {
      element: container,
      level: container.tagName === 'SECTION' ? 'section' : 'item',
      entry: current,
      path: ref.path,
    };
  }

  /** Запись или подписи пришли позже, чем курсор встал на блок: пересчитать. */
  function refresh() {
    hovered = null;
    if (!picking || !pending) return;
    hovered = pending;
    showHover(resolve(pending));
    if (selected.target) select(selected.target);
  }

  function setPicking(on: boolean) {
    picking = on;
    root.classList.toggle('dc-cms-pick', on);
    if (!on) {
      hover.hide();
      selected.hide();
      watch();
    }
  }

  /* ── Мышь, касание, клавиатура ── */

  document.addEventListener(
    'pointermove',
    (event) => {
      if (!picking || event.pointerType === 'touch') return;
      pending = event.target instanceof Element ? event.target : null;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (pending === hovered) return;
          hovered = pending;
          showHover(resolve(pending));
        });
      }
    },
    { passive: true },
  );

  root.addEventListener('pointerleave', () => {
    hovered = null;
    hover.hide();
    watch();
  });

  window.addEventListener(
    'pointerdown',
    (event) => {
      if (!picking) return;
      const start = event.target instanceof Element ? event.target : null;
      // На касании наведения нет: рамку показываем сразу в нажатом виде.
      if (event.pointerType === 'touch' || !hover.target) showHover(resolve(start), 'pressed');
      else hover.setState(hover.target.level === 'locked' ? 'locked' : 'pressed');
    },
    { capture: true },
  );

  const release = (event: PointerEvent) => {
    if (!picking || !hover.target) return;
    if (event.pointerType === 'touch') {
      hover.hide();
      hovered = null;
      watch();
    } else {
      hover.setState(hover.target.level === 'locked' ? 'locked' : 'hover');
    }
  };
  window.addEventListener('pointerup', release, { capture: true });
  window.addEventListener('pointercancel', release, { capture: true });

  // Клик в режиме выбора — только выбор: ссылка не уводит фрейм со
  // страницы (там предпросмотр перестал бы получать правки), кнопка не
  // открывает модалку, карточка врача не переворачивается.
  const swallow = (event: MouseEvent) => {
    if (!picking) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.type !== 'click') return;
    // Щелчок мышью оставил бы фокус на ссылке или кнопке — со своей
    // рамкой поверх нашей. С клавиатуры (detail = 0) фокус не трогаем.
    if (event.detail > 0 && document.activeElement instanceof HTMLElement) document.activeElement.blur();

    const target = resolve(event.target instanceof Element ? event.target : null);
    if (!target || target.level === 'locked') return;
    select(target);
    // Текст под курсором: блок другой записи адресован целиком, и по тексту
    // редактор после перехода уточнит поле (заголовок, а не первое поле блока).
    const text = event.target instanceof Element ? (event.target.textContent ?? '').trim().slice(0, 2000) : '';
    window.parent.postMessage(
      { type: 'dc-cms-pick', entry: target.entry, path: target.path, text },
      location.origin,
    );
  };
  window.addEventListener('click', swallow, { capture: true });
  window.addEventListener('auxclick', swallow, { capture: true });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    hover.hide();
    selected.hide();
    watch();
  });

  let placing = 0;
  const schedule = () => {
    if (!placing) {
      placing = requestAnimationFrame(() => {
        placing = 0;
        placeAll();
      });
    }
  };
  window.addEventListener('scroll', schedule, { capture: true, passive: true });
  window.addEventListener('resize', schedule);

  /* ── Сообщения редактора ── */

  window.addEventListener('message', (event) => {
    // Сообщение отправляет код редактора из главного окна, но через фрейм
    // предпросмотра, поэтому источником может оказаться любое из двух.
    if (event.source !== window.parent && event.source !== window.top) return;
    if (event.origin !== location.origin) return;
    const message = event.data as {
      type?: string;
      kind?: string;
      entry?: unknown;
      data?: unknown;
      scale?: unknown;
      on?: unknown;
      tree?: unknown;
      path?: unknown;
    } | null;
    if (!message || message.type !== 'dc-cms-preview') return;

    if (message.kind === 'scale') {
      const value = Number(message.scale);
      if (value >= 0.1 && value <= 1) {
        scale = value;
        root.style.setProperty('--dc-cms-scale', String(value));
        placeAll();
      }
      return;
    }

    if (message.kind === 'pick') {
      setPicking(message.on === true);
      return;
    }

    if (message.kind === 'labels') {
      labels = nodes(message.tree);
      refresh();
      return;
    }

    if (message.kind === 'focus') {
      if (picking && typeof message.path === 'string') select(targetForPath(message.path), true);
      return;
    }

    const data = message.data ?? {};

    if (message.kind === 'theme') {
      for (const [name, value] of themeEntries(data as Record<string, Record<string, string>>)) {
        if (isColor(value)) document.documentElement.style.setProperty(name, value);
      }
      return;
    }

    // Другая запись — другая точка отсчёта: сравнивать её строки с
    // прежней записью бессмысленно.
    const entry = typeof message.entry === 'string' && ENTRY.test(message.entry) ? message.entry : null;
    if (entry !== current) {
      current = entry;
      previous = null;
      bindings.clear();
    }

    const leaves = flatten(data);

    // Первое сообщение — точка отсчёта: страница собрана ровно из этих данных.
    if (!previous) {
      previous = leaves;
      refresh();
      return;
    }

    let scrolled = false;
    for (const [path, value] of leaves) {
      const old = previous.get(path);
      if (old === undefined || old === value) continue;

      // Место строки ищем один раз, по прежнему значению, и дальше держим
      // узлы: иначе поле, стёртое до пустоты, потеряло бы привязку.
      if (!bindings.has(path)) bindings.set(path, bindScoped(old, path, current));
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
    schedule();
  });

  // Модуль грузится отдельно от страницы, поэтому редактор ждёт этого
  // сигнала и только потом присылает запись, масштаб и подписи.
  window.parent.postMessage({ type: 'dc-cms-ready' }, location.origin);
}
