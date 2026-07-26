import type { ParseKeys } from "i18next";

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



const ERROR_KEYS: Record<string, ParseKeys> = {
  /* AUTH ERRORS */
  invalid_credentials: "errors.auth.invalidCredentials",
  user_already_exists: "errors.auth.userAlreadyExists",
  over_request_rate_limit: "errors.auth.overRequestRateLimit",
  /* BBDD ERRORS */
  customers_email_key: "errors.customers.emailHasBeenUsed",
};

export const mapSupabaseError = (error: unknown): Error => {
  const message = (error as { message?: string })?.message ?? "";
 
  const code = (error as {code?: string})?.code ?? "";

  if(code && ERROR_KEYS[code]){
    return new Error(ERROR_KEYS[code])
  }

  const match = Object.keys(ERROR_KEYS).find((constraint) =>
    message.includes(constraint),
  );

  if (match) {
    return new Error(ERROR_KEYS[match]);
  }

  console.error(error);
  return new Error("common.commonError");
};
