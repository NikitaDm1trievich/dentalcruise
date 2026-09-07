/**
 * Переворот карточек — услуг и врачей.
 *
 * Логика общая для обоих компонентов, поэтому живёт здесь, а не внутри одного
 * из них: иначе страница с карточками врачей, но без карточек услуг, осталась
 * бы с неработающим переворотом.
 *
 * Разметка: контейнер `[data-flip]`, внутри `[data-flip-inner]` (вращается)
 * и кнопка `[data-flip-toggle]` поверх лицевой стороны.
 */

export function initFlipCards(): void {
  const cards = document.querySelectorAll<HTMLElement>('[data-flip]');
  if (cards.length === 0) return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  for (const card of cards) {
    const inner = card.querySelector<HTMLElement>('[data-flip-inner]');
    const toggle = card.querySelector<HTMLButtonElement>('[data-flip-toggle]');

    const set = (flipped: boolean) => {
      if (flipped) {
        // 3D-контекст включаем только на время переворота: пока он есть,
        // карточка лежит на отдельном слое композитора и текст на лицевой
        // стороне теряет субпиксельное сглаживание.
        card.classList.add('is-3d');
        // Принудительный рефлоу, чтобы браузер увидел новое состояние
        // отдельно от смены transform — иначе переход не проиграется.
        void card.offsetWidth;
      }
      card.dataset.flipped = String(flipped);
      toggle?.setAttribute('aria-expanded', String(flipped));
    };

    set(false);
    card.classList.remove('is-3d');

    // 3D снимаем только когда карточка вернулась лицом вверх и анимация
    // доиграла — иначе задняя сторона мелькнёт незеркаленной.
    inner?.addEventListener('transitionend', (event) => {
      if (event.propertyName !== 'transform') return;
      if (card.dataset.flipped !== 'true') card.classList.remove('is-3d');
    });

    // Наведение — только там, где есть настоящая мышь
    if (finePointer) {
      card.addEventListener('mouseenter', () => set(true));
      card.addEventListener('mouseleave', () => set(false));
    }

    toggle?.addEventListener('click', () => set(card.dataset.flipped !== 'true'));

    card.addEventListener('focusout', (event) => {
      if (!card.contains(event.relatedTarget as Node)) set(false);
    });
  }
}
