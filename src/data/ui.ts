/**
 * Подписи общих блоков, которые стоят на всех страницах: карточка адреса,
 * шторка лицензии, кнопки заглушек, окно и форма записи.
 *
 * Тексты лежат в blocks.json и form.json — их правит владелец в редакторе
 * («Шапка, подвал и контакты»). Здесь только типы. Скрипт формы записи
 * читает form.json напрямую: в браузер уходят только её сообщения.
 */
import blocksRaw from './blocks.json';
import formRaw from './form.json';

export const blocks: {
  place: { route: string; routeImage: string; mapLink: string };
  license: {
    title: string;
    issuer: string;
    formerNumber: string;
    note: string;
    scanLabel: string;
    open: string;
    registry: string;
    close: string;
  };
  stub: { book: string; home: string };
  /** Уведомление о cookie: `{ссылка}` в тексте — ссылка на политику cookie с подписью link */
  cookie: {
    label: string;
    text: string;
    link: string;
    accept: string;
    decline: string;
    stateOn: string;
    stateOff: string;
  };
  /** Заглушки виджетов Яндекс Карт до нажатия кнопки */
  embed: { mapText: string; mapButton: string; reviewsText: string; reviewsButton: string };
  /** Предупреждение о противопоказаниях (ч. 7 ст. 24 38-ФЗ «О рекламе»): страницы услуг, прайс, акции */
  medical: { warning: string };
} = blocksRaw;

export type FormCopy = {
  title: string;
  lead: string;
  /** Строка под заголовком, когда запись открыта из подбора по проблеме: «Вы выбрали: Болит зуб» */
  picked: string;
  /**
   * Начало текста, который подставляется в поле комментария, — направление
   * (раздел прайса), а не жалоба: «Направление: Лечение каналов». Жалоба
   * в заявку не уходит: это сведения о здоровье.
   */
  pickedComment: string;
  fields: {
    name: string;
    phone: string;
    phonePlaceholder: string;
    phoneHint: string;
    comment: string;
    commentPlaceholder: string;
    /** Пояснение под комментарием: не описывать симптомы */
    commentHint: string;
    /** `{согласие}` и `{политикой}` — ссылки на /consent/ и /privacy/ с подписями ниже */
    consent: string;
    consentLink: string;
    privacyLink: string;
  };
  submit: string;
  sending: string;
  /** Строка под кнопкой отправки; пусто — строки нет */
  privacyNote: string;
  fallback: string;
  done: { title: string; text: string; call: string; max: string };
  errors: {
    name: string;
    phone: string;
    consent: string;
    offline: string;
    noEndpoint: string;
    timeout: string;
    generic: string;
  };
};

export const form: FormCopy = formRaw;
