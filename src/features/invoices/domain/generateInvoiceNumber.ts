/**
 * Genera el número de factura en el front, a partir del INSTANTE de generación
 * (fecha, hora, minutos y segundos en que se arma la factura), NO de la issueDate.
 *
 * Formato: FAC-<AÑO>-<AAAAMMDD-HHmmss> (ej. FAC-2026-20260822-143005).
 *
 * El reloj se INYECTA (`now`) para mantener la función pura y determinista: con el
 * mismo `now` devuelve siempre el mismo número. El default `new Date()` toma el
 * instante actual en el punto de llamada (capa de presentación), donde el efecto
 * colateral es aceptable; el dominio en sí no genera fechas por su cuenta.
 *
 * NOTA de negocio: esto es un timestamp legible, NO un correlativo secuencial.
 * Si algún día se necesita numeración legal consecutiva (FAC-2026-0001, 0002...),
 * hay que derivar el siguiente número del último emitido (fuente: backend), no acá.
 */
export const generateInvoiceNumber = (now: Date = new Date()): string => {
  const pad = (n: number): string => String(n).padStart(2, "0");

  const year = now.getFullYear();
  const stamp =
    `${year}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  return `FAC-${year}-${stamp}`;
};
