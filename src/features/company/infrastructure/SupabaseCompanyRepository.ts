import type {
  Company,
} from "@/features/company/domain/entities/Company";
import type { CompanyRepository } from "@/features/company/domain/repositories/CompanyRepository";
import type { Currency } from "@/shared/domain/currency";
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
    const { error } = await supabase
      .from("company")
      .update({
        name: companyData.name,
        identification: companyData.identification,
        address: companyData.address,
        phone: companyData.phone,
        email: companyData.email,
        logo: companyData.logo,
        currency: companyData.currency,
      })
      .eq("id", companyData.id);

    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async uploadLogo(file: File, userId: string): Promise<string> {
    // Path fijo por usuario, SIN extensión → upsert siempre sobrescribe el mismo archivo.
    const path = `${userId}/logo`;

    const { error: uploadError } = await supabase.storage
      .from("company-logos")
      .upload(path, file, {
        upsert: true,
        contentType: file.type, // preserva el MIME real (image/png, image/jpeg...)
      });

    if (uploadError) {
      throw mapSupabaseError(uploadError);
    }

    const { data } = supabase.storage.from("company-logos").getPublicUrl(path);

    // Cache-buster: como el path es fijo, sin esto el navegador mostraría el logo viejo cacheado.
    // El timestamp cambia en cada subida → el navegador trata cada logo nuevo como URL distinta.
    return `${data.publicUrl}?t=${Date.now()}`;
  }
}
