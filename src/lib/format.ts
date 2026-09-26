/**
 * Форматирование текста, который собирается из чисел в данных.
 *
 * Число позиций прайса или врачей приходит из коллекций, а подпись к нему
 * пишется в шаблоне. Без склонения на странице появляется «71 позиций» —
 * ошибка на самом видном месте.
 */

/**
 * Форма слова после числа: «1 позиция», «2 позиции», «5 позиций».
 * Формы — для 1, для 2–4 и для 5–20 (в таком порядке).
 *
 * Проверка: plural(1, f) → «позиция», 2 → «позиции», 5 → «позиций»,
 * 11 → «позиций», 21 → «позиция», 22 → «позиции», 111 → «позиций».
 */
export function plural(n: number, forms: [string, string, string]): string {
  const [one, few, many] = forms;
  const hundred = Math.abs(n) % 100;
  const ten = hundred % 10;
  // 11–19 — всегда «позиций», хотя оканчиваются на 1–4
  if (hundred > 10 && hundred < 20) return many;
  if (ten === 1) return one;
  if (ten >= 2 && ten <= 4) return few;
  return many;
}

/** Кусок текста после подстановки: `key` — у значения метки. */
export type FilledPart = { text: string; key?: string };

const warned = new Set<string>();

/**
 * Подстановка в текст из редактора, по кускам: `fillParts('В {месяце}
 * разница {сумма}', …)` → текст, значение месяца, текст, значение суммы.
 * Куски нужны, когда значение метки оформлено иначе (сумма жирным), — и
 * сборке, и живому предпросмотру (lib/cms-preview), чтобы оба собирали
 * текст одинаково.
 *
 * Владелец правит такие тексты целиком, а сайт вписывает в них то, что
 * знает только сборка: название услуги, число позиций прайса. Метку, которой
 * нет среди значений (опечатка), оставляем как есть: её видно на странице,
 * а сборка пишет предупреждение. Про метку, которую из текста удалили,
 * сборка тоже предупреждает: значение молча пропало бы со страницы.
 */
export function fillParts(template: string, values: Record<string, string>): FilledPart[] {
  const parts: FilledPart[] = [];
  const used = new Set<string>();
  let at = 0;
  for (const match of template.matchAll(/\{([^{}]*)\}/g)) {
    const key = match[1].trim();
    const index = match.index ?? 0;
    if (index > at) parts.push({ text: template.slice(at, index) });
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      parts.push({ text: values[key], key });
      used.add(key);
    } else {
      parts.push({ text: match[0] });
      warn(`в тексте «${template}» неизвестная метка ${match[0]} — посетители увидят её как есть`);
    }
    at = index + match[0].length;
  }
  if (at < template.length) parts.push({ text: template.slice(at) });
  for (const key of Object.keys(values)) {
    if (!used.has(key)) warn(`в тексте «${template}» нет метки {${key}} — значение на страницу не попадёт`);
  }
  if (/[{}]/.test(template.replace(/\{[^{}]*\}/g, ''))) {
    warn(`в тексте «${template}» лишняя фигурная скобка — посетители увидят её как есть`);
  }
  return parts;
}

/** То же одной строкой: `fill('Что спрашивают про «{услуга}»', { услуга: 'виниры' })`. */
export function fill(template: string, values: Record<string, string>): string {
  return fillParts(template, values)
    .map((part) => part.text)
    .join('');
}

/** Предупреждение в лог сборки — один раз на текст; в браузере молчим. */
function warn(message: string) {
  if (!import.meta.env.SSR || warned.has(message)) return;
  warned.add(message);
  console.warn(`[тексты] ${message}. Поправьте текст в редакторе сайта.`);
}
