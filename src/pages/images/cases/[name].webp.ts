import type { APIRoute, GetStaticPaths } from 'astro';

import { casePhotoFiles, renderCasePhoto, type CasePhotoFile } from '../../../lib/case-photos';
import { publishedCases } from '../../../lib/cases';

/**
 * Фото работ «до/после» со знаком клиники: /images/cases/<имя>-<ширина>.webp.
 *
 * Оригиналы лежат в src/assets/cases и на хостинг не попадают — сборка
 * кладёт в dist только эти копии (подробности — src/lib/case-photos.ts).
 * Собираются только снимки опубликованных работ: файл, загруженный в
 * редактор по ошибке и не выбранный ни в одной работе, на сайт не уйдёт.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const cases = await publishedCases();
  const sources = cases.flatMap(({ entry: { data } }) => [
    { value: data.before, position: data.beforePosition, zoom: data.beforeZoom },
    { value: data.after, position: data.afterPosition, zoom: data.afterZoom },
  ]);
  // Расширение — в имени файла маршрута: так Astro понимает, что это файл,
  // и не требует слеша на конце адреса (trailingSlash: 'always')
  return casePhotoFiles(sources).map((photo) => ({
    params: { name: photo.file.replace(/\.webp$/, '') },
    props: { photo },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { photo } = props as { photo: CasePhotoFile };
  const body = await renderCasePhoto(photo);
  return new Response(new Uint8Array(body), { headers: { 'Content-Type': 'image/webp' } });
};
