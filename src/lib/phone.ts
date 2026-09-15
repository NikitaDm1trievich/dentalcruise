/**
 * Телефон в форме записи: маска «+7 900 000-00-00» и приведение к E.164.
 *
 * Без библиотек: поле одно, формат один — российский номер. Маска
 * форматирует значение целиком при каждом вводе и сама считает, куда
 * вернуть каретку, поэтому вставка «89255777677», «+7 (925) 577-76-77»
 * или «9255777677» даёт один и тот же результат, что и набор вручную.
 *
 * Первая цифра 7 или 8 считается кодом страны (8 — старый межгород),
 * дальше — десять цифр номера. Лишние цифры отбрасываются, буквы
 * и знаки игнорируются.
 *
 * Двойник на сервере — normalizePhone в worker/src/index.ts: сайт и воркер
 * деплоятся не одновременно, поэтому обе стороны понимают любую форму.
 */

const NATIONAL_LENGTH = 10;

type MaskOptions = {
  /** Значение поля до этого ввода — чтобы отличить стирание разделителя от стирания цифры */
  prev?: string;
  /** InputEvent.inputType: deleteContentBackward / deleteContentForward */
  inputType?: string;
};

const onlyDigits = (value: string) => value.replace(/\D/g, '');

/** Цифры → код страны есть? + десять цифр номера */
function parse(digits: string) {
  const hasCode = digits.startsWith('7') || digits.startsWith('8');
  const national = (hasCode ? digits.slice(1) : digits).slice(0, NATIONAL_LENGTH);
  return { hasCode, national };
}

/** «9255777677» → «+7 925 577-76-77»; разделители появляются по мере набора */
function format(national: string, hasCode: boolean): string {
  if (!national && !hasCode) return '';
  const [a, b, c, d] = [national.slice(0, 3), national.slice(3, 6), national.slice(6, 8), national.slice(8)];
  return `+7${a && ` ${a}`}${b && ` ${b}`}${c && `-${c}`}${d && `-${d}`}`;
}

/** Позиция сразу после n-й цифры номера; код «+7 » не считается */
function caretAfter(value: string, n: number): number {
  if (n === 0) return Math.min(3, value.length);
  let seen = 0;
  for (let i = 2; i < value.length; i++) {
    if (/\d/.test(value.charAt(i)) && ++seen === n) return i + 1;
  }
  return value.length;
}

/**
 * Форматирует сырое значение поля и возвращает новое значение вместе
 * с позицией каретки. Каретка привязана к цифрам, а не к символам:
 * сколько цифр было слева от неё, столько и останется.
 */
export function maskPhone(
  raw: string,
  caret: number,
  { prev = '', inputType = '' }: MaskOptions = {},
): { value: string; caret: number } {
  let digits = onlyDigits(raw);
  let before = onlyDigits(raw.slice(0, caret)).length;

  // Backspace или Delete над пробелом либо дефисом: браузер убрал разделитель,
  // цифры не изменились — маска вернула бы его на место, и каретка «застряла»
  // бы. Удаляем соседнюю цифру, как и ожидает пользователь.
  if (inputType.startsWith('deleteContent') && digits === onlyDigits(prev)) {
    const index = inputType === 'deleteContentBackward' ? Math.max(before - 1, 0) : before;
    digits = digits.slice(0, index) + digits.slice(index + 1);
    before = index;
  }

  const { hasCode, national } = parse(digits);
  const nationalBefore = Math.min(hasCode ? Math.max(before - 1, 0) : before, national.length);
  const value = format(national, hasCode);

  return { value, caret: caretAfter(value, nationalBefore) };
}

/**
 * Значение поля → E.164 («+79255777677») или null, если номер неполный.
 * Значение прогоняется через маску, поэтому сырые «89255777677»
 * и «+7 (925) 577-76-77» тоже приводятся; «+7 925 577-76-7» — неполный.
 */
export function phoneToE164(value: string): string | null {
  const digits = onlyDigits(maskPhone(value, 0).value);
  return digits.length === 1 + NATIONAL_LENGTH ? `+${digits}` : null;
}
