import type { Category } from "@/features/categories/domain/entities/Category";
import type { CategoryRepository } from "@/features/categories/domain/repositories/CategoryRepository";
import { mapSupabaseError } from "@/shared/infrastructure/supabase/mapSupabaseError";
import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";

export class SupabaseCategoryRepository implements CategoryRepository {
  async getAll(): Promise<Category[]> {
    // RLS ya filtra por usuario: el select va "pelado", sin .eq("user_id").
    // Orden alfabético por name: es lo natural para un combobox.
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw mapSupabaseError(error);
    }

    // Mapeo fila de Supabase -> entidad del dominio (created_at -> createdAt).
    return (data ?? []).map((category) => ({
      id: category.id,
      createdAt: category.created_at,
      name: category.name,
    }));
  }

  async create(
    categoryData: Omit<Category, "id" | "createdAt">,
  ): Promise<Category> {
    // No mandamos user_id: la columna tiene DEFAULT auth.uid() y lo completa
    // Supabase con el usuario logueado.
    // .select().single() devuelve la fila insertada para poder mapearla de
    // vuelta a Category (necesitamos el id para el flujo del combobox).
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: categoryData.name })
      .select()
      .single();

    if (error) {
      throw mapSupabaseError(error);
    }

    return {
      id: data.id,
      createdAt: data.created_at,
      name: data.name,
    };
  }
}
