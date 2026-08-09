import type {
  CatalogItem,
  GetCatalogParams,
} from "@/features/catalog/domain/entities/CatalogItem";
import type { PaginatedResult } from "@/shared/domain/pagination";

/**
 * Contrato del repositorio del catálogo.
 *
 * La capa de aplicación depende de ESTA interfaz, nunca de la implementación
 * concreta. Permite cambiar de backend sin tocar casos de uso ni UI.
 *
 * Nota sobre create/edit: el Omit quita `categoryName` además de id/createdAt,
 * porque al escribir se manda el `categoryId` (la FK que persiste); el
 * `categoryName` solo existe en lectura (viene del JOIN). Escribís id, leés
 * nombre.
 */
export interface CatalogRepository {
  getAll(params?: GetCatalogParams): Promise<PaginatedResult<CatalogItem>>;
  create(
    itemData: Omit<CatalogItem, "id" | "createdAt" | "categoryName">,
  ): Promise<void>;
  edit(
    itemData: Omit<CatalogItem, "createdAt" | "categoryName">,
  ): Promise<void>;
  delete(itemId: number): Promise<void>;
}
