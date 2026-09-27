// Facturación agregada de UN mes. Entidad de agregación para la gráfica
// de facturación mensual. Cada instancia representa un mes calendario.
export interface MonthlyBilling {
  // Inicio del mes en ISO "yyyy-MM-dd" (ej. "2026-07-01"). Dato puro:
  // el formato de display ("jul 2026") lo decide la view según el idioma.
  month: string;
  // Total facturado en ese mes (sent + paid, sin canceladas).
  amount: number;
}

// Params para pedir la facturación mensual. 'today' obligatorio: define
// hasta qué mes va la ventana (lo inyecta el hook, como en el summary).
export interface GetMonthlyBillingParams {
  today: string; // "yyyy-MM-dd"
}