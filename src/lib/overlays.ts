/**
 * Оверлеи страницы: бургер-меню, модалка записи, шторка лицензии.
 *
 * Все три открываются по `data-open="<id>"`, закрываются по `data-close`,
 * по клику на подложку и по Escape. Пока открыт любой оверлей — страница
 * под ним не скроллится, а фокус остаётся внутри.
 */

type Overlay = {
  root: HTMLElement;
  opener: HTMLElement | null;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

let open: Overlay | null = null;

function lockScroll(locked: boolean) {
  document.body.style.overflow = locked ? 'hidden' : '';
}

export function closeOverlay(): void {
  if (!open) return;
  const { root, opener } = open;
  root.dataset.state = 'closed';
  root.setAttribute('aria-hidden', 'true');
  document.querySelectorAll<HTMLElement>(`[data-open="${root.id}"]`).forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });
  open = null;
  lockScroll(false);
  opener?.focus();
}

export function openOverlay(id: string, opener: HTMLElement | null = null): void {
  const root = document.getElementById(id);
  if (!root) return;
  if (open) closeOverlay();

  root.dataset.state = 'open';
  root.setAttribute('aria-hidden', 'false');
  document.querySelectorAll<HTMLElement>(`[data-open="${id}"]`).forEach((btn) => {
    btn.setAttribute('aria-expanded', 'true');
  });
  open = { root, opener };
  lockScroll(true);

  root.querySelector<HTMLElement>(FOCUSABLE)?.focus();
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
      const items = Array.from(open.root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
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
