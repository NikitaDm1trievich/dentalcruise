import type { APIRoute, GetStaticPaths } from 'astro';

import seo from '../data/seo.json';

/**
 * Ключ IndexNow.
 *
 * IndexNow — способ сказать Яндексу и Bing «страница изменилась» сразу
 * после деплоя, вместо ожидания обхода робота: новая услуга или врач
 * попадают в поиск за часы, а не за недели. Протокол требует доказать
 * права на домен — на сайте должен лежать текстовый файл с именем,
 * равным ключу, и с этим же ключом внутри.
 *
 * Ключ владелец генерирует один раз (любая строка из 8–128 латинских
 * букв и цифр) и вписывает в редакторе — раздел «SEO». Пока поле пустое,
 * файл не собирается вовсе: пустышка по случайному адресу только сбила бы
 * проверку. Отправку уведомлений делает шаг в GitHub Actions после сборки.
 */
export const getStaticPaths: GetStaticPaths = () => {
  const key = seo.indexNowKey.trim();
  return key ? [{ params: { indexnow: key } }] : [];
};

export const GET: APIRoute = ({ params }) =>
  new Response(params.indexnow ?? '', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
