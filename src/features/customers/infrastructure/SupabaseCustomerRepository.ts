import type { Customer } from "@/features/customers/domain/entities/Customer";
import type { CustomerRepository } from "@/features/customers/domain/repositories/CustomerRepository";
import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";

export class SupabaseCustomerRepository implements CustomerRepository {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase.from("customers").select("*");

    if (error) {
      throw new Error(error?.message ?? "No se pudo traer los clientes");
    }

    return (data ?? []).map((customer) => ({
      id: customer.id,
      createdAt: customer.created_at,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      identification: customer.identification,
      address: customer.address,
    }));
  }
}
