/**
 * Контраст по WCAG 2.1. Нужен там, где цвета правит не разработчик:
 * редактор темы проверяет пары «текст на фоне» до сохранения, а сборка —
 * ещё раз, чтобы нечитаемое сочетание не уехало на прод молча.
 */

export type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: string): Rgb | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** Относительная яркость канала по формуле WCAG */
const channel = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export function luminance(color: string): number | null {
  const rgb = hexToRgb(color);
  if (!rgb) return null;
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** Коэффициент контраста двух цветов: от 1 (одинаковые) до 21 (чёрный/белый) */
export function contrastRatio(a: string, b: string): number | null {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Порог WCAG AA: 4.5 для обычного текста, 3.0 для крупного (от 18px
 * обычного или 14px полужирного) и для границ элементов управления.
 */
export const AA_TEXT = 4.5;
export const AA_LARGE = 3;

export type ContrastCheck = {
  label: string;
  fg: string;
  bg: string;
  ratio: number;
  min: number;
  passes: boolean;
};

/** Пары, от которых зависит читаемость. Правится тема — проверяем их. */
export function checkTheme(t: {
  accent: { base: string; ink: string; press: string };
  promo: { base: string };
  ink: { heading: string; body: string; muted: string };
  dark: { base: string; footer: string };
  tint: { warm: string; cool: string; aqua: string };
}): ContrastCheck[] {
  const white = '#FFFFFF';
  const pairs: Array<[string, string, string, number]> = [
    ['Заголовки на белом', t.ink.heading, white, AA_TEXT],
    ['Основной текст на белом', t.ink.body, white, AA_TEXT],
    ['Приглушённый текст на белом', t.ink.muted, white, AA_TEXT],
    ['Заголовки на тёплой подложке', t.ink.heading, t.tint.warm, AA_TEXT],
    ['Основной текст на холодной подложке', t.ink.body, t.tint.cool, AA_TEXT],
    ['Основной текст на мятной подложке', t.ink.body, t.tint.aqua, AA_TEXT],
    ['Акцент как текст на белом', t.accent.ink, white, AA_TEXT],
    ['Белый текст на тёмном блоке', white, t.dark.base, AA_TEXT],
    ['Белый текст в подвале', white, t.dark.footer, AA_TEXT],
    // Бейджи «Акция» набраны 14-15px полужирным. По WCAG это обычный текст,
    // а не крупный (крупный - от 18.66px полужирного), поэтому порог 4.5.
    ['Текст на плашке акции', white, t.promo.base, AA_TEXT],
    // Кнопка-призыв красится в accent.ink, а не в accent.base: так задано
    // переопределением --cta-bg в styles/global.css. Текст на ней всегда белый
    // (--cta-fg там же), поэтому проверяем именно эту пару, а не токен темы.
    ['Текст на кнопке', white, t.accent.ink, AA_TEXT],
    ['Текст на кнопке при наведении', white, t.accent.press, AA_TEXT],
  ];

  return pairs.map(([label, fg, bg, min]) => {
    const ratio = contrastRatio(fg, bg) ?? 0;
    return { label, fg, bg, ratio: Math.round(ratio * 100) / 100, min, passes: ratio >= min };
  });
}
