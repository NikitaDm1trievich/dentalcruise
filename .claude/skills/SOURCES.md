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

Обновлено: 2026-09-07.
