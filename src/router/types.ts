import type { ParseKeys } from "i18next";

/**
 * Forma del `handle` que una ruta declara para aparecer en las migas de pan.
 * `crumb` es la KEY de traducción (no el texto). El componente Breadcrumbs la
 * traduce con su propio t().
 */
export type CrumbHandle = {
  crumb: ParseKeys;
};

/**
 * Helper para declarar el handle de una ruta de forma corta y validada.
 * Centraliza la forma del handle: si mañana suma props, se cambia solo acá.
 *
 * Uso en una ruta: `handle: crumb("navigation.dashboard")`
 */
export const crumb = (key: ParseKeys): CrumbHandle => ({ crumb: key });
