import type {
  Customer,
  GetCustomersParams,
} from "@/features/customers/domain/entities/Customer";
import type { CustomerRepository } from "@/features/customers/domain/repositories/CustomerRepository";
import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";

export class SupabaseCustomerRepository implements CustomerRepository {
  async getAll(params?: GetCustomersParams): Promise<Customer[]> {
    let query = supabase.from("customers").select("*");

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

    const { data, error } = await query;

    if (error) {
      throw new Error(error?.message ?? "No se pudo traer los clientes");
    }

    return (data ?? []).map((customer) => ({
      id: customer.id,
      createdAt: customer.created_at,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      identification: customer.id_number,
      address: customer.address,
    }));
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
      throw new Error(error?.message ?? "No se pudo crear el cliente");
    }
  }
}
