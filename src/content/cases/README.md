# Кейсы «до/после»

Один JSON-файл на кейс. Загрузчик берёт только `*.json`, этот README игнорируется.

```json
{
  "title": "Виниры E-max, верхний ряд",
  "category": "veneers",
  "before": "/images/cases/case-01-before.jpg",
  "after": "/images/cases/case-01-after.jpg",
  "note": "6 виниров, две недели от слепка до установки",
  "order": 10
}
```

`category` должна совпадать с полем `category` в `src/content/services/*.json`
(`veneers` / `crowns` / `implants`) — по нему работает фильтр на странице
«Галерея работ». Фото кладём в `public/images/cases/`.

Наполнение — второй волной, после фотосъёмки работ.
