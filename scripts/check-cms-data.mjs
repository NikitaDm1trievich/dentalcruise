/**
 * Не дать редактору молча стереть поля в данных сайта.
 *
 * Sveltia при сохранении записывает только те поля, что есть в её
 * config.yml. Если вкладка редактора открыта до обновления админки, новых
 * полей она не знает и при сохранении выбрасывает их из JSON — так
 * пропала «Крупная надпись под услугами» у врача (коммит 753f0d1).
 *
 * Очищенное владельцем поле редактор сохраняет пустым значением ("",
 * null, false), а не удаляет. Поэтому признак беды простой: в коммите из
 * редактора поле, у которого было непустое значение, исчезло из файла
 * совсем. Тогда публикация останавливается, сайт остаётся прежним, а в
 * логе видно, какое поле, в каком файле и коммите пропало.
 *
 * Проверяются только коммиты редактора (сообщения из commit_messages в
 * public/admin/config.yml: «Обновить …», «Добавить …», «Удалить …»).
 * Коммиты разработчика не проверяются — там переименование и удаление
 * полей бывает намеренным.
 *
 * Элементы списков сравниваются без номеров (`items[].title`): владелец
 * вправе удалять и переставлять элементы, это не потеря поля.
 *
 *   node scripts/check-cms-data.mjs <от-коммита> [до-коммита]
 *
 * Без аргументов проверяет последний коммит. В GitHub Actions диапазон —
 * github.event.before..github.sha (см. .github/workflows/deploy.yml).
 */
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/* «Обновить «Врачи»: ortoped» (нынешний формат) и «Обновить Врачи: ortoped»
   (прежний). У коммитов разработчика после действия идёт фраза без
   «: <запись>» в конце. */
const CMS_MESSAGE = /^(Обновить|Добавить|Удалить) (?:«[^»]+»|[^:]+): \S+$/;
const DATA_FILE = /^src\/(data|content)\/.+\.json$/;
const ZERO = /^0+$/;

/** Непустое значение: то, что владелец видел заполненным. */
function filled(value) {
  if (value === null || value === undefined || value === false || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

/**
 * Пути полей без номеров элементов: `license.scans[].title`.
 * `paths` — все встреченные пути, `withValue` — пути с непустым значением.
 */
function collect(value, path = '', paths = new Set(), withValue = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, `${path}[]`, paths, withValue);
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      const next = path ? `${path}.${key}` : key;
      paths.add(next);
      if (filled(item)) withValue.add(next);
      collect(item, next, paths, withValue);
    }
  }
  return { paths, withValue };
}

/** Родитель пути: `a.b[].c` → `a.b[]`, `a.b` → `a`, `a` → ''. */
function parent(path) {
  const cut = path.lastIndexOf('.');
  return cut < 0 ? '' : path.slice(0, cut);
}

/**
 * Есть ли в новом файле место, где поле могло бы стоять. Если список
 * опустел или объект удалён целиком — это правка владельца, не потеря.
 */
function containerExists(path, paths, data) {
  const up = parent(path);
  if (!up) return data && typeof data === 'object';
  const key = up.replace(/\[\]$/, '');
  if (!paths.has(key)) return false;
  if (up.endsWith('[]')) {
    // Список, в котором остались объекты
    return lookup(data, key).some((list) => Array.isArray(list) && list.some((i) => i && typeof i === 'object'));
  }
  return true;
}

/** Все значения по пути без номеров (для списков — по каждому элементу). */
function lookup(data, path) {
  let current = [data];
  for (const part of path.split('.')) {
    const list = part.endsWith('[]');
    const key = list ? part.slice(0, -2) : part;
    current = current
      .flatMap((node) => (Array.isArray(node) ? node : [node]))
      .map((node) => (node && typeof node === 'object' ? node[key] : undefined))
      .filter((node) => node !== undefined);
  }
  return current;
}

function readJson(rev, file) {
  try {
    return JSON.parse(git('show', `${rev}:${file}`));
  } catch {
    return undefined;
  }
}

function commitsInRange(from, to) {
  if (!from || ZERO.test(from)) return [to];
  try {
    return git('rev-list', '--reverse', `${from}..${to}`).split('\n').filter(Boolean);
  } catch {
    // Начало диапазона недоступно (force-push, неполная история) —
    // проверяем хотя бы последний коммит.
    return [to];
  }
}

const [fromArg, toArg = 'HEAD'] = process.argv.slice(2);
const to = git('rev-parse', toArg).trim();
const from = fromArg ?? `${to}^`;

const problems = [];
/** Пути полей в итоговой версии файла: вернули поле позже в той же пачке — не ошибка. */
const finalPaths = new Map();
function pathsAtTip(file) {
  if (!finalPaths.has(file)) finalPaths.set(file, collect(readJson(to, file) ?? {}).paths);
  return finalPaths.get(file);
}

for (const commit of commitsInRange(from, to)) {
  const message = git('log', '-1', '--format=%s', commit).trim();
  if (!CMS_MESSAGE.test(message)) continue;
  let parentRev;
  try {
    parentRev = git('rev-parse', `${commit}^`).trim();
  } catch {
    continue;
  }
  const files = git('diff', '--name-only', '--diff-filter=M', parentRev, commit)
    .split('\n')
    .filter((file) => DATA_FILE.test(file));

  for (const file of files) {
    const before = readJson(parentRev, file);
    const after = readJson(commit, file);
    if (before === undefined || after === undefined) continue;
    const old = collect(before);
    const now = collect(after);
    for (const path of old.withValue) {
      if (now.paths.has(path)) continue;
      if (!containerExists(path, now.paths, after)) continue;
      if (pathsAtTip(file).has(path)) continue;
      const sample = lookup(before, path).find(filled);
      problems.push({ commit: commit.slice(0, 7), message, file, path, sample });
    }
  }
}

if (problems.length === 0) {
  console.log('Данные из редактора: пропавших полей нет.');
  process.exit(0);
}

console.error('Редактор при сохранении стёр заполненные поля. Публикация остановлена, сайт остался прежним.\n');
for (const p of problems) {
  const shown = typeof p.sample === 'string' ? `«${p.sample.slice(0, 80)}»` : JSON.stringify(p.sample)?.slice(0, 80);
  console.error(`  ${p.commit} «${p.message}»: ${p.file} — поле ${p.path} (было ${shown})`);
  // Аннотация, видная на странице запуска в GitHub Actions
  console.error(`::error file=${p.file}::Поле ${p.path} стёрто при сохранении в редакторе (${p.commit})`);
}
console.error(
  '\nСкорее всего, запись сохранили из вкладки редактора, открытой до его обновления.' +
    '\nЧто делать: перезагрузить все вкладки редактора, открыть запись и заново заполнить поле' +
    '\n(или вернуть его командой git: git checkout <коммит>^ -- <файл>, затем поправить и сохранить).',
);
process.exit(1);
