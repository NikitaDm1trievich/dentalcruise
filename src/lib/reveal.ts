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

/**
 * Ритм появления — из токенов motion.css (--dur-reveal, --reveal-shift);
 * здесь только запасные значения, если переменная не прочиталась.
 * С телефона блок должен проявиться сразу, как только край вошёл в кадр,
 * поэтому появление короткое, сдвиг маленький, а задержки каскада из
 * `data-reveal-delay` ужаты вдвое и ограничены: в одну колонку карточки
 * входят в кадр по одной, и четвёртая не должна ждать ещё треть секунды.
 */
const FALLBACK_DURATION = 380;
const FALLBACK_SHIFT = 12;
const DELAY_SCALE = 0.5;
const MAX_DELAY = 180;

/**
 * Число с единицей из CSS-переменной. Единицу обязательно разбирать:
 * минификатор CSS при сборке переписывает значения покороче — «380ms» в
 * «.38s», «0px» в «0», — и parseFloat без единицы отдал бы 0.38 там, где
 * нужны 380 мс. Неизвестная единица или пустое значение — запасное число.
 */
function cssValue(name: string, units: Record<string, number>, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const match = /^(-?(?:\d+\.?\d*|\.\d+))([a-z]*)$/i.exec(raw);
  if (!match) return fallback;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  // Ноль без единицы допустим в CSS для любой величины
  if (!unit) return value === 0 ? 0 : fallback;
  return unit in units ? value * units[unit] : fallback;
}

/** Длительность в мс: «380ms», «.38s» → 380. */
const cssDuration = (name: string, fallback: number) => cssValue(name, { ms: 1, s: 1000 }, fallback);
/** Длина в px: «12px», «0» → 12, 0. */
const cssLength = (name: string, fallback: number) => cssValue(name, { px: 1 }, fallback);

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
  // Пришли по ссылке-якорю (например, «Смотреть все услуги» → /pricelist#slug):
  // браузер сразу прыгает вглубь страницы, и до того как IntersectionObserver
  // и плавная прокрутка успеют доиграть, блок в кадре ещё выглядит пустым.
  // Появление тут не нужно — контент и так открывается не «с нуля».
  const jumpedToAnchor = Boolean(window.location.hash);

  if (reduced || jumpedToAnchor || !('IntersectionObserver' in window)) {
    nodes.forEach(finish);
    return;
  }

  /** Блоки, у которых появление начато, но ещё не завершено. */
  const pending = new Set<HTMLElement>();

  const shift = cssLength('--reveal-shift', FALLBACK_SHIFT);
  const duration = cssDuration('--dur-reveal', FALLBACK_DURATION);

  const reveal = (el: HTMLElement) => {
    const delay = Math.min((Number(el.dataset.revealDelay) || 0) * DELAY_SCALE, MAX_DELAY);

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
    const watchdog = window.setTimeout(done, delay + duration + 400);

    animate(el, {
      opacity: [0, 1],
      translateY: [shift, 0],
      duration,
      delay,
      ease: 'cubicBezier(.22,.61,.36,1)',
      onComplete: done,
    });
  };

  /**
   * Срабатываем, как только в кадр вошёл первый пиксель (threshold 0):
   * доля высоты не годится — у высокого блока на телефоне 14% это пол-экрана
   * прокрутки до появления. Нижнее поле — на величину сдвига: пока блок не
   * проявился, он опущен на --reveal-shift, и без поправки наблюдатель видел
   * бы его край на эти пиксели позже настоящего.
   */
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        reveal(entry.target as HTMLElement);
      }
    },
    { threshold: 0, rootMargin: `0px 0px ${shift}px 0px` },
  );

  nodes.forEach((el) => io.observe(el));

  // Ушли с вкладки — доводим начатое до конца, чтобы вернуться не на пустоту
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    for (const el of pending) finish(el);
    pending.clear();
  });
}
