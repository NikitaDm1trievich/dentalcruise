# Источники внешних скиллов

Скиллы ниже взяты из открытого репозитория [jezweb/claude-skills](https://github.com/jezweb/claude-skills) (MIT License, © 2025 Jeremy Dawes / Jezweb) и скопированы как есть в этот проект, чтобы их можно было вызывать в любом новом чате Claude Code по имени.

| Скилл | Исходный путь в репозитории | Зачем в этом проекте |
|---|---|---|
| `cloudflare-worker-builder` | `plugins/cloudflare/skills/cloudflare-worker-builder` | Скаффолдинг и деплой Cloudflare Worker — используем для эндпоинта "форма записи → Telegram" ([site-brief.md](../../site-brief.md), решение по хостингу формы) |
| `tailwind-theme-builder` | `plugins/frontend/skills/tailwind-theme-builder` | Настройка Tailwind-темы (CSS-переменные, палитра). Написан под связку Tailwind v4 + shadcn/ui на Vite/React — у нас Astro, поэтому подход к CSS-переменным/палитре переносим, а инструкции по установке проверяем под Astro-конфиг вручную |
| `landing-page` | `plugins/frontend/skills/landing-page` | Генерация структуры лендинга по брифу. Написан под единый self-contained HTML файл с Tailwind через CDN — у нас многостраничная Astro-сборка, поэтому используем скорее как справочник по структуре/паттернам блоков, а не как есть |
| `seo-local-business` | `plugins/web-design/skills/seo-local-business` | JSON-LD LocalBusiness/Dentist схема, meta-теги, robots.txt, sitemap.xml. **Важно**: шаблоны заточены под Австралию (+61 телефон, ABN) — при использовании нужно заменить на +7, ИНН/ОГРН, российские паттерны адреса |
| `responsiveness-check` | `plugins/dev-tools/skills/responsiveness-check` | Автоматизированная проверка адаптивности по брейкпоинтам через браузер — под требование "адаптивно под Android/iOS/все браузеры" |
| `design-review` | `plugins/frontend/skills/design-review` | Визуальная приёмка готовых блоков сайта против макета из Claude Design (не про юзабилити, а про то, что вёрстка выглядит опрятно/профессионально) |

## Скиллы из других источников

Взяты по прямой ссылке пользователя, проверены построчно на вредоносные паттерны (curl/exec/eval, сбор credentials, подозрительные домены) перед копированием — вредоносного содержимого не найдено.

| Скилл | Источник | Зачем в этом проекте | Примечание |
|---|---|---|---|
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | Аудит вёрстки против чек-листа Vercel Web Interface Guidelines (доступность, интерактивность, типографика) | При каждом запуске сам подтягивает свежие правила с `raw.githubusercontent.com/vercel-labs/web-interface-guidelines` через WebFetch — не статичный набор правил |
| `design-taste-frontend` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (`skills/taste-skill/SKILL.md`) | Против шаблонного «AI-дизайна» — читает бриф, называет design-read одной строкой, задаёт три параметра (variance/motion/density) до вёрстки | ⚠️ У репозитория ~86k звёзд при аккаунте, созданном ~7 месяцев назад — статистика неправдоподобна для нишевого скилл-репо, похоже на накрутку. Само содержимое SKILL.md прочитано полностью и не содержит ничего вредоносного, но официальный инсталлятор (`npx skills add ...`) не запускался — файл скопирован вручную в обход выполнения стороннего кода |
| `image-to-code` | тот же репозиторий, `skills/image-to-code-skill/SKILL.md` | Вёрстка по референс-изображению: сначала анализ композиции, потом код | Написан с оглядкой на генерацию изображений в Codex — в этом проекте актуальна только часть «анализ референса → вёрстка» |

Ещё две ссылки пользователь присылал, но они не установлены:
- **`ui-ux-pro-max-skill`** ([nextlevelbuilder](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) — отклонён: 126.5k звёзд и 13.5k форков при репозитории, созданном 2025-11-30, что превышает суммарную историческую популярность большинства крупнейших open-source проектов; ставится через глобальный `npm install -g` CLI с закрытым для быстрого аудита исходником. Слишком высокий риск для непроверенного глобального пакета.
- **`awesome-design-skills`** ([bergside](https://github.com/bergside/awesome-design-skills)) — сам список (67 стилей: glassmorphism, brutalism, minimal и т.д.) выглядит правдоподобно, но не установлен: нужно явно выбрать конкретный стиль, а официальный способ получения (`npx typeui.sh pull <slug>`) не проверялся и не запускался.

Обновлено: 2026-09-10.
