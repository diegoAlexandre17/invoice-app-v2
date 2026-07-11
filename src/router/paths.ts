const ADMIN = "/admin";
const AUTH = "/auth";

/** Segmentos relativos de cada vista (para children anidados del router). */
export const SEGMENTS = {
  dashboard: "dashboard",
  customers: "customers",
} as const;

/** Paths absolutos completos (para Link, navigate y el sidebar). */
export const PATHS = {
  admin: ADMIN,
  auth: AUTH,
  login: `${AUTH}/login`,
  resetPassword: `${AUTH}/reset-password`,
  recoveryPassword: `${AUTH}/recovery-password`,
  register: `${AUTH}/register`,
  dashboard: `${ADMIN}/${SEGMENTS.dashboard}`,
  customers: `${ADMIN}/${SEGMENTS.customers}`,
} as const;
