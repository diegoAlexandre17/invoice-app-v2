/**
 * Estado del ciclo de vida de una factura.
 *
 * NO hay 'draft': en este negocio la factura nace emitida ('sent').
 * 'overdue' (vencida) NO es un estado guardado: se CALCULA
 * (status === 'sent' && dueDate < hoy). Ver isOverdue() más abajo.
 */
export type InvoiceStatus = "sent" | "paid" | "cancelled";

/**
 * Línea de factura (snapshot).
 *
 * Es un DOCUMENTO MUERTO: copia los datos en el momento de emitir y nunca
 * cambian, aunque después se edite el catálogo o se renombre la categoría.
 * Por eso guarda `categoryName` (el texto congelado), NO un categoryId (FK).
 * Contraste con CatalogItem, que sí usa FK porque es un template vivo.
 */
export interface InvoiceItem {
  description: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Factura.
 *
 * CONVENCIÓN DE NOMENCLATURA (importante — customer y client NO son sinónimos acá):
 *  - `customer*` (customerId) → REFERENCIA VIVA a la tabla customers (la FK).
 *    Apunta al cliente tal como está HOY. Puede quedar null.
 *  - `client*` (clientName, clientEmail, clientIdentification, ...) → SNAPSHOT
 *    congelado de los datos del cliente al momento de emitir. Nunca cambian.
 *  Regla mnemotécnica: customer = el vínculo vivo, client = la foto histórica.
 *
 * Los datos del cliente están APLANADOS (client*) como snapshot: la factura
 * congela al cliente tal como estaba al emitir. Si el cliente cambia su
 * dirección mañana, esta factura sigue mostrando la de hoy.
 *
 * customerId es la REFERENCIA VIVA al cliente (FK). Coexiste con el snapshot,
 * no lo reemplaza: sirve para NAVEGAR/FILTRAR ("dame las facturas del cliente X",
 * ej. pantalla CustomerDetails), nunca para leer sus datos. Los datos que se
 * muestran DENTRO de esta factura salen SIEMPRE del snapshot client_*, JAMÁS por
 * JOIN a customers: una factura vieja debe mostrar cómo estaba el cliente al
 * emitir, no cómo está hoy. Es `null` si el cliente fue borrado (ON DELETE SET NULL):
 * la factura sobrevive al cliente porque el snapshot es autosuficiente.
 *
 * Fechas:
 *  - createdAt: cuándo se creó la fila (técnico, lo pone la base).
 *  - issueDate: fecha legal de emisión (dato de negocio).
 *  - dueDate:   fecha límite de pago (dato de negocio).
 *  - paidAt:    cuándo se marcó pagada (null mientras no lo esté).
 */
export interface Invoice {
  id: number;
  createdAt: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidAt?: string | null;

  // Referencia viva al cliente (FK). null si el cliente fue borrado.
  customerId: number | null;

  // Snapshot del cliente (congelado al emitir)
  clientName: string;
  clientEmail: string;
  clientIdentification: string;
  clientPhone?: string | null;
  clientAddress?: string | null;

  items: InvoiceItem[];
  totalAmount: number;
  notes?: string | null;
  pdfUrl?: string | null;
}

/**
 * Parámetros de consulta para listar facturas.
 * `status` opcional: filtra por estado (ej. mostrar solo 'sent' pendientes).
 */
export interface GetInvoicesParams {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: InvoiceStatus;
}

/**
 * Regla de negocio PURA: ¿está vencida?
 *
 * Vive en el dominio (no en la base ni en la UI) porque es lógica de negocio.
 * 'overdue' se deriva, no se persiste: una factura 'sent' cuya dueDate ya pasó.
 * Las 'paid' y 'cancelled' nunca están vencidas.
 */
export const isOverdue = (
  invoice: Invoice,
  now: Date = new Date(),
): boolean => {
  if (invoice.status !== "sent") return false;
  return new Date(invoice.dueDate) < now;
};

export const calculateItemTotal = (
  quantity: number,
  unitPrice: number,
): number => {
  if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) {
    return 0;
  }
  return quantity * unitPrice;
};

export const calculateInvoiceTotal = (items: InvoiceItem[]): number => {
  return items.reduce(
    (sum, item) => sum + calculateItemTotal(item.quantity, item.unitPrice),
    0,
  );
};
