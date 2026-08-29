import type {
  Invoice,
  InvoiceStatus,
  GetInvoicesParams,
} from "@/features/invoices/domain/entities/Invoice";
import type { PaginatedResult } from "@/shared/domain/pagination";

/**
 * Contrato del repositorio de facturas.
 *
 * A diferencia de un CRUD genérico, expone operaciones con INTENCIÓN de
 * negocio. Una factura emitida no se "edita" libremente (es un documento):
 * se emite (create), se cambia su estado (updateStatus) o se elimina (delete).
 */
export interface InvoiceRepository {
  getAll(params?: GetInvoicesParams): Promise<PaginatedResult<Invoice>>;

  /**
   * Emite una factura nueva. Nace en estado 'sent'.
   * El id/createdAt/paidAt/pdfUrl los define el sistema, no el emisor.
   */
  create(
  invoiceData: Omit<Invoice, "id" | "createdAt" | "paidAt" | "pdfUrl">,
  pdfBlob: Blob,
): Promise<void>;

  /**
   * Cambia el estado (marcar 'paid' o 'cancelled').
   * Reemplaza al "edit" genérico: es la única mutación válida sobre una
   * factura ya emitida.
   */
  updateStatus(invoiceId: number, status: InvoiceStatus): Promise<void>;

  /** Borrado físico (para cargas erróneas). El flujo normal es cancelar. */
  delete(invoiceId: number): Promise<void>;
}
