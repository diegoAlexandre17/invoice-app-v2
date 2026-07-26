/**
 * Traduce un error crudo de Supabase/Postgres a un Error cuyo `message` es
 * una clave de traducción (i18n).
 *
 * Es el único lugar que conoce los códigos/constraints de Postgres: así el
 * "23505" nunca se filtra a la capa de UI. La presentación solo hace
 * `t(error.message)`.
 *
 * Para agregar un error nuevo (ej: en invoices), sumá una línea al mapa.
 */
const ERROR_KEYS: Record<string, string> = {
  // El message de Postgres incluye el nombre del constraint violado.
  customers_email_key: "errorsForm.customers.emailHasBeenUsed",
};

export const mapSupabaseError = (error: unknown): Error => {
  const message = (error as { message?: string })?.message ?? "";

  const match = Object.keys(ERROR_KEYS).find((constraint) =>
    message.includes(constraint),
  );

  if (match) {
    return new Error(ERROR_KEYS[match]);
  }

  console.error(error);
  return new Error("common.commonError");
};
