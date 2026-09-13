import type { InvoiceStatus } from "@/features/invoices/domain/entities/Invoice";

// Resumen agregado de facturas para KPIs y gráficas.

// Montos para los KPI cards, conteos para el donut de estados.
export interface InvoiceSummary {
  // Montos (KPI cards)
  totalPaid: number;
  pendingAmount: number;
  overdueAmount: number;
  invoiceCount: number;

  // Conteos por estado (donut)
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

// Params opcionales para filtrar el resumen.
// Reflejan los filtros de la tabla de facturas para que KPIs y donut
// reaccionen al mismo recorte. 'today' es obligatorio: define el corte
// de vencimiento (lo calcula el front para paridad con la tabla).
export interface GetInvoiceSummaryParams {
  today: string; // "yyyy-MM-dd"
  status?: InvoiceStatus;
  dateFrom?: string; // "yyyy-MM-dd", filtra por issueDate
  dateTo?: string; // "yyyy-MM-dd", filtra por issueDate
}
