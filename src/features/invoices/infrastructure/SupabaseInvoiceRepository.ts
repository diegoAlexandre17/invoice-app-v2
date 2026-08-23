import type {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  GetInvoicesParams,
} from "@/features/invoices/domain/entities/Invoice";
import type { InvoiceRepository } from "@/features/invoices/domain/repositories/InvoiceRepository";
import type { PaginatedResult } from "@/shared/domain/pagination";
import type { Json } from "@/shared/infrastructure/supabase/database.types";
import { mapSupabaseError } from "@/shared/infrastructure/supabase/mapSupabaseError";
import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";

/**
 * Mapea la columna jsonb `items` (tipada como Json, opaca) al InvoiceItem[]
 * del dominio. El cast vive ACÁ y solo acá: es el único lugar autorizado a
 * conocer la forma cruda de Supabase.
 */
const mapItems = (raw: Json): InvoiceItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw as unknown as InvoiceItem[];
};

/**
 * Serializa el InvoiceItem[] del dominio a Json para la columna jsonb.
 * Supabase acepta el array directamente; el cast lo alinea con el tipo Json.
 */
const serializeItems = (items: InvoiceItem[]): Json => {
  return items as unknown as Json;
};

export class SupabaseInvoiceRepository implements InvoiceRepository {
  async getAll(
    params?: GetInvoicesParams,
  ): Promise<PaginatedResult<Invoice>> {
    let query = supabase.from("invoices").select("*", { count: "exact" });

    if (params?.status) {
      query = query.eq("status", params.status);
    }

    const search = params?.search?.trim();
    if (search) {
      // Búsqueda por número de factura o nombre del cliente (snapshot).
      const term = search.replace(/,/g, "");
      query = query.or(
        `invoice_number.ilike.%${term}%,client_name.ilike.%${term}%`,
      );
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query
      .order("created_at", { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw mapSupabaseError(error);
    }

    const invoices: Invoice[] = (data ?? []).map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      clientIdentification: row.client_id_number,
      createdAt: row.created_at,
      invoiceNumber: row.invoice_number,
      status: row.status as InvoiceStatus,
      issueDate: row.issue_date,
      dueDate: row.due_date,
      paidAt: row.paid_at,
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone,
      clientAddress: row.client_address,
      items: mapItems(row.items),
      totalAmount: row.total_amount,
      notes: row.notes,
      pdfUrl: row.pdf_url,
    }));

    return {
      data: invoices,
      total: count ?? 0,
    };
  }

  async create(
    invoiceData: Omit<Invoice, "id" | "createdAt" | "paidAt" | "pdfUrl">,
  ): Promise<void> {
    // No mandamos user_id: la columna tiene DEFAULT auth.uid() y lo completa
    // Supabase con el usuario logueado (igual que las otras tablas).
    const { error } = await supabase.from("invoices").insert({
      invoice_number: invoiceData.invoiceNumber,
      customer_id: invoiceData.customerId,
      client_id_number: invoiceData.clientIdentification,
      status: invoiceData.status,
      issue_date: invoiceData.issueDate,
      due_date: invoiceData.dueDate,
      client_name: invoiceData.clientName,
      client_email: invoiceData.clientEmail,
      client_phone: invoiceData.clientPhone,
      client_address: invoiceData.clientAddress,
      items: serializeItems(invoiceData.items),
      total_amount: invoiceData.totalAmount,
      notes: invoiceData.notes,
    });

    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async updateStatus(
    invoiceId: number,
    status: InvoiceStatus,
  ): Promise<void> {
    // paid_at se setea solo cuando pasa a 'paid'; se limpia en otro caso.
    const paidAt = status === "paid" ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("invoices")
      .update({ status, paid_at: paidAt })
      .eq("id", invoiceId)
      .select();

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data || data.length === 0)
      throw new Error("errors.invoices.invoiceNotFound");
  }

  async delete(invoiceId: number): Promise<void> {
    const { data, error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId)
      .select();

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data || data.length === 0)
      throw new Error("errors.invoices.invoiceNotFound");
  }
}
