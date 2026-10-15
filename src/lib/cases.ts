/**
 * Работы «до/после», которые выходят на сайт: лента /gallery, страницы
 * /gallery/<файл>/ и копии фото со знаком (src/pages/images/cases).
 *
 * Работа без одного из снимков (запись сохранили до загрузки фото или файл
 * пропал) — не пара «до/после»: её нет ни в ленте, ни отдельной страницей.
 * Одно условие для всех трёх мест, чтобы ссылка из ленты не вела в 404.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

import { casePhoto, type CasePhoto } from './case-photos';

export type PublishedCase = {
  entry: CollectionEntry<'cases'>;
  before: CasePhoto;
  after: CasePhoto;
  /** Ещё снимки работы; без загруженного файла снимок просто пропускается */
  photos: { photo: CasePhoto; caption?: string }[];
};

let cached: Promise<PublishedCase[]> | undefined;

async function load(): Promise<PublishedCase[]> {
  const entries = (await getCollection('cases')).sort(
    // При равном порядке — по имени файла: соседи «предыдущая/следующая»
    // не должны меняться от сборки к сборке
    (a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id),
  );
  const cases = await Promise.all(
    entries.map(async (entry) => {
      const { before: b, after: a, beforePosition, afterPosition, beforeZoom, afterZoom } = entry.data;
      const [before, after, ...more] = await Promise.all([
        casePhoto({ value: b, position: beforePosition, zoom: beforeZoom }),
        casePhoto({ value: a, position: afterPosition, zoom: afterZoom }),
        ...entry.data.photos.map(({ photo, position, zoom }) => casePhoto({ value: photo, position, zoom })),
      ]);
      const photos = more.flatMap((photo, i) => (photo ? [{ photo, caption: entry.data.photos[i].caption }] : []));
      return before && after ? { entry, before, after, photos } : undefined;
    }),
  );
  return cases.filter((item): item is PublishedCase => Boolean(item));
}

/** Опубликованные работы в порядке ленты */
export function publishedCases(): Promise<PublishedCase[]> {
  // В dev-сервере запись правят на лету — кэшируем только сборку
  if (import.meta.env.DEV) return load();
  cached ??= load();
  return cached;
}

/** Абзацы описания: в редакторе их разделяют пустой строкой */
export function paragraphs(text: string | undefined): string[] {
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}
