import { closeOverlay } from './overlays';

/**
 * Закрытие шторки свайпом вниз за «ручку» (полоску вверху шторки).
 *
 * Жест живёт только на ручке: у неё `touch-action: none`, а прокрутка
 * содержимого шторки (форма записи, сканы лицензии) идёт мимо — её
 * обработчики не трогают. Пока палец ведёт ручку, шторка едет за ним через
 * transform. Отпустили дальше четверти высоты шторки или быстрым рывком
 * вниз — закрываем тем же closeOverlay, что и крестик (фокус на кнопку,
 * с которой открывали, aria, inert, прокрутка страницы). Иначе шторка
 * пружинит на место своим CSS-переходом.
 *
 * Инлайновый transform держится только на время жеста и анимации ухода:
 * дальше закрытое и открытое состояние снова задаёт CSS оверлея.
 */

/** Доля высоты шторки (не больше экрана), после которой отпущенная шторка закрывается. */
const CLOSE_SHARE = 0.25;
/** Скорость рывка вниз, px/мс: столько хватает, чтобы закрыть с любого места. */
const FLING_SPEED = 0.5;
/** Окно, по которому считается скорость в момент отпускания, мс. */
const SPEED_WINDOW = 100;
/** Рывок короче этого — случайное касание, а не жест. */
const FLING_MIN = 24;
/** Если transitionend не придёт (вкладка ушла в фон), убираем стили по таймеру. */
const SETTLE_FALLBACK = 700;

export function initSheetSwipe(handle: HTMLElement, sheet: HTMLElement): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let pointer: number | null = null;
  let startY = 0;
  let offset = 0;
  /** Точки движения за последние SPEED_WINDOW мс — по ним скорость рывка */
  let samples: { y: number; t: number }[] = [];
  let settleTimer = 0;
  /** Ждём конца анимации ухода или возврата — чтобы снять слушатель досрочно */
  let settling: ((event?: TransitionEvent) => void) | null = null;

  /** Вернуть шторке её CSS: снять инлайновые transform и transition. */
  const clear = () => {
    window.clearTimeout(settleTimer);
    if (settling) sheet.removeEventListener('transitionend', settling);
    settling = null;
    sheet.style.removeProperty('transform');
    sheet.style.removeProperty('transition');
  };

  /** Доиграть до `transform` (или сразу, без анимации) и вернуть CSS. */
  const settle = (transform: string) => {
    if (reduced.matches) {
      clear();
      return;
    }
    // Переход берётся из CSS шторки: убираем инлайновый `transition: none`
    sheet.style.removeProperty('transition');
    sheet.style.transform = transform;
    const done = (event?: TransitionEvent) => {
      if (event && (event.target !== sheet || event.propertyName !== 'transform')) return;
      clear();
    };
    settling = done;
    sheet.addEventListener('transitionend', done);
    settleTimer = window.setTimeout(done, SETTLE_FALLBACK);
  };

  /* Шторку открыли снова, пока она ещё доезжает вниз после свайпа: инлайновый
     translateY держал бы её за экраном до конца анимации ухода при уже
     открытой подложке. Открытие — смена data-state у оверлея (lib/overlays):
     сразу отдаём шторку её CSS, и она въезжает как обычно. */
  const overlay = sheet.closest<HTMLElement>('[data-state]');
  if (overlay) {
    new MutationObserver(() => {
      if (overlay.dataset.state === 'open' && pointer === null) clear();
    }).observe(overlay, { attributes: true, attributeFilter: ['data-state'] });
  }

  handle.addEventListener('pointerdown', (event) => {
    if (pointer !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
    clear();
    pointer = event.pointerId;
    startY = event.clientY;
    samples = [{ y: event.clientY, t: event.timeStamp }];
    offset = 0;
    handle.setPointerCapture(event.pointerId);
    sheet.style.transition = 'none';
  });

  handle.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointer) return;
    // Вверх шторка не тянется: выше открытого положения ей некуда
    offset = Math.max(0, event.clientY - startY);
    samples.push({ y: event.clientY, t: event.timeStamp });
    while (samples.length > 2 && event.timeStamp - samples[0].t > SPEED_WINDOW) samples.shift();
    sheet.style.transform = `translateY(${offset}px)`;
  });

  const release = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return;
    pointer = null;
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);

    // Скорость — по отрезку за последние SPEED_WINDOW мс, а не по одному
    // событию: шаги указателя неровные. Палец замер перед отпусканием —
    // рывка не было, как бы быстро ни вели до этого.
    const first = samples[0];
    const last = samples[samples.length - 1];
    const fresh = event.timeStamp - last.t < SPEED_WINDOW;
    const speed = last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0;
    const flung = fresh && speed > FLING_SPEED && offset > FLING_MIN;
    // Окно записи на телефоне бывает выше экрана — порог от видимой части
    const far = offset > Math.min(sheet.offsetHeight, window.innerHeight) * CLOSE_SHARE;

    if (event.type === 'pointerup' && (far || flung)) {
      // Шторка уезжает вниз от того места, где её отпустили; дальше
      // закрытое состояние держит CSS оверлея.
      settle(`translateY(${sheet.offsetHeight + offset}px)`);
      closeOverlay();
    } else {
      settle('');
    }
  };

  handle.addEventListener('pointerup', release);
  handle.addEventListener('pointercancel', release);
}
