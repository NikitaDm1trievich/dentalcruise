/**
 * Данные графика «Своя лаборатория — своя цена».
 *
 * Рыночный ряд взят из вашего анализа рынка (артефакт «Динамика цены E-max»,
 * средняя цена коронки E-max «под ключ» по Москве, 2026).
 *
 * ВАЖНО про честность цифр. У рынка стоматологии нет открытого архива цен
 * по месяцам: клиники и агрегаторы публикуют только текущий прайс. Реально
 * измеренная точка одна — сентябрь 2026 (≈51 700 ₽, среднее по открытым
 * прайсам). Остальные месяцы — расчёт по данным Росстата об индексе цен на
 * стоматологические услуги, октябрь–декабрь — прогноз. Поэтому под графиком
 * на сайте стоит сноска с методикой: выдавать модель за замеры нельзя.
 *
 * Наша цена — из прайса клиники: коронка E-max 25 000 ₽, в течение года
 * не менялась.
 */

export type PriceChartPoint = {
  month: string;
  market: number;
  clinic: number;
  /** true — прогноз, а не расчёт от факта */
  forecast: boolean;
};

export const priceChart = {
  title: 'Коронка E-max, за единицу',
  marketLabel: 'В среднем по Москве',
  clinicLabel: 'Дентал Круиз',
  /** Единственная фактически измеренная точка рыночного ряда */
  anchorMonth: 'Сен',
  note: 'Рыночный ряд — расчёт по индексу цен Росстата на стоматологические услуги; фактический замер один: сентябрь 2026 года, среднее по открытым прайсам московских клиник (октябрь–декабрь — прогноз). Наша цена взята из прайса клиники.',
  data: [
    { month: 'Янв', market: 49700, clinic: 25000, forecast: false },
    { month: 'Фев', market: 50000, clinic: 25000, forecast: false },
    { month: 'Мар', market: 50300, clinic: 25000, forecast: false },
    { month: 'Апр', market: 50600, clinic: 25000, forecast: false },
    { month: 'Май', market: 50800, clinic: 25000, forecast: false },
    { month: 'Июн', market: 51000, clinic: 25000, forecast: false },
    { month: 'Июл', market: 51100, clinic: 25000, forecast: false },
    { month: 'Авг', market: 51300, clinic: 25000, forecast: false },
    { month: 'Сен', market: 51700, clinic: 25000, forecast: false },
    { month: 'Окт', market: 52200, clinic: 25000, forecast: true },
    { month: 'Ноя', market: 52500, clinic: 25000, forecast: true },
    { month: 'Дек', market: 53100, clinic: 25000, forecast: true },
  ] satisfies PriceChartPoint[],
} as const;
