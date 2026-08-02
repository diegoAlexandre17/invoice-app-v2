import type { Company, Currency } from "@/features/company/domain/entities/Company";
import type { CompanyRepository } from "@/features/company/domain/repositories/CompanyRepository";
import { mapSupabaseError } from "@/shared/infrastructure/supabase/mapSupabaseError";
import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";

export class SupabaseCompanyRepository implements CompanyRepository {
  async getData(): Promise<Company | null> {
    const { data, error } = await supabase
      .from("company")
      .select("*")
      .maybeSingle();

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data) {
        return null
    }

    return {
        id: data.id,
        createdAt: data.created_at,
        name: data.name,
        identification: data.identification,
        address: data.address,
        phone: data.phone,
        email: data.email,
        logo: data.logo || null,
        currency: data.currency as Currency
    };
  }
}
