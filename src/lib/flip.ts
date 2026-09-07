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
      // 3D-контекст включаем только на время переворота: пока он есть,
      // карточка лежит на отдельном слое композитора и текст теряет
      // субпиксельное сглаживание — выглядит размытым.
      card.classList.add('is-3d');
      // `is-back` — состояние покоя изнанкой вверх, там вращения нет.
      // Снимаем его до рефлоу, чтобы обратный переворот было от чего играть,
      // но без анимации: иначе карточка сперва провернётся к изнанке.
      card.classList.add('is-no-anim');
      card.classList.remove('is-back');
      // Принудительный рефлоу, чтобы браузер увидел новое состояние
      // отдельно от смены transform — иначе переход не проиграется.
      void card.offsetWidth;
      card.classList.remove('is-no-anim');
      card.dataset.flipped = String(flipped);
      toggle?.setAttribute('aria-expanded', String(flipped));
    };

    set(false);
    card.classList.remove('is-3d');

    // Когда переворот доиграл, 3D-слой больше не нужен ни лицом, ни изнанкой:
    // фиксируем нужную сторону через `is-back` и возвращаем плоскую отрисовку.
    inner?.addEventListener('transitionend', (event) => {
      // Внутри изнанки свои переходы (появление фактов) — они тоже всплывают
      if (event.target !== inner || event.propertyName !== 'transform') return;
      if (card.dataset.flipped === 'true') card.classList.add('is-back');
      card.classList.remove('is-3d');
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
