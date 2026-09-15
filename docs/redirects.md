# Карта редиректов со старого сайта (Bitrix → Astro)

Нужна в день переезда домена `dentalcruise.ru` на новую сборку: без неё
накопленные позиции старых страниц теряются, а люди из закладок и поиска
попадают на 404. Настраивается на хостинге (Caddy, nginx, панель хостера) —
статическая сборка сама редиректы делать не умеет.

Список получен обходом живого сайта 15 сентября 2026: все ссылки, до которых
можно дойти с главной (58 адресов). У старого сайта нет `robots.txt` и
`sitemap.xml`, поэтому полный перечень стоит сверить с Яндекс Вебмастером
(раздел «Страницы в поиске») перед переездом — там могут быть адреса,
на которые с главной уже не ведёт ни одна ссылка.

Общие правила, которые должны остаться после переезда:

- `http://` → `https://` и `www.dentalcruise.ru` → `dentalcruise.ru` (301), HSTS сохранить.
- Адрес без завершающего слеша → со слешем (`/pricelist` → `/pricelist/`): новая
  сборка отдаёт страницы папками, единый формат — со слешем.
- `/index.php` и `/index.html` → `/`.
- Параметры запроса при редиректе сохранять (utm-метки из старой рекламы).

## Настоящие страницы старого сайта

Эти адреса отдавали реальный контент (свой заголовок и текст) — редиректы
обязательны.

| Старый URL | Новый URL | Примечание |
|---|---|---|
| `/about/` | `/about/` | адрес совпадает; страница пока заглушка |
| `/about/doctors/` | `/doctors/` | |
| `/about/doctors/petizhev-ali-auesovich/` | `/doctors/ortoped/` | при переименовании слага на ФИО — обновить |
| `/about/doctors/shmidt-r-a/` | `/doctors/terapevt/` | |
| `/about/doctors/do-m/` | `/doctors/` | До Минь Фыонг: уточнить у клиники, работает ли; если да — завести карточку и вести на неё |
| `/contacts/` | `/contacts/` | адрес совпадает |
| `/pricelist/` | `/pricelist/` | адрес совпадает |
| `/policy/` | `/privacy/` | |
| `/soglasie-na-obrabotku-personalnykh-dannykh/` | `/privacy/` | пока нет отдельной страницы согласия |
| `/special/` | `/#promo` | |
| `/special/superaktsiya-vsemtsirkon/` | `/uslugi/cirkonievaya-koronka/` | акция на циркониевую коронку |
| `/special/tsirkonievaya-koronka-na-implante-vintovaya-fiksatsiya/` | `/uslugi/cirkonievaya-koronka-na-implante-vintovaya-fiksaciya/` | |
| `/koronka-na-zub/` | `/pricelist/#protezirovanie` | |
| `/koronka-na-zub/tsirkonievaya-koronka/` | `/uslugi/cirkonievaya-koronka/` | |
| `/koronka-na-zub/metallokeramichesckie_koronki/` | `/uslugi/metallokeramicheskie-koronki-metallokeramika-karkas-3d-slp/` | |
| `/koronka-na-zub/koronka-e-max/` | `/uslugi/keramicheskie-koronki-i-vkladki-e-max-koronka-vkladka-e-max/` | |
| `/viniry/` | `/pricelist/#restoration` | |
| `/viniry/viniry-e-max/` | `/uslugi/vinir-emax/` | |
| `/nesemnoe-protezirovanie/` | `/pricelist/#protezirovanie` | |
| `/nesemnoe-protezirovanie/all-on-4/` | `/uslugi/protezy-na-implantah-vse-na-4-implantah-osstem-nemedlennaya-nagruzka/` | |
| `/semnoe-protezirovanie/` | `/pricelist/#protezirovanie` | |
| `/semnoe-protezirovanie/byugelnoe-protezirovanie/` | `/uslugi/byugelnyy-protez-klammernyy/` | |
| `/semnoe-protezirovanie/protez-acry-free/` | `/uslugi/semnye-protezy-semnyy-protez-acry-free/` | |
| `/implantatsiya/` | `/uslugi/implantaciya-pod-klyuch/` | |
| `/implantatsiya/odnoetapnaya-implantatsiya/` | `/uslugi/implantaciya-pod-klyuch/` | |
| `/implantatsiya/sinus-lifting/` | `/uslugi/kostnaya-plastika-otkrytyy-sinus-lifting/` | |
| `/estetika-i-gigiena/otbelivanie-zubov/` | `/uslugi/otbelivanie-otbelivanie-zubov-belle/` | |
| `/stomatologiya-terapevticheskaya/` | `/pricelist/#terapiya` | |
| `/stomatologiya-terapevticheskaya/lechenie-kariesa/` | `/uslugi/lechenie-kariesa-i-vosstanovlenie-zuba-lechenie-srednego-kariesa/` | |
| `/stomatologiya-khirurgicheskaya/` | `/pricelist/#hirurgiya` | |

## Адреса из старого меню, которые уже отдают «Страница не найдена»

Битрикс отвечает на них кодом 200 с текстом «Страница не найдена» (мягкая
404), но ссылки на них есть в меню, и часть могла попасть в индекс. Редиректы
дешёвые — лучше поставить.

| Старый URL | Новый URL |
|---|---|
| `/semnoe-protezirovanie/semnyy-akrilovyy-protez/` | `/uslugi/semnye-protezy-akrilovyy-protez/` |
| `/semnoe-protezirovanie/syemnyy-neylonovyy-protez/` | `/uslugi/semnye-protezy-neylonovyy-protez/` |
| `/semnoe-protezirovanie/protez-kvadrotti-quattroti/` | `/uslugi/byugelnyy-protez-kvadrotti-quattro-ti/` |
| `/nesemnoe-protezirovanie/all-on-6/` | `/uslugi/protezy-na-implantah-vse-na-6-implantah-osstem-nemedlennaya-nagruzka/` |
| `/nesemnoe-protezirovanie/implanty-zubov/` | `/uslugi/implantaciya-pod-klyuch/` |
| `/nesemnoe-protezirovanie/keramicheskaya-vkladka-e-max/` | `/uslugi/keramicheskie-koronki-i-vkladki-e-max-koronka-vkladka-e-max/` |
| `/nesemnoe-protezirovanie/koronka-na-zub/` | `/pricelist/#protezirovanie` |
| `/nesemnoe-protezirovanie/viniry-na-zuby/` | `/pricelist/#restoration` |
| `/bezmetallovaya-keramika/koronka-na-implantate-e-max/` | `/uslugi/koronka-e-max-na-implante-vintovaya-fiksaciya/` |
| `/metallokeramika/metallokeramicheskaya-koronka-cocr/` | `/uslugi/metallokeramicheskie-koronki-metallokeramika-karkas-3d-slp/` |
| `/metallokeramika/metallokeramicheskaya-koronka-cocr-na-implantate/` | `/uslugi/metallokeramicheskaya-koronka-na-implante-vintovaya-fiksaciya/` |
| `/koronka-na-zub/vremennaya-koronka/` | `/uslugi/vremennaya-koronka-plastmassovaya/` |
| `/tselnotsirkonievaya-koronka/` | `/uslugi/cirkonievaya-koronka/` |
| `/vinir-e-max/` | `/uslugi/vinir-emax/` |
| `/viniry/tsirkoievye-viniry/` | `/uslugi/viniry-vinir-celnocirkonievyy/` |
| `/stomatologiya-terapevticheskaya/lechenie-pulpita/` | `/uslugi/lechenie-kanalov-endodontiya-pulpit-odnokanalnyy-zub/` |
| `/stomatologiya-terapevticheskaya/snyatie-ostroy-boli/` | `/uslugi/lechenie-kanalov-endodontiya-pomosch-pri-ostroy-boli/` |
| `/stomatologiya-khirurgicheskaya/udalenie-distopirovannogo-zuba/` | `/uslugi/udalenie-zubov-udalenie-zuba-slozhnoe/` |
| `/stomatologiya-khirurgicheskaya/udalenie-retinirovannogo-zuba/` | `/uslugi/udalenie-zubov-udalenie-zuba-slozhnoe/` |
| `/estetika-i-gigiena/chistka-air-flow/` | `/pricelist/#gigiena` |
| `/lechenie-zubov-v-rassrochku/lechenie-zubov-v-rassrochku/` | `/#terms` |

Услуги, которых на новом сайте нет (ортодонтия, пародонтология): если клиника
их не оказывает — отдавать `410 Gone`, а не редирект на главную (Яндекс
считает массовый редирект нерелевантных страниц на главную мягкой 404).

| Старый URL | Действие |
|---|---|
| `/ortodontiya/elaynery-/` | 410, либо `/pricelist/` если услуга появится |
| `/ortodontiya/ispravlenie-prikusa-bez-breketov/` | 410 |
| `/ortodontiya/ustanovka-breket-sistem/` | 410 |
| `/parodontologiya/lechenie-gingivita/` | 410, либо `/pricelist/#terapiya` |
| `/parodontologiya/lechenie-parodontita/` | 410, либо `/pricelist/#terapiya` |
| `/parodontologiya/lechenie-parodontoza/` | 410, либо `/pricelist/#terapiya` |

## Пример для Caddy

```caddyfile
dentalcruise.ru {
	# www и http → на канонический адрес обрабатываются отдельным блоком
	redir /koronka-na-zub/tsirkonievaya-koronka/ /uslugi/cirkonievaya-koronka/ permanent
	redir /koronka-na-zub/ /pricelist/#protezirovanie permanent
	# … остальные строки таблицы в том же виде
	redir /ortodontiya/* "" 410
}
```

Для nginx удобнее `map $request_uri $new_uri { … }` и один
`if ($new_uri) { return 301 $new_uri; }` в блоке `server`.

После переезда: добавить новый адрес в Вебмастер и Search Console, дождаться
переобхода, через 2–4 недели проверить в Вебмастере «Страницы в поиске» —
старые адреса должны исчезнуть, новые появиться.
