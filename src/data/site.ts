/**
 * Единственный источник правды по клинике (NAP — name/address/phone).
 * Используется в шапке, подвале, бургер-меню, карточке места, форме записи
 * и в JSON-LD.
 *
 * Сами данные лежат в clinic.json — их правит владелец в редакторе сайта
 * («Шапка, подвал и контакты» → «Контакты и реквизиты клиники»). Здесь
 * только типы и то, что из них считается. Меню шапки и подвала — в
 * menu.json, общие подписи блоков — в blocks.json и form.json.
 *
 * Про отдельные поля (история решений, менять только осознанно):
 *   • станции метро — один пересадочный узел: Полежаевская и Хорошёвская
 *     связаны переходом; цвета — официальные цвета линий на схеме;
 *   • ссылки на справочники (2ГИС, Google, ПроДокторов, Zoon) уходят в
 *     sameAs микроразметки — основной сигнал локального поиска. Пустое поле
 *     никуда не выводится, выдуманных адресов здесь быть не должно;
 *   • Instagram принадлежит Meta, признанной в России экстремистской; с
 *     01.09.2025 размещение рекламы на её площадках запрещено. Ссылку с
 *     сайта сняли, в редакторе поле скрыто. Профиль клиники:
 *     instagram.com/dentalcruise, если решение изменится;
 *   • отдельного Telegram у клиники нет — кнопка не выводится, пока поле пустое;
 *   • почтовый индекс, номер лицензии, ИНН и ОГРН клиника ещё не прислала:
 *     пустые поля в разметку и в подвал не попадают.
 *
 * Рейтинг и число отзывов живут в src/data/home.json (раздел «Отзывы»
 * редактора), а в микроразметку не отдаются вовсе: самооценка организации в
 * aggregateRating противоречит правилам Google и Яндекса, а цифры на сайте
 * обязаны совпадать с виджетом Яндекс Карт.
 */
import raw from './clinic.json';
import menuRaw from './menu.json';
type Link = { label: string; href: string };

/**
 * Необязательное поле: редактор пишет незаполненное значение как "" (текст)
 * или null (картинка, файл). Оба варианта значат «нет», проверка — по
 * истинности (`clinic.links.max && …`).
 */
type Optional = string | null;

type Clinic = {
  name: string;
  legalName: string;
  description: string;
  phone: string;
  email: string;
  address: {
    street: string;
    streetShort: string;
    locality: string;
    region: string;
    country: string;
    postalCode: Optional;
  };
  metro: string;
  metroStations: { name: string; line: string; color: string }[];
  /** Приписка к станциям метро: «5 минут пешком» */
  metroWalk: string;
  scheduleShort: string;
  scheduleLong: string;
  /** Часы для микроразметки: дни в формате schema.org (Mo, Tu, …) */
  openingHours: { days: string[]; opens: string; closes: string }[];
  paymentAccepted: string;
  links: {
    max: Optional;
    vk: Optional;
    telegram: Optional;
    instagram: Optional;
    yandexOrg: string;
    /** Короткая ссылка на точку клиники — открывается по адресу в шапке */
    yandexPin: string;
    yandexMapWidget: string;
    yandexReviewsWidget: string;
    twoGis: Optional;
    googleMaps: Optional;
    prodoctorov: Optional;
    zoon: Optional;
  };
  /** Картинка «Схема проезда» — путь от корня сайта, как в JSON-контенте */
  routeImage: Optional;
  geo: { lat: number; lng: number };
  license: { title: string; number: Optional; scan: Optional; pdf: Optional };
  legal: { inn: Optional; ogrn: Optional };
};

const data: Clinic = raw;

/**
 * Номер в E.164 для ссылки tel: и микроразметки. Владелец пишет телефон
 * один раз, как его читают люди.
 *
 * К коду +7 приводим только российский номер: 11 цифр с 7 или 8 в начале
 * или 10 цифр без кода. Номер с другим кодом страны (+375 …) оставляем как
 * ввели — цифры с плюсом. Короче или длиннее, чем бывает, — ссылка всё
 * равно собирается, но сборка пишет предупреждение: иначе опечатка молча
 * уехала бы в каждую кнопку «Позвонить».
 */
export function phoneToTel(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const plus = /^\s*\+/.test(phone);
  const foreign = plus && !/^\s*\+\s*7/.test(phone);
  if (!foreign) {
    if (digits.length === 11 && /^[78]/.test(digits)) return `+7${digits.slice(1)}`;
    if (digits.length === 10 && !plus) return `+7${digits}`;
  } else if (digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  console.warn(
    `[контакты] Телефон клиники «${phone}» похож на неполный или ошибочный — проверьте его в редакторе: ` +
      '«Шапка, подвал и контакты» → «Контакты и реквизиты клиники».',
  );
  return `+${digits}`;
}

const phoneE164 = phoneToTel(data.phone);

export const clinic = {
  ...data,
  /** E.164 — для JSON-LD и микроразметки */
  phoneE164,
  phoneHref: `tel:${phoneE164}`,
};

/** Меню шапки, бургер-меню и подвала. Ссылки на страницы — через pageHref. */
export const menu: {
  services: { label: string; all: string };
  /** Шапка и бургер-меню после «Услуг» */
  main: Link[];
  burger: { route: string; book: string };
  footer: {
    text: string;
    pagesTitle: string;
    pages: Link[];
    infoTitle: string;
    info: Link[];
    contactsTitle: string;
  };
  sticky: { call: string; book: string; max: string };
  /** Первая хлебная крошка на внутренних страницах */
  crumbsHome: string;
} = menuRaw;
