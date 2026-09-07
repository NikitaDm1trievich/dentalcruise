# Worker для формы записи

Принимает заявку с сайта и пересылает её в Telegram. Ничего не хранит.

Зачем отдельный сервис: токен Telegram-бота нельзя класть в статический сайт —
любой посетитель прочитал бы его в исходниках страницы. Здесь токен лежит в
секретах Cloudflare, а браузер обращается только к этому эндпоинту.

## Что уже сделано в коде

- CORS: заявки принимаются только с доменов из `ALLOWED_ORIGINS`
- ограничение частоты: 5 заявок за 60 секунд с одного IP
- ловушка для ботов: скрытое поле `website`, заполнено — заявка молча отбрасывается
- проверка полей и обязательное согласие на обработку данных
- экранирование пользовательского текста перед отправкой в Telegram

## Настройка

### 1. Завести бота и узнать chat_id

1. В Telegram написать [@BotFather](https://t.me/BotFather), команда `/newbot`.
   Он выдаст токен вида `123456789:AA...`.
2. Создать чат или группу, куда будут падать заявки, и добавить туда бота.
3. Написать в этот чат любое сообщение, затем открыть в браузере
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и взять оттуда `chat.id`
   (у групп он отрицательный).

### 2. Разложить секреты

```bash
cd worker
npm install
npx wrangler login

npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

Секреты вводятся в консоли и в репозиторий не попадают.

### 3. Задеплоить

```bash
npm run deploy
```

Wrangler напечатает адрес вида
`https://dentalcruise-booking.<ваш-субдомен>.workers.dev`.

### 4. Прописать адрес на сайте

Эндпоинт — это адрес Worker'а плюс `/booking`. Положить его:

- локально — в `.env` в корне репозитория:
  `PUBLIC_BOOKING_ENDPOINT="https://dentalcruise-booking.<субдомен>.workers.dev/booking"`
- на сборке — в переменную репозитория GitHub:
  **Settings → Secrets and variables → Actions → Variables → New variable**,
  имя `PUBLIC_BOOKING_ENDPOINT`.

### 5. Проверить

```bash
curl https://dentalcruise-booking.<субдомен>.workers.dev/health
# {"ok":true}
```

Дальше — отправить настоящую заявку с сайта и убедиться, что она пришла в чат.

## Локальная разработка

```bash
cp .dev.vars.example .dev.vars   # вписать туда токен и chat_id
npm run dev
```

`.dev.vars` в git не попадает.

## Когда сайт переедет на домен клиники

Добавить боевой домен в `ALLOWED_ORIGINS` в `wrangler.jsonc` и передеплоить —
иначе браузер заблокирует отправку заявки по CORS.

## Логи

```bash
npm run tail
```
