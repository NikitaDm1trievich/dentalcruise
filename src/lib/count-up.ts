import { animate } from 'animejs';

/**
 * Досчёт чисел до значения, когда блок доезжает до экрана.
 *
 * Как и появление секций, отказоустойчиво: в разметке уже стоит финальная
 * цифра, поэтому без JS, при prefers-reduced-motion или если анимация
 * не доиграет — посетитель видит верное значение, а не ноль.
 */
export function initCountUp(): void {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (nodes.length === 0) return;

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    return;
  }

  const render = (el: HTMLElement, value: number) => {
    const decimals = Number(el.dataset.decimals ?? 0);
    el.textContent =
      (el.dataset.prefix ?? '') +
      value.toLocaleString('ru-RU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: el.dataset.grouping !== 'false',
      }) +
      (el.dataset.suffix ?? '');
  };

  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.value);
    const from = Number(el.dataset.from ?? 0);
    if (Number.isNaN(to)) return;

    // Страховка: если rAF встанет (фоновая вкладка), вернём финальное значение
    const watchdog = window.setTimeout(() => render(el, to), Number(el.dataset.duration ?? 1400) + 400);

    const state = { n: from };
    render(el, from);

    animate(state, {
      n: to,
      duration: Number(el.dataset.duration ?? 1400),
      ease: 'out(3)',
      onUpdate: () => render(el, state.n),
      onComplete: () => {
        window.clearTimeout(watchdog);
        render(el, to);
      },
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        run(entry.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );

  nodes.forEach((el) => io.observe(el));
}
