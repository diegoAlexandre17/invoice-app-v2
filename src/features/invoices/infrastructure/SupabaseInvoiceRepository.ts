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
  async getAll(params?: GetInvoicesParams): Promise<PaginatedResult<Invoice>> {
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
    query = query.order("created_at", { ascending: false }).range(from, to);

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
    pdfBlob: Blob,
  ): Promise<void> {
    // TODO (ejercicio): implementar la orquestación storage + insert.
    // Pasos a reconstruir:
    //   1. Obtener el userId de la sesión (supabase.auth.getUser). Guard si no hay.
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw new Error("errors.auth.notAuthenticated");
    }

    const userId = data.user.id;
    const pdfPath = `${userId}/${invoiceData.invoiceNumber}.pdf`;
    //   3. Subir el pdfBlob al bucket privado 'invoice-pdfs'. Manejar uploadError.
    const { error: uploadError } = await supabase.storage
      .from("invoice-pdfs")
      .upload(pdfPath, pdfBlob, {
        upsert: false,
        contentType: "application/pdf",
      });

    if (uploadError) {
      throw mapSupabaseError(uploadError);
    }

    //   4. Insertar la fila en 'invoices' mapeando dominio → columnas snake_case.
    //      Guardar el PATH en pdf_url (NO una signed URL: expira).
    const { error: insertInvoiceError } = await supabase.from("invoices").insert({
      client_name: invoiceData.clientName,
      client_email: invoiceData.clientEmail,
      client_phone: invoiceData.clientPhone,
      client_address: invoiceData.clientAddress,
      client_id_number: invoiceData.clientIdentification,
      items: serializeItems(invoiceData.items),
      notes: invoiceData.notes,
      invoice_number: invoiceData.invoiceNumber,
      issue_date: invoiceData.issueDate,
      due_date: invoiceData.dueDate,
      customer_id: invoiceData.customerId,
      pdf_url: pdfPath,
      total_amount: invoiceData.totalAmount,
      status: invoiceData.status
    });
    //   5. Rollback: si el insert falla, borrar el PDF ya subido (huérfano) y throw.
    if(insertInvoiceError){
      await supabase.storage.from("invoice-pdfs").remove([pdfPath])
      throw mapSupabaseError(insertInvoiceError);
    }

  }

  async updateStatus(invoiceId: number, status: InvoiceStatus): Promise<void> {
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
