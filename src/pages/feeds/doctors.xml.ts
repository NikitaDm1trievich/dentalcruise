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
 * Правила Яндекса, от которых зависит структура ниже:
 *   • у каждого врача обязана быть отдельная страница — у нас /doctors/<id>;
 *   • отдельный оффер на каждую связку врач + клиника + услуга + специальность;
 *   • ровно одна базовая услуга (is_base_service) на каждую специальность врача;
 *   • специальность берётся из списка Яндекса, поэтому пишем её строчными.
 *
 * ВАЖНО: перед подключением фида клиника обязана получить от врачей
 * письменное согласие на передачу их данных — это требование Яндекса.
 *
 * Источник данных — те же коллекции, что и сайт. Владелец правит врача
 * в редакторе, фид пересобирается сам при следующем деплое.
 */
export const GET: APIRoute = async ({ site }) => {
  const doctors = (await getCollection('doctors')).sort((a, b) => a.data.order - b.data.order);
  const servicePages = await getCollection('service-pages');

  /** Услуги, которые реально привязаны хотя бы к одному врачу. */
  const usedServices = new Map<string, { title: string; price?: string }>();
  for (const doctor of doctors) {
    for (const slug of doctor.data.services) {
      const page = servicePages.find((p) => p.id === slug);
      if (page && !usedServices.has(slug)) {
        usedServices.set(slug, { title: page.data.title, price: page.data.price });
      }
    }
  }

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
      .filter(Boolean) as Awaited<ReturnType<typeof getCollection<'service-pages'>>>;

    for (const speciality of specialitiesOf(doctor.data.speciality)) {
      pages.forEach((page, index) => {
        offerNo += 1;
        const price = priceValue(page.data.price);
        offers.push(
          [
            `    <offer id="offer_${offerNo}">`,
            `      <url>${xml(absolute(`uslugi/${page.id}`, site))}</url>`,
            `      <appointment>true</appointment>`,
            price ? `      <price>${price}</price>` : null,
            price ? `      <currencyId>RUB</currencyId>` : null,
            `      <service id="${xml(page.id)}"/>`,
            `      <clinic id="clinic_1">`,
            `        <doctor id="${xml(doctor.id)}">`,
            `          <speciality>${xml(speciality)}</speciality>`,
            // Первая услуга в списке врача — базовая для этой специальности:
            // Яндекс требует ровно одну такую, иначе фид не принимается.
            `          <is_base_service>${index === 0}</is_base_service>`,
            `        </doctor>`,
            `      </clinic>`,
            `    </offer>`,
          ]
            .filter(Boolean)
            .join('\n'),
        );
      });
    }
  }

  const doctorNodes = doctors.map((doctor) => {
    const years = experienceYears(doctor.data.experience);
    return [
      `    <doctor id="${xml(doctor.id)}">`,
      `      <name>${xml(doctor.data.name)}</name>`,
      `      <url>${xml(absolute(`doctors/${doctor.id}`, site))}</url>`,
      years ? `      <experience_years>${years}</experience_years>` : null,
      `    </doctor>`,
    ]
      .filter(Boolean)
      .join('\n');
  });

  const serviceNodes = [...usedServices.entries()].map(
    ([slug, service]) =>
      `    <service id="${xml(slug)}">\n      <name>${xml(service.title)}</name>\n    </service>`,
  );

  const body = `<?xml version="1.0" encoding="utf-8"?>
<shop version="2.0" date="${new Date().toISOString().slice(0, 19)}">
  <name>${xml(clinic.name)}</name>
  <company>${xml(clinic.legalName)}</company>
  <url>${xml(siteRoot(site))}</url>
  <email>${xml(clinic.email)}</email>
  <doctors>
${doctorNodes.join('\n')}
  </doctors>
  <clinics>
    <clinic id="clinic_1">
      <name>${xml(clinic.name)}</name>
      <address>${xml(clinic.address.street)}</address>
      <city>${xml(clinic.address.locality)}</city>
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
