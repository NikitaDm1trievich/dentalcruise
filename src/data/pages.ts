/**
 * Тексты внутренних страниц и шаблонов страниц врача и услуги.
 *
 * Сами тексты лежат в src/data/pages/*.json — их правит владелец в
 * редакторе сайта, раздел «Страницы сайта», по файлу на страницу. Здесь
 * только типы: сборка упадёт на проверке, если файл разойдётся с вёрсткой.
 *
 * Данные, которые страница собирает сама (цены, врачи, услуги, адрес и
 * телефон клиники), сюда не дублируются: они в своих разделах редактора.
 */
import about from './pages/about.json';
import gallery from './pages/gallery.json';
import notFound from './pages/not-found.json';
import privacy from './pages/privacy.json';
import consent from './pages/consent.json';
import cookies from './pages/cookies.json';
import documents from './pages/documents.json';
import contacts from './pages/contacts.json';
import team from './pages/team.json';
import doctor from './pages/doctor-page.json';
import service from './pages/service-page.json';
import prices from './pages/prices.json';
import implantVariants from './pages/implant-variants.json';
import implantProsthesis from './pages/implant-prosthesis.json';

/** Заголовок и описание страницы для поисковиков */
type Seo = { title: string; description: string };

/**
 * Необязательное поле: редактор пишет незаполненное значение как "" или
 * null (пустой список — [] или null). Проверка — по истинности.
 */
type Optional<T> = T | null;

/** Страница-заглушка «раздел готовится» и 404 (StubLayout) */
type StubPage = { eyebrow: string; heading: string; lead: string; seo: Seo };

export const aboutPage: {
  eyebrow: string;
  heading: string;
  lead: string;
  book: string;
  breadcrumb: string;
  history: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    /** Кнопка окна лицензии рядом с абзацем про лицензированные услуги */
    license: string;
    galleryLabel: string;
  };
  lab: { eyebrow: string; title: string; paragraphs: string[] };
  location: { eyebrow: string; title: string; text: string; route: string };
  philosophy: { eyebrow: string; title: string; text: string; signature: string };
  foot: { text: string; doctors: string; book: string };
  seo: Seo;
} = about;
export const galleryPage: {
  eyebrow: string;
  heading: string;
  lead: string;
  /** Текст вместо галереи, пока в «Галерее работ» нет ни одной работы */
  empty: string;
  book: string;
  breadcrumb: string;
  /** Подписи кнопок фильтра: «все» и по ключу типа работы из «Галереи работ» */
  filter: { all: string; veneers: string; crowns: string; implants: string };
  before: string;
  after: string;
  /** Ссылка на страницу работы в карточке ленты */
  more: string;
  /** Страница одной работы /gallery/<файл>/ */
  case: {
    /** Название слайдера сравнения для экранного диктора */
    compare: string;
    /** Подсказка на ручке слайдера, гаснет после первого касания */
    drag: string;
    about: string;
    steps: string;
    /** Заголовок блока «Ещё снимки» под слайдером */
    photos: string;
    other: string;
    prev: string;
    next: string;
    all: string;
    /** Заголовок в поиске; `{работа}` — название работы */
    seoTitle: string;
  };
  foot: { text: string; book: string };
  seo: Seo;
} = gallery;
export const notFoundPage: StubPage = notFound;

/**
 * Юридический документ: политика, согласие, политика cookie. Текст —
 * разделы «заголовок + Markdown» (lib/doc-text), реквизиты в нём — метками
 * `{ИНН}`, `{почта}` из контактов клиники (docValues в data/site).
 */
export type LegalDocPage = {
  eyebrow: string;
  heading: string;
  /** Последняя хлебная крошка: «Главная › Документы › …» */
  breadcrumb: string;
  /** «Редакция от {дата}» — `{дата}` заменяется полем edition */
  editionLabel: string;
  /** Дата редакции, как в документе: 11.10.2026 */
  edition: string;
  lead: Optional<string>;
  sections: { title: string; body: Optional<string> }[];
  seo: Seo;
};

export const privacyPage: LegalDocPage = privacy;
export const consentPage: LegalDocPage = consent;
export const cookiesPage: LegalDocPage = cookies;

export const documentsPage: {
  heading: string;
  lead: string;
  breadcrumb: string;
  org: {
    title: string;
    /** Подписи строк реквизитов; значения — из контактов клиники */
    labels: {
      fullName: string;
      orgName: string;
      inn: string;
      kpp: string;
      ogrn: string;
      legalAddress: string;
      address: string;
      schedule: string;
      phone: string;
      email: string;
      site: string;
    };
  };
  license: {
    title: string;
    /** Метки: {номер}, {прежний номер}, {дата}, {орган} — из контактов клиники, группа «Лицензия» */
    text: string;
    /** Кнопка окна со сканами лицензии */
    scans: string;
  };
  /** Платные медуслуги: текст (Markdown) и образец договора — PDF; пока файла нет, пункта нет */
  paid: { title: string; body: Optional<string>; contractLabel: string; contract: Optional<string> };
  /** Свои разделы: заголовок и текст (Markdown). Раздел без текста не выводится */
  sections: { title: string; body: Optional<string> }[];
  privacy: { title: string; policy: string; consent: string; cookies: string; settings: string };
  seo: Seo;
} = documents;

export const contactsPage: {
  eyebrow: string;
  heading: string;
  book: string;
  route: string;
  way: {
    eyebrow: string;
    title: string;
    blocks: {
      icon: string;
      title: string;
      /** Показать станции метро из контактов клиники */
      metro: boolean;
      /** Показать режим работы из контактов клиники */
      schedule: boolean;
      lines: Optional<string[]>;
    }[];
  };
  write: { title: string; text: string; max: string; vk: string };
  docs: { title: string; text: string; button: string };
  breadcrumb: string;
  seo: Seo;
} = contacts;

export const teamPage: {
  eyebrow: string;
  heading: string;
  lead: string;
  book: string;
  breadcrumb: string;
  /** Пустые поля — заголовок и описание собираются из списка врачей */
  seo: { title: Optional<string>; description: Optional<string> };
} = team;

export const doctorPage: {
  /** «Стаж» перед стажем врача в карточках и надписи над именем */
  experience: string;
  book: string;
  about: string;
  /** Заголовок того же блока у сотрудников, которые не врачи */
  aboutStaff: string;
  skills: string;
  education: { eyebrow: string; title: string; courses: string };
  services: { eyebrow: string; title: string; lead: string };
  /** Блок с роликом о враче */
  video: { eyebrow: string; title: string; book: string };
  foot: { text: string; book: string; all: string };
  /** Врач, на странице которого редактор показывает предпросмотр */
  preview: string;
} = doctor;

export const servicePage: {
  /** Надпись над заголовком, если у услуги не выбран раздел прайса */
  category: string;
  book: string;
  facts: { price: string; duration: string; warranty: string };
  includes: string;
  indications: string;
  steps: { eyebrow: string; title: string };
  prices: { eyebrow: string; title: string; lead: string; all: string };
  why: { title: string; text: string; book: string };
  /** В заголовке `{услуга}` заменяется названием услуги строчными буквами */
  faq: { eyebrow: string; title: string; lead: string };
  related: { title: string; all: string };
  /** Карусели страниц услуг: подписи стрелок */
  carousel: { prev: string; next: string };
  /** Описание материала: подпись первого слайда («Коротко») */
  about: { summary: string };
  /** Карусель «Наши работы» (до/после) */
  works: { eyebrow: string; title: string; lead: string };
  /** Блок «Какие виниры мы изготавливаем»: заголовок, ссылка «Подробнее», пометка текущей страницы */
  types: { eyebrow: string; title: string; lead: string; more: string; current: string };
  /** Баннер «Запишитесь на бесплатный осмотр» над контактами */
  banner: { title: string; text: string; book: string; phone: string };
  /** Услуга, на странице которой редактор показывает предпросмотр */
  preview: string;
} = service;

export const pricesPage: {
  heading: string;
  /**
   * `{позиций}` заменяется числом позиций прайса со словом («80 позиций»),
   * `{разделах}` — числом разделов («9 разделах»)
   */
  lead: string;
  terms: { icon: string; title: string; text: string }[];
  /** Подпись липкой кнопки выбора раздела на телефоне */
  sectionLabel: string;
  /** В `found` `{число}` заменяется числом найденных позиций */
  search: { placeholder: string; found: string; empty: string };
  columns: { service: string; includes: string; price: string };
  /** Колонка «Что входит»: выключена — описаний позиций на странице нет */
  showIncludes: boolean;
  /** Кнопка, которая сворачивает «Что входит» у строки на телефоне */
  includesHide: string;
  /** Метка у строк прайса со скидкой — и на страницах услуг */
  promoLabel: string;
  foot: string;
  book: string;
  breadcrumb: string;
  seo: Seo;
} = prices;

/** Блок «Операция и протез» на страницах «Все на 4 / Все на 6 имплантах» */
export const implantVariantsPage: {
  eyebrow: string;
  title: string;
  lead: string;
  tabsLabel: string;
  operation: { step: string; title: string; includesTitle: string; priceLabel: string };
  prosthesis: { step: string; title: string; badge: string; text: string; link: string };
  total: { title: string; text: string };
  /** Подписи карусели этапов; в `dot` {n} заменяется номером этапа */
  carousel: { label: string; prev: string; next: string; dot: string };
  /** Цены берутся из прайса по `priceTitle` — точное название строки раздела «Имплантация» */
  variants: {
    id: '4' | '6';
    tab: string;
    /** Путь к схеме челюсти; пусто — серая заглушка */
    image: string;
    imageAlt: string;
    /** Пропорции кадра под картинку, например «4 / 3» */
    imageRatio: string;
    imageLabel: string;
    includes: string[];
    operationRows: { label: string; priceTitle: string }[];
  }[];
} = implantVariants as never;

/** Блок «Варианты протезирования на имплантах»: цены и описания из прайса по `priceTitle` */
export const implantProsthesisPage: {
  eyebrow: string;
  title: string;
  lead: string;
  tabsLabel: string;
  includesLabel: string;
  book: string;
  variants: {
    id: '4' | '6';
    tab: string;
    image: string;
    imageAlt: string;
    imageRatio: string;
    rows: { label: string; tag: string; note?: string; priceTitle: string; explain?: string }[];
  }[];
} = implantProsthesis as never;
