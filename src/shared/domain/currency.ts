/**
 * Moneda (código ISO 4217).
 *
 * Tipo transversal: NO pertenece a ninguna feature en particular. Lo usan tanto
 * `company` (la moneda configurada por el usuario) como `invoices` (la moneda
 * congelada al emitir la factura). Por eso vive en `shared/domain/` y no dentro
 * de una feature: una feature no debe depender del dominio de otra.
 *
 * Al agregar una moneda nueva acá, actualizá también el CHECK de las columnas
 * `currency` en Supabase (tablas company e invoices) y el mapa de símbolos.
 */
export type Currency = "USD" | "EUR";
