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
  more: string;
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
  skills: string;
  education: { eyebrow: string; title: string; courses: string };
  services: { eyebrow: string; title: string; lead: string };
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
