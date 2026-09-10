/**
 * Единственный источник правды по клинике (NAP — name/address/phone).
 * Используется в шапке, подвале, бургер-меню, карточке места и в JSON-LD.
 * Меняем данные только здесь.
 */

export const clinic = {
  name: 'Дентал Круиз',
  legalName: 'Дентал Круиз',
  /** Строка под названием клиники в hero */
  tagline: 'Путешествие в мир прекрасных улыбок',
  description:
    'Центр стоматологии с собственной зуботехнической лабораторией: коронки, виниры и протезирование под ключ изготавливаются на месте, без наценки посредника.',
  foundingYear: 2013,

  phone: '+7 925 577-76-77',
  phoneHref: 'tel:+79255777677',
  /** E.164 — для JSON-LD и микроразметки */
  phoneE164: '+79255777677',
  email: 'dental.cruise@inbox.ru',

  address: {
    street: '4-я Магистральная улица, 5с1, 2 этаж',
    streetShort: '4-я Магистральная, 5с1',
    locality: 'Москва',
    region: 'Москва',
    country: 'RU',
    /** TODO: уточнить почтовый индекс у клиники — в JSON-LD пока не выводим. */
    postalCode: '',
  },

  metro: 'м. Полежаевская',
  /**
   * Один пересадочный узел: Полежаевская и Хорошёвская связаны переходом.
   * Цвета — официальные цвета линий на схеме метрополитена, по ним человек
   * сразу видит, с какой ветки к нам ехать.
   */
  metroStations: [
    { name: 'Полежаевская', line: 'Таганско-Краснопресненская линия', color: '#800080' },
    { name: 'Хорошёвская', line: 'Большая кольцевая линия', color: '#82C0C0' },
  ],

  geo: { lat: 55.774426, lng: 37.520284 },

  /** Пн–Сб 10:00–22:00, воскресенье — выходной */
  openingHours: [
    { days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], opens: '10:00', closes: '22:00' },
  ],
  scheduleShort: 'пн–сб 10:00–22:00',
  scheduleLong: 'Пн–Сб 10:00–22:00 · Вс — выходной',

  rating: { value: 4.9, count: 120 },

  links: {
    yandexOrg: 'https://yandex.ru/maps/org/dental_kruiz/154025048590/',
    /** Короткая ссылка на точку клиники — открывается по адресу в шапке */
    yandexPin: 'https://yandex.ru/maps/-/CTdFz09l',
    yandexMapWidget: 'https://yandex.ru/map-widget/v1/?ll=37.520284%2C55.774426&z=17',
    yandexReviewsWidget: 'https://yandex.ru/maps-reviews-widget/154025048590?comments',
    vk: 'https://vk.ru/dentalcruise',
    /**
     * Instagram принадлежит Meta, признанной в России экстремистской;
     * с 01.09.2025 размещение рекламы на её площадках запрещено. Ссылку
     * с сайта клиники сняли — поле пустое, кнопки не выводятся нигде.
     * Профиль клиники: instagram.com/dentalcruise, если решение изменится.
     */
    instagram: '',
    /** Max открывает чат по рабочему номеру клиники */
    max: 'https://max.ru/+79255777677',
    /** Отдельного Telegram у клиники нет — кнопка не выводится, пока поле пустое */
    telegram: '',
  },

  /** TODO: подставить номер и дату лицензии со скана. */
  license: {
    title: 'Лицензия на осуществление медицинской деятельности',
    number: '',
    scan: '',
    pdf: '',
  },

  /** TODO: получить от клиники ИНН/ОГРН для юридического блока в подвале. */
  legal: { inn: '', ogrn: '' },
} as const;

/** Карта сайта. Порядок = порядок в бургер-меню и подвале. */
export const navLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Прайс-лист', href: '/pricelist' },
  { label: 'О клинике', href: '/about' },
  { label: 'Врачи', href: '/doctors' },
  { label: 'Галерея работ', href: '/gallery' },
  { label: 'Контакты', href: '/contacts' },
] as const;

/** Якоря внутри главной — показываем только на главной. */
export const homeAnchors = [
  { label: 'Акции', href: '#promo' },
  { label: 'Услуги', href: '#services' },
  { label: 'Почему мы', href: '#why' },
  { label: 'Врачи', href: '#doctors' },
  { label: 'Вопросы', href: '#faq' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contacts' },
] as const;
