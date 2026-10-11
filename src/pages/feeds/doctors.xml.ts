import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { clinic } from '../../data/site';
import { absolute, experienceYears, priceValue, siteRoot, xml } from '../../lib/seo';

/**
 * Фид «Врачи» для Яндекс Вебмастера (раздел «Медицина»).
 *
 * По нему Яндекс собирает карточки врачей в поиске и в Яндекс Услугах:
 * человек ищет «стоматолог-ортопед Полежаевская» и видит врача с ценой
 * и кнопкой записи, минуя рекламу. Это бесплатный канал, но подключается
 * он только после привязки домена в Вебмастере — на GitHub Pages файл
 * уже отдаётся, а включать его в Вебмастере имеет смысл после переезда.
 *
 * Правила Яндекса, от которых зависит структура ниже
 * (yandex.ru/support/webmaster/feed/snippets-doctors.html):
 *   • у каждого врача обязана быть отдельная страница — у нас /doctors/<id>;
 *   • отдельный оффер на каждую связку врач + клиника + услуга + специальность;
 *   • url оффера уникален для врача: одинаковый адрес допустим только у
 *     офферов одного врача — поэтому оффер ведёт на страницу врача, а не на
 *     страницу услуги (её ведут несколько врачей);
 *   • цена — `<price><base_price>N</base_price><currency>RUB</currency></price>`;
 *   • у `<shop>` обязателен `<picture>` — логотип не меньше 100×100, не SVG;
 *   • ровно одна базовая услуга (is_base_service) на каждую специальность
 *     врача; Яндекс советует первичный приём — у нас «Осмотр и консультация
 *     стоматолога» из раздела «Диагностика»;
 *   • специальность берётся из списка Яндекса, поэтому пишем её строчными.
 *
 * Услуга идёт в оффер со специальностью, только если относится к ней —
 * по разделу прайса (SPECIALITY_CATEGORIES). Иначе врач «терапевт, хирург»
 * получал бы удаление зуба как терапевт и лечение кариеса как хирург.
 *
 * ВАЖНО: перед подключением фида клиника обязана получить от врачей
 * письменное согласие на передачу их данных — это требование Яндекса.
 *
 * Источник данных — те же коллекции, что и сайт. Владелец правит врача
 * в редакторе, фид пересобирается сам при следующем деплое.
 */

/**
 * Какие разделы прайса (service-categories) ведёт специальность. Раздел
 * «Диагностика» — общий: осмотр и консультацию проводит врач любой
 * специальности. Специальность, которой здесь нет, получает все услуги
 * врача — сборка предупредит, чтобы её дописали.
 */
const COMMON_CATEGORIES = ['diagnostika'];
const SPECIALITY_CATEGORIES: Record<string, string[]> = {
  'стоматолог-терапевт': ['karies', 'endodontiya', 'gigiena'],
  'стоматолог-хирург': ['hirurgiya', 'implantacia'],
  'стоматолог-ортопед': ['protezirovanie', 'semnoe-protezirovanie', 'kappy'],
};

/** Логотип площадки: знак клиники 180×180 PNG (иконка для iPhone) */
const SHOP_PICTURE = 'apple-touch-icon.png';
/** Фото клиники для карточки клиники в фиде */
const CLINIC_PICTURE = 'images/clinic/clinic-01.jpg';

export const GET: APIRoute = async ({ site }) => {
  const doctors = (await getCollection('doctors')).sort((a, b) => a.data.order - b.data.order);
  const servicePages = await getCollection('service-pages');

  /** Услуги, которые попали хотя бы в один оффер, — для блока <services>. */
  const usedServices = new Map<string, string>();

  /**
   * Специальности врача списком: в поле `speciality` их может быть
   * несколько через запятую, а Яндексу нужна одна на оффер.
   */
  const specialitiesOf = (value: string) =>
    value
      .toLowerCase()
      .split(/\s*,\s*/)
      .map((s) => s.trim())
      .filter(Boolean);

  const offers: string[] = [];
  let offerNo = 0;

  for (const doctor of doctors) {
    const pages = doctor.data.services
      .map((slug) => servicePages.find((p) => p.id === slug))
      .filter((page): page is (typeof servicePages)[number] => !!page);
    const doctorUrl = absolute(`doctors/${doctor.id}`, site);

    for (const speciality of specialitiesOf(doctor.data.speciality)) {
      const own = SPECIALITY_CATEGORIES[speciality];
      if (!own) {
        console.warn(
          `[фид врачей] Специальность «${speciality}» (${doctor.data.name}) не описана в SPECIALITY_CATEGORIES — ` +
            'в фид идут все услуги врача. Допишите, какие разделы прайса она ведёт.',
        );
      }
      const matching = own
        ? pages.filter((page) => [...COMMON_CATEGORIES, ...own].includes(page.data.category))
        : pages;
      if (matching.length === 0) {
        console.warn(`[фид врачей] У врача ${doctor.data.name} нет услуг для специальности «${speciality}» — офферов нет.`);
        continue;
      }
      // Базовая — первичный приём (первая услуга из «Диагностики»), а если
      // её у врача нет — первая услуга специальности. Ровно одна на специальность.
      const base = matching.find((page) => COMMON_CATEGORIES.includes(page.data.category)) ?? matching[0];
      const ordered = [base, ...matching.filter((page) => page !== base)];

      for (const page of ordered) {
        offerNo += 1;
        usedServices.set(page.id, page.data.title);
        const price = priceValue(page.data.price);
        const free = !price && /бесплатн/i.test(page.data.price ?? '');
        offers.push(
          [
            `    <offer id="offer_${offerNo}">`,
            `      <url>${xml(doctorUrl)}</url>`,
            `      <appointment>true</appointment>`,
            // «Бесплатно» — нулевая цена с пометкой free_appointment, её Яндекс
            // показывает как бесплатный приём. «По запросу» — без цены:
            // выдумывать сумму нельзя
            price || free ? `      <price>` : null,
            price || free ? `        <base_price>${price || 0}</base_price>` : null,
            price || free ? `        <currency>RUB</currency>` : null,
            free ? `        <free_appointment>${xml(page.data.price ?? '')}</free_appointment>` : null,
            price || free ? `      </price>` : null,
            `      <service id="${xml(page.id)}"/>`,
            `      <clinic id="clinic_1">`,
            `        <doctor id="${xml(doctor.id)}">`,
            `          <speciality>${xml(speciality)}</speciality>`,
            `          <is_base_service>${page === base}</is_base_service>`,
            `        </doctor>`,
            `      </clinic>`,
            `    </offer>`,
          ]
            .filter(Boolean)
            .join('\n'),
        );
      }
    }
  }

  const doctorNodes = doctors.map((doctor) => {
    const years = experienceYears(doctor.data.experience);
    // «О враче» с личной страницы, а если пусто — короткий факт из карточки
    const description = (doctor.data.about.length > 0 ? doctor.data.about.join(' ') : doctor.data.note)
      .replace(/\s+/g, ' ')
      .trim();
    return [
      `    <doctor id="${xml(doctor.id)}">`,
      `      <name>${xml(doctor.data.name)}</name>`,
      `      <url>${xml(absolute(`doctors/${doctor.id}`, site))}</url>`,
      description ? `      <description>${xml(description)}</description>` : null,
      years ? `      <experience_years>${years}</experience_years>` : null,
      // Фото врача — вертикальное, не меньше 210×210 (требование Яндекса; у нас 900×1200)
      doctor.data.photo ? `      <picture>${xml(absolute(doctor.data.photo, site))}</picture>` : null,
      `    </doctor>`,
    ]
      .filter(Boolean)
      .join('\n');
  });

  const serviceNodes = [...usedServices.entries()].map(
    ([slug, title]) => `    <service id="${xml(slug)}">\n      <name>${xml(title)}</name>\n    </service>`,
  );

  const body = `<?xml version="1.0" encoding="utf-8"?>
<shop version="2.0" date="${new Date().toISOString().slice(0, 19)}">
  <name>${xml(clinic.name)}</name>
  <company>${xml(clinic.legalName)}</company>
  <url>${xml(siteRoot(site))}</url>
  <picture>${xml(absolute(SHOP_PICTURE, site))}</picture>
  <email>${xml(clinic.email)}</email>
  <doctors>
${doctorNodes.join('\n')}
  </doctors>
  <clinics>
    <clinic id="clinic_1">
      <url>${xml(siteRoot(site))}</url>
      <picture>${xml(absolute(CLINIC_PICTURE, site))}</picture>
      <name>${xml(clinic.name)}</name>
      <address>${xml(clinic.address.street)}</address>
      <city>${xml(clinic.address.locality)}</city>
      <email>${xml(clinic.email)}</email>
      <phone>${xml(clinic.phoneE164)}</phone>
    </clinic>
  </clinics>
  <services>
${serviceNodes.join('\n')}
  </services>
  <offers>
${offers.join('\n')}
  </offers>
</shop>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
