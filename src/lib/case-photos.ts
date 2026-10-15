/**
 * Фото работ «до/после» с водяным знаком клиники.
 *
 * Оригиналы владелец загружает в редакторе («Галерея работ (до и после)»),
 * и редактор кладёт их в src/assets/cases — вне public, поэтому на хостинг
 * они как есть не попадают. В записи работы путь пишется как
 * `/images/cases/<файл>`: так его показывает редактор (public_folder в
 * public/admin/config.yml), а сборка понимает его как «файл <файл> из
 * src/assets/cases».
 *
 * На сайт уходят только копии, собранные здесь: кадр 4:3, уменьшенный, в
 * webp, без EXIF (в нём модель камеры, дата и бывают координаты съёмки) и
 * с логотипом, вшитым в сам снимок. Их отдаёт статический адрес
 * src/pages/images/cases/[name].webp.ts.
 *
 * Кадр общий для «до» и «после» — 4:3, иначе в слайдере сравнения снимки
 * разных пропорций не совпали бы. Что оставить в кадре, задаёт поле
 * «Положение кадра» (как object-position в CSS: «50% 30%»). Логотип стоит
 * по центру внизу уже обрезанного кадра, на обоих снимках одинаково: в
 * слайдере половинки знака сходятся в целый, где бы ни стояла полоска.
 */
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

import { withBase } from './asset';

/* Сборка и dev-сервер запускаются из корня проекта (npm run …). От
   import.meta.url считать нельзя: после сборки модуль лежит в dist. */
const SOURCE_DIR = path.resolve(process.cwd(), 'src/assets/cases');
const LOGO_FILE = path.resolve(process.cwd(), 'public/logo-dentalcruise.svg');

/** Адрес копий на сайте — тот же, что пишет редактор: /images/cases/… */
const PUBLIC_DIR = '/images/cases/';

/** Пропорции кадра, ширина к высоте */
export const CASE_PHOTO_RATIO = 4 / 3;
/** Ширина копий: крупная — для страницы работы, малая — для карточки в ленте */
export const CASE_PHOTO_WIDTHS = { full: 1600, card: 800 } as const;

/** Логотип — четверть ширины кадра, полупрозрачный белый с мягкой тенью */
const MARK_WIDTH = 0.25;
const MARK_OPACITY = 0.42;
const SHADOW_OPACITY = 0.35;
/** Отступ знака от нижнего края, доля высоты кадра */
const MARK_BOTTOM = 0.035;

export type CasePhotoVariant = { src: string; width: number; height: number };
export type CasePhoto = { full: CasePhotoVariant; card: CasePhotoVariant };
/** Поле фото из записи, положение кадра и увеличение (в процентах) к нему */
export type CasePhotoInput = { value: string | undefined; position?: string; zoom?: number };
/** Что собрать: имя копии на сайте → исходник, ширина, положение кадра */
export type CasePhotoFile = { file: string; source: string; width: number; position: Position };

/** Кадр: положение в процентах, как object-position, и увеличение (100 — без него) */
type Position = { x: number; y: number; zoom: number };
type Box = { left: number; top: number; width: number; height: number };

/** Имя исходника из записи: `/images/cases/a b.jpg` → `a b.jpg` */
function sourceName(value: string): string {
  const name = value.split(/[?#]/)[0].split('/').pop() ?? '';
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

/**
 * «50% 30%» → { x: 50, y: 30 }. Как object-position в CSS: первое число —
 * по горизонтали, второе — по вертикали; одно число — только горизонталь.
 * Знак % можно не писать. Непонятное значение — центр кадра.
 *
 * Увеличение — во сколько процентов крупнее показать снимок: 150 — вырезать
 * из него участок в полтора раза меньше. Нужно, когда «до» и «после» сняты
 * с разного расстояния. Меньше 100 и пустое — без увеличения, больше 400 не
 * даём: от кадра остались бы пиксели.
 */
export function parsePosition(text: string | undefined, zoom?: number | null): Position {
  const numbers = (text ?? '').match(/-?\d+(?:[.,]\d+)?/g)?.map((n) => Number(n.replace(',', '.'))) ?? [];
  const clamp = (n: number | undefined) => (n === undefined || Number.isNaN(n) ? 50 : Math.min(100, Math.max(0, n)));
  const scale = zoom && Number.isFinite(zoom) ? Math.min(400, Math.max(100, Math.round(zoom))) : 100;
  return { x: clamp(numbers[0]), y: clamp(numbers[1]), zoom: scale };
}

/** Участок исходника 4:3 с учётом увеличения, сдвинутый по правилам object-position */
function cropBox(width: number, height: number, { x, y, zoom }: Position): Box {
  const fullW = width / height > CASE_PHOTO_RATIO ? height * CASE_PHOTO_RATIO : width;
  const w = Math.max(1, Math.round((fullW * 100) / zoom));
  const h = Math.min(height, Math.max(1, Math.round(w / CASE_PHOTO_RATIO)));
  return {
    left: Math.round(((width - w) * x) / 100),
    top: Math.round(((height - h) * y) / 100),
    width: w,
    height: h,
  };
}

/**
 * Имя копии латиницей. Редактор сохраняет файл под тем именем, с каким его
 * загрузили, — бывает и «Фото до.JPG». Такое имя в адресе неудобно, поэтому
 * берём латинские буквы и цифры, а чтобы два «фото.jpg» не совпали,
 * добавляем короткий отпечаток исходного имени. Положение кадра — тоже в
 * имени: сдвинули кадр — у копии новый адрес, и браузер не покажет старую.
 */
function outputStem(source: string, position: Position): string {
  const stem = source.replace(/\.[^.]+$/, '');
  const safe = stem
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
  const hash = createHash('sha256').update(source).digest('hex').slice(0, 6);
  const base = safe === stem && safe ? safe : safe ? `${safe}-${hash}` : hash;
  const moved = position.x !== 50 || position.y !== 50;
  const at = moved ? `-at${Math.round(position.x)}x${Math.round(position.y)}` : '';
  return `${base}${at}${position.zoom !== 100 ? `-z${position.zoom}` : ''}`;
}

const sizeCache = new Map<string, Promise<{ width: number; height: number }>>();

/** Размер исходника с учётом поворота из EXIF (снимки с телефона) */
function sourceSize(source: string): Promise<{ width: number; height: number }> {
  let size = sizeCache.get(source);
  if (!size) {
    size = sharp(path.join(SOURCE_DIR, source))
      .metadata()
      .then(({ width = 0, height = 0, orientation = 1 }) =>
        orientation >= 5 ? { width: height, height: width } : { width, height },
      );
    sizeCache.set(source, size);
  }
  return size;
}

/** Исходник, если файл на месте; иначе undefined и предупреждение в логе сборки */
function existingSource(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const source = sourceName(value);
  if (source && existsSync(path.join(SOURCE_DIR, source))) return source;
  console.warn(`[галерея] нет файла src/assets/cases/${source} (поле «${value}») — работа не попадёт на сайт`);
  return undefined;
}

/**
 * Фото работы по полю из записи. Нет значения или файла — undefined:
 * такая работа не пара «до/после» и на сайт не выходит.
 */
export async function casePhoto({ value, position, zoom }: CasePhotoInput): Promise<CasePhoto | undefined> {
  const source = existingSource(value);
  if (!source) return undefined;
  const at = parsePosition(position, zoom);
  const size = await sourceSize(source);
  const crop = cropBox(size.width, size.height, at);
  const stem = outputStem(source, at);
  const variant = (target: number): CasePhotoVariant => {
    const width = Math.min(target, crop.width);
    return {
      src: withBase(`${PUBLIC_DIR}${stem}-${target}.webp`),
      width,
      height: Math.round(width / CASE_PHOTO_RATIO),
    };
  };
  return { full: variant(CASE_PHOTO_WIDTHS.full), card: variant(CASE_PHOTO_WIDTHS.card) };
}

/** Все копии для фото из записей: по две на снимок. */
export function casePhotoFiles(inputs: CasePhotoInput[]): CasePhotoFile[] {
  const files = new Map<string, CasePhotoFile>();
  for (const { value, position, zoom } of inputs) {
    const source = value ? sourceName(value) : '';
    if (!source || !existsSync(path.join(SOURCE_DIR, source))) continue;
    const at = parsePosition(position, zoom);
    for (const width of Object.values(CASE_PHOTO_WIDTHS)) {
      const file = `${outputStem(source, at)}-${width}.webp`;
      const taken = files.get(file);
      if (taken && taken.source !== source) {
        throw new Error(`Галерея работ: файлы «${taken.source}» и «${source}» дают одно имя ${file} — переименуйте один`);
      }
      files.set(file, { file, source, width, position: at });
    }
  }
  return [...files.values()];
}

let logoPaths: string | undefined;

/** Контуры логотипа без цвета — цвет задаёт слой знака */
function logoShapes(): string {
  logoPaths ??= (readFileSync(LOGO_FILE, 'utf8').match(/<path\b[^>]*?(?:\/>|>\s*<\/path>)/g) ?? [])
    .map((tag) => tag.replace(/\sfill="[^"]*"/, ''))
    .join('');
  if (!logoPaths) throw new Error('Галерея работ: в public/logo-dentalcruise.svg не нашлось контуров логотипа');
  return logoPaths;
}

/**
 * Знак: логотип шириной `logoWidth` и поля вокруг под размытие тени. Тень
 * (размытый тёмный слой) делает знак читаемым на светлом фото, белый
 * слой — на тёмном.
 */
function markSvg(logoWidth: number): { svg: Buffer; width: number; height: number } {
  // viewBox логотипа — 144 × 50; поля — по 6 единиц
  const pad = 6;
  const viewW = 144 + pad * 2;
  const viewH = 50 + pad * 2;
  const width = Math.round((logoWidth * viewW) / 144);
  const height = Math.round((width * viewH) / viewW);
  const shapes = logoShapes();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${-pad} ${-pad} ${viewW} ${viewH}">
<defs><filter id="s" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="1.1"/></filter></defs>
<g fill="#043041" opacity="${SHADOW_OPACITY}" filter="url(#s)" transform="translate(0 0.8)">${shapes}</g>
<g fill="#ffffff" opacity="${MARK_OPACITY}">${shapes}</g>
</svg>`;
  return { svg: Buffer.from(svg), width, height };
}

/** Собрать копию: поворот по EXIF, кадр 4:3, уменьшение, знак, webp без метаданных. */
export async function renderCasePhoto({ source, width, position }: CasePhotoFile): Promise<Buffer> {
  const size = await sourceSize(source);
  const resized = await sharp(path.join(SOURCE_DIR, source))
    .rotate()
    .extract(cropBox(size.width, size.height, position))
    .resize({ width, withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = resized.info;
  const mark = markSvg(Math.round(w * MARK_WIDTH));
  return sharp(resized.data)
    .composite([
      {
        input: mark.svg,
        left: Math.round((w - mark.width) / 2),
        top: Math.max(0, Math.round(h - mark.height - h * MARK_BOTTOM)),
      },
    ])
    .webp({ quality: 82 })
    .toBuffer();
}
