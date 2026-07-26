import type {
  Customer,
  GetCustomersParams,
} from "@/features/customers/domain/entities/Customer";
import type { CustomerRepository } from "@/features/customers/domain/repositories/CustomerRepository";
import type { PaginatedResult } from "@/shared/domain/pagination";
import { mapSupabaseError } from "@/shared/infrastructure/supabase/mapSupabaseError";
import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";

export class SupabaseCustomerRepository implements CustomerRepository {
  async getAll(
    params?: GetCustomersParams,
  ): Promise<PaginatedResult<Customer>> {
    // count: "exact" → Supabase devuelve el total de filas que matchean el
    // filtro, aparte de los datos de la página. Es lo que nos deja saber
    // cuántas páginas dibujar sin traer todos los registros.
    let query = supabase.from("customers").select("*", { count: "exact" });

    const search = params?.search?.trim();
    if (search) {
      // Búsqueda server-side, case-insensitive, en varias columnas.
      // %term% = "contiene". Supabase escapa el valor, pero evitamos
      // comas en el patrón porque `or` las usa como separador de filtros.
      const term = search.replace(/,/g, "");
      query = query.or(
        `name.ilike.%${term}%,email.ilike.%${term}%,id_number.ilike.%${term}%`,
      );
    }

    // Paginación: .range(from, to) es 0-based e inclusivo.
    // Página 1, pageSize 10 → range(0, 9); página 2 → range(10, 19).
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw mapSupabaseError(error);
    }

    const customers: Customer[] = (data ?? []).map((customer) => ({
      id: customer.id,
      createdAt: customer.created_at,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      identification: customer.id_number,
      address: customer.address,
    }));

    return {
      data: customers,
      total: count ?? 0,
    };
  }

  async create(
    customerData: Omit<Customer, "id" | "createdAt">,
  ): Promise<void> {
    const { error } = await supabase.from("customers").insert({
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      id_number: customerData.identification,
      address: customerData.address,
    });

    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async edit(customerData: Omit<Customer, "createdAt">): Promise<void> {
    const { data, error } = await supabase
      .from("customers")
      .update({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        id_number: customerData.identification,
        address: customerData.address,
      })
      .eq("id", customerData.id)
      .select();

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data || data.length === 0)
      throw new Error("errorsForm.customers.customerNotFound");
  }

  async delete(customerId: number): Promise<void> {
    const { data, error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId)
      .select();

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data || data.length === 0)
      throw new Error("errorsForm.customers.customerNotFound");
  }
}
