import { animate } from 'animejs';

/**
 * Появление секций при скролле.
 *
 * IntersectionObserver ловит вход блока в кадр, Anime.js доигрывает
 * opacity/translateY с задержкой из `data-reveal-delay`.
 *
 * Важное требование: блок обязан стать видимым, даже если анимация
 * не доиграла. requestAnimationFrame останавливается на фоновой вкладке,
 * и без страховки посетитель, вернувшийся на вкладку, увидел бы пустую
 * страницу. Поэтому у каждого появления есть три пути к финальному
 * состоянию: onComplete, сторожевой таймер и уход вкладки в фон.
 */

const DURATION = 640;

function finish(el: HTMLElement): void {
  // Инлайновые стили от Anime.js убираем — дальше состояние держит CSS-класс
  el.style.removeProperty('opacity');
  el.style.removeProperty('transform');
  el.style.removeProperty('will-change');
  // Снимаем подсказку композитору: пока она висит, блок остаётся на отдельном
  // слое, а текст на нём теряет субпиксельное сглаживание и выглядит размытым.
  el.classList.remove('dc-reveal--animating');
  el.classList.add('is-visible');
}

export function initReveal(): void {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.dc-reveal'));
  if (nodes.length === 0) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    nodes.forEach(finish);
    return;
  }

  /** Блоки, у которых появление начато, но ещё не завершено. */
  const pending = new Set<HTMLElement>();

  const shift =
    Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--reveal-shift'),
      10,
    ) || 26;

  const reveal = (el: HTMLElement) => {
    const delay = Number(el.dataset.revealDelay ?? 0);

    // На скрытой вкладке анимировать нечего — сразу финальное состояние
    if (document.hidden) {
      finish(el);
      return;
    }

    pending.add(el);
    el.classList.add('dc-reveal--animating');

    const done = () => {
      pending.delete(el);
      window.clearTimeout(watchdog);
      finish(el);
    };

    // Страховка: если rAF встал, блок всё равно проявится
    const watchdog = window.setTimeout(done, delay + DURATION + 400);

    animate(el, {
      opacity: [0, 1],
      translateY: [shift, 0],
      duration: DURATION,
      delay,
      ease: 'cubicBezier(.22,.61,.36,1)',
      onComplete: done,
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        reveal(entry.target as HTMLElement);
      }
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
  );

  nodes.forEach((el) => io.observe(el));

  // Ушли с вкладки — доводим начатое до конца, чтобы вернуться не на пустоту
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    for (const el of pending) finish(el);
    pending.clear();
  });
}
