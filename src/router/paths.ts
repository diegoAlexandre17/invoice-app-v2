const ADMIN = "/admin";

/** Segmentos relativos de cada vista (para children anidados del router). */
export const SEGMENTS = {
  dashboard: "dashboard",
  customers: "customers",
} as const;

/** Paths absolutos completos (para Link, navigate y el sidebar). */
export const PATHS = {
  admin: ADMIN,
  dashboard: `${ADMIN}/${SEGMENTS.dashboard}`,
  customers: `${ADMIN}/${SEGMENTS.customers}`,
} as const;
