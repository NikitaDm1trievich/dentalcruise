/**
 * Оверлеи страницы: бургер-меню, модалка записи, шторка лицензии.
 *
 * Все три открываются по `data-open="<id>"`, закрываются по `data-close`,
 * по клику на подложку и по Escape. Пока открыт любой оверлей — страница
 * под ним не скроллится, а фокус остаётся внутри.
 *
 * Закрытый оверлей только уезжает за край и не ловит клики, поэтому
 * в разметке он с атрибутом `inert` — иначе Tab уводит фокус в невидимые
 * ссылки и поля. Снимаем `inert` при открытии и возвращаем сразу при
 * закрытии: на анимацию ухода он не влияет.
 */

type Overlay = {
  root: HTMLElement;
  opener: HTMLElement | null;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

let open: Overlay | null = null;

/** Куда можно поставить фокус: видимое и не выключенное через inert (скрытые слайды карусели). */
function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null && !el.closest('[inert]'),
  );
}

/**
 * Без полосы прокрутки страница становится шире на её толщину, и всё —
 * шапка, контент, кнопка «наверх» — прыгает вправо. Поэтому, пока
 * прокрутка заперта, место полосы остаётся за ней (scrollbar-gutter).
 * Только если полоса есть: на телефоне и с «плавающими» полосами места
 * под неё нет, а на короткой странице без прокрутки пустая полоса справа
 * сама сдвинула бы вёрстку влево.
 */
function lockScroll(locked: boolean) {
  const root = document.documentElement;
  if (locked && window.innerWidth > root.clientWidth) root.style.scrollbarGutter = 'stable';
  document.body.style.overflow = locked ? 'hidden' : '';
  if (!locked) root.style.scrollbarGutter = '';
}

export function closeOverlay(): void {
  if (!open) return;
  const { root, opener } = open;
  root.dataset.state = 'closed';
  root.setAttribute('aria-hidden', 'true');
  root.inert = true;
  document.querySelectorAll<HTMLElement>(`[data-open="${root.id}"]`).forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });
  open = null;
  lockScroll(false);
  opener?.focus();
}

/**
 * `focus: false` — открыть, не перенося фокус внутрь. Нужно предпросмотру
 * редактора: там окно открывается само, а фокус во фрейме забирал бы его у
 * формы редактора, и набранная буква пропадала.
 */
export function openOverlay(id: string, opener: HTMLElement | null = null, { focus = true } = {}): void {
  const root = document.getElementById(id);
  if (!root) return;
  if (open) {
    // Запись из бургер-меню: кнопка в меню станет inert, фокус после
    // закрытия модалки возвращаем туда, откуда открывали само меню.
    if (opener && open.root.contains(opener)) opener = open.opener;
    closeOverlay();
  }

  root.dataset.state = 'open';
  root.setAttribute('aria-hidden', 'false');
  root.inert = false;
  document.querySelectorAll<HTMLElement>(`[data-open="${id}"]`).forEach((btn) => {
    btn.setAttribute('aria-expanded', 'true');
  });
  open = { root, opener };
  lockScroll(true);

  // preventScroll: иначе окно с длинным содержимым (сканы лицензии)
  // прокрутилось бы к первой ссылке мимо заголовка.
  if (focus) focusables(root)[0]?.focus({ preventScroll: true });
}

export function initOverlays(): void {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    const opener = target.closest<HTMLElement>('[data-open]');
    /**
     * Значение обязано называть существующий оверлей. Без этой проверки
     * обработчик считал своим любой элемент с атрибутом `data-open`:
     * выпадающее меню «Услуги» держало в нём своё состояние true/false,
     * и клик по ссылке внутри меню гасился здесь через preventDefault —
     * переход на прайс не происходил вовсе. Меню атрибут больше не
     * занимает, а проверка страхует от следующего такого совпадения.
     */
    const overlayId = opener?.dataset.open;
    if (opener && overlayId && document.getElementById(overlayId)) {
      event.preventDefault();
      openOverlay(overlayId, opener);
      return;
    }

    const closer = target.closest<HTMLElement>('[data-close]');
    if (closer) {
      // Ссылку внутри оверлея не блокируем — меню закрывается, переход происходит.
      const navigates = closer instanceof HTMLAnchorElement && closer.getAttribute('href');
      if (!navigates) event.preventDefault();
      closeOverlay();
      return;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!open) return;

    if (event.key === 'Escape') {
      closeOverlay();
      return;
    }

    // Ловушка фокуса — Tab не уводит на страницу под оверлеем
    if (event.key === 'Tab') {
      const items = focusables(open.root);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
