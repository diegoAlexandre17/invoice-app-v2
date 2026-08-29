/**
 * Convierte un Date a "YYYY-MM-DD" usando la fecha LOCAL (no UTC).
 *
 * Para columnas `date` de Postgres (sin hora). Usamos getFullYear/getMonth/
 * getDate en vez de toISOString() a propósito: toISOString() convierte a UTC, y
 * en husos negativos (ej. GMT-3) restaría un día — el usuario elige el 5 y se
 * guardaría el 4. Formateando en local, el día que eligió es el que se persiste.
 *
 * Función PURA: sin dependencias ni efectos.
 */
export const toISODateOnly = (date: Date): string => {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
