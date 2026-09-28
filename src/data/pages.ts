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

export const privacyPage: StubPage & {
  /** Начало первого абзаца, дальше сайт дописывает название и адрес клиники */
  operator: string;
  paragraphs: string[];
  /** Последний абзац: текст перед телефоном и между телефоном и почтой */
  contact: string;
  contactOr: string;
} = privacy;

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
  /** `{позиций}` заменяется числом позиций прайса со словом: «71 позиция» */
  lead: string;
  filterAll: string;
  terms: { icon: string; title: string; text: string }[];
  /** Метка у строк прайса со скидкой — и на страницах услуг */
  promoLabel: string;
  foot: string;
  book: string;
  breadcrumb: string;
  seo: Seo;
} = prices;
