#!/usr/bin/env bash
# Публикация сайта на боевой сервер (dentalcruise.ru): сборка и rsync.
# Адрес сервера, пользователь и ключ в репозиторий не кладём — они берутся из окружения:
#   DEPLOY_HOST  адрес сервера
#   DEPLOY_USER  пользователь для заливки (только папка сайта)
#   DEPLOY_KEY   путь к закрытому ключу
#   DEPLOY_PATH  папка сайта на сервере
# Папка /stats/ на сервере служебная (статистика ISPConfig), rsync её не трогает.
# DRY_RUN=1 — показать, что изменится, ничего не заливая.
# Значения для этой машины записаны в памяти проекта (dentalcruise-production-runbook).
set -euo pipefail

: "${DEPLOY_HOST:?задайте DEPLOY_HOST}"
: "${DEPLOY_USER:?задайте DEPLOY_USER}"
: "${DEPLOY_KEY:?задайте DEPLOY_KEY}"
: "${DEPLOY_PATH:?задайте DEPLOY_PATH}"

cd "$(dirname "$0")/.."

# Без адреса обработчика форма на сайте не отправится
if ! grep -q '^PUBLIC_BOOKING_ENDPOINT=.\+' .env 2>/dev/null && [ -z "${PUBLIC_BOOKING_ENDPOINT:-}" ]; then
  echo "Нет PUBLIC_BOOKING_ENDPOINT (в .env или окружении): форма не заработает" >&2
  exit 1
fi

git fetch -q
if [ "$(git rev-parse HEAD)" != "$(git rev-parse '@{u}')" ]; then
  echo "Локальная ветка не совпадает с origin: сделайте git pull / git push, затем повторите" >&2
  exit 1
fi

SITE=https://dentalcruise.ru BASE=/ npm run build

# На сервере /robots.txt перехватывается конфигом основного сайта, поэтому
# рядом лежит копия robots-site.txt: nginx подменяет адрес (см. runbook).
cp dist/robots.txt dist/robots-site.txt

# Страховка: не заливать пустую или тестовую сборку
grep -q 'rel="canonical" href="https://dentalcruise.ru/"' dist/index.html
! grep -q 'name="robots" content="noindex' dist/index.html

opts=(-rlt --delete --exclude=/stats/ --chmod=D755,F644 -e "ssh -i $DEPLOY_KEY -o IdentitiesOnly=yes -o ProxyCommand=none -o ConnectTimeout=15")
[ "${DRY_RUN:-}" = "1" ] && opts+=(-n -i)
rsync "${opts[@]}" dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"

echo "Готово. Проверьте: https://dentalcruise.ru/"
