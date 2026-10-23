/**
 * Описание материала: что уходит в левую колонку, а что в карусель.
 * Короткое вводное (до 300 знаков) — подзаголовок слева; длинное остаётся
 * первым слайдом «Коротко». Преимущества и фото всегда слева.
 */
import type { CollectionEntry } from 'astro:content';

type About = CollectionEntry<'service-descriptions'>['data'];

export const SHORT_INTRO = 300;

export const isShortIntro = (about: About) =>
  about.intro.length > 0 && about.intro.join(' ').length <= SHORT_INTRO;

/** Есть ли что показать слева под заголовком */
export const hasAside = (about: About) =>
  isShortIntro(about) || about.images.length > 0 || about.benefits.length > 0;
