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
} = blocksRaw;

export type FormCopy = {
  title: string;
  lead: string;
  fields: {
    name: string;
    phone: string;
    phonePlaceholder: string;
    phoneHint: string;
    comment: string;
    consent: string;
    consentLink: string;
  };
  submit: string;
  sending: string;
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
