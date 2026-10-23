/**
 * Карусель на CSS scroll-snap: лента слайдов, стрелки, точки, клавиши.
 * Разметку даёт components/core/Carousel.astro. Без JS слайды идут друг под
 * другом: класс `is-carousel` и кнопки появляются только здесь.
 *
 * Слайд — прямой потомок ленты с атрибутом `data-slide`. Высота ленты
 * (`data-adapt`): `max` — постоянная, по самому высокому слайду (панель
 * внизу не прыгает); `active` — по видимому слайду (панель стоит над
 * лентой, поэтому тоже на месте, а пустот под короткими слайдами нет).
 * Очень высокий слайд ограничен долей высоты окна и прокручивается внутри,
 * текст не скрывается.
 */
export function initCarousels(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    if (root.dataset.carInit) return;
    const track = root.querySelector<HTMLElement>('[data-car-track]');
    const nav = root.querySelector<HTMLElement>('[data-car-nav]');
    const prev = root.querySelector<HTMLButtonElement>('[data-car-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-car-next]');
    if (!track || !nav || !prev || !next) return;
    const slides = Array.from(track.querySelectorAll<HTMLElement>(':scope > [data-slide]'));
    if (slides.length < 2) return;
    root.dataset.carInit = '1';

    const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-car-dot]'));
    const adapt = root.dataset.adapt === 'max' || root.dataset.adapt === 'active' ? root.dataset.adapt : '';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    root.classList.add('is-carousel');
    nav.hidden = false;

    const pitch = () =>
      slides[1].offsetLeft - slides[0].offsetLeft > 0
        ? slides[1].offsetLeft - slides[0].offsetLeft
        : track.clientWidth;
    const current = () => {
      const p = pitch();
      if (p <= 0) return 0;
      return Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / p)));
    };
    const fit = () => {
      if (!adapt) return;
      // scrollHeight без рамки слайда: прибавляем её, иначе слайд с границей получал бы лишнюю прокрутку на пару пикселей
      const full = (el: HTMLElement) => el.scrollHeight + el.offsetHeight - el.clientHeight;
      const natural = adapt === 'max' ? Math.max(...slides.map(full)) : full(slides[current()]);
      if (natural <= 0) return;
      const cap = Math.max(420, Math.round(window.innerHeight * (adapt === 'max' ? 0.85 : 0.8)));
      track.style.height = `${Math.min(natural, cap)}px`;
      // Слайд, в котором текст не помещается, прокручивается — и должен быть доступен с клавиатуры
      slides.forEach((el) => {
        if (el.scrollHeight > el.clientHeight + 1) el.tabIndex = 0;
        else el.removeAttribute('tabindex');
      });
    };
    const sync = () => {
      const i = current();
      const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = end;
      dots.forEach((d, n) => (n === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
      fit();
    };
    const to = (left: number) => track.scrollTo({ left, behavior: reduce.matches ? 'auto' : 'smooth' });
    const go = (i: number) => to(Math.max(0, Math.min(slides.length - 1, i)) * pitch());

    prev.addEventListener('click', () => go(current() - 1));
    next.addEventListener('click', () => go(current() + 1));
    dots.forEach((d, n) => d.addEventListener('click', () => go(n)));
    track.addEventListener('scroll', sync, { passive: true });
    root.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLElement && e.target.closest('[data-slide]')) return; // внутри слайда стрелки листают его текст
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(current() + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(current() - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        go(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        go(slides.length - 1);
      }
    });

    // Размеры меняются при показе скрытой панели, повороте экрана и раскрытии <details> внутри слайда
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(sync);
      ro.observe(track);
      slides.forEach((s) => ro.observe(s));
    }
    window.addEventListener('resize', fit);
    sync();
  });
}
