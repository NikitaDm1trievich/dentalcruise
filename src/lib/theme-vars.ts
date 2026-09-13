/**
 * Соответствие полей палитры из theme.json CSS-переменным сайта.
 *
 * Один список на двоих: по нему ThemeVars собирает стили при сборке, и по
 * нему же живой предпросмотр в редакторе перекрашивает страницу, пока
 * владелец крутит цвет. Добавили переменную здесь — она работает в обоих.
 */
export const THEME_VARS: [string, string, string][] = [
  ['--dc-turquoise', 'accent', 'base'],
  ['--dc-turquoise-press', 'accent', 'press'],
  ['--dc-turquoise-ink', 'accent', 'ink'],
  ['--dc-turquoise-soft', 'accent', 'soft'],
  ['--dc-turquoise-mark', 'accent', 'mark'],
  ['--dc-coral', 'promo', 'base'],
  ['--dc-coral-press', 'promo', 'press'],
  ['--dc-coral-soft', 'promo', 'soft'],
  ['--dc-depths', 'ink', 'heading'],
  ['--text-body', 'ink', 'body'],
  ['--text-muted', 'ink', 'muted'],
  ['--dc-lagoon', 'dark', 'base'],
  ['--dc-lagoon-lift', 'dark', 'lift'],
  ['--surface-footer', 'dark', 'footer'],
  ['--dc-seashell', 'tint', 'warm'],
  ['--dc-mist', 'tint', 'cool'],
  ['--dc-aqua-tint', 'tint', 'aqua'],
  ['--dc-breeze', 'tint', 'breeze'],
];

type Palette = Record<string, Record<string, string> | undefined>;

/** Пары «переменная — цвет» для заполненных полей палитры. */
export function themeEntries(theme: Palette): [string, string][] {
  return THEME_VARS.flatMap(([name, group, key]) => {
    const value = theme[group]?.[key];
    return typeof value === 'string' && value ? [[name, value] as [string, string]] : [];
  });
}
