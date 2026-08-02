import type {
  Company,
  Currency,
} from "@/features/company/domain/entities/Company";
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
      return null;
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
      currency: data.currency as Currency,
    };
  }

  async edit(companyData: Omit<Company, "createdAt">): Promise<void> {
    const { error } = await supabase.from("company").update({
      name: companyData.name,
      identification: companyData.identification,
      address: companyData.address,
      phone: companyData.phone,
      email: companyData.email,
      logo: companyData.logo,
      currency: companyData.currency,
    }).eq("id", companyData.id);

    if (error) {
      throw mapSupabaseError(error);
    }
  }
}
