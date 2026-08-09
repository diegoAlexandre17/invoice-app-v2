import type {
  CatalogItem,
  CatalogItemType,
  GetCatalogParams,
} from "@/features/catalog/domain/entities/CatalogItem";
import type { CatalogRepository } from "@/features/catalog/domain/repositories/CatalogRepository";
import type { PaginatedResult } from "@/shared/domain/pagination";
import { mapSupabaseError } from "@/shared/infrastructure/supabase/mapSupabaseError";
import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";

/**
 * Forma cruda de una fila de catalog con la categoría embebida por el JOIN.
 * Supabase devuelve la relación anidada como objeto (o null si no matchea).
 */
interface CatalogRow {
  id: number;
  created_at: string;
  type: string;
  name: string;
  category_id: number;
  price: number;
  description: string | null;
  categories: { name: string } | null;
}

export class SupabaseCatalogRepository implements CatalogRepository {
  async getAll(
    params?: GetCatalogParams,
  ): Promise<PaginatedResult<CatalogItem>> {
    // JOIN vía embedding: `categories(name)` trae el nombre de la categoría
    // relacionada en el mismo query (sin N+1). count: "exact" da el total.
    let query = supabase
      .from("catalog")
      .select("*, categories(name)", { count: "exact" });

    // Filtro por tipo: es el "¿productos o servicios?".
    if (params?.type) {
      query = query.eq("type", params.type);
    }

    const search = params?.search?.trim();
    if (search) {
      // %term% = "contiene", case-insensitive. Se quitan comas porque `or`
      // las usa como separador de filtros.
      const term = search.replace(/,/g, "");
      query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
    }

    // Paginación 0-based e inclusiva: página 1 pageSize 10 → range(0, 9).
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

    // El JOIN llega como `categories: { name }`. Se desanida a categoryName.
    const items: CatalogItem[] = ((data ?? []) as CatalogRow[]).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      type: row.type as CatalogItemType,
      name: row.name,
      categoryId: row.category_id,
      categoryName: row.categories?.name ?? "",
      price: row.price,
      description: row.description,
    }));

    return {
      data: items,
      total: count ?? 0,
    };
  }

  async create(
    itemData: Omit<CatalogItem, "id" | "createdAt" | "categoryName">,
  ): Promise<void> {
    // Se guarda category_id (la FK), no el nombre. user_id lo pone el DEFAULT.
    const { error } = await supabase.from("catalog").insert({
      type: itemData.type,
      name: itemData.name,
      category_id: itemData.categoryId,
      price: itemData.price,
      description: itemData.description,
    });

    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async edit(
    itemData: Omit<CatalogItem, "createdAt" | "categoryName">,
  ): Promise<void> {
    const { data, error } = await supabase
      .from("catalog")
      .update({
        type: itemData.type,
        name: itemData.name,
        category_id: itemData.categoryId,
        price: itemData.price,
        description: itemData.description,
      })
      .eq("id", itemData.id)
      .select();

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data || data.length === 0)
      throw new Error("errors.catalog.itemNotFound");
  }

  async delete(itemId: number): Promise<void> {
    const { data, error } = await supabase
      .from("catalog")
      .delete()
      .eq("id", itemId)
      .select();

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data || data.length === 0)
      throw new Error("errors.catalog.itemNotFound");
  }
}
