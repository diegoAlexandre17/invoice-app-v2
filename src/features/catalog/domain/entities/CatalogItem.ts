/**
 * Tipo de ítem del catálogo. Enum del dominio (fuente de verdad).
 * En la base se respalda con un CHECK (type IN ('product','service')).
 */
export type CatalogItemType = "product" | "service";

/**
 * Ítem del catálogo: un producto o un servicio reutilizable del usuario.
 *
 * Entidad pura del dominio. Describe el NEGOCIO, no la fila de Supabase.
 *
 * Nota sobre la categoría: la base guarda category_id (FK). La entidad lleva
 * AMBOS —categoryId (para editar) y categoryName (para mostrar)— porque el
 * repositorio resuelve el nombre con un JOIN a categories. Así la UI recibe
 * todo listo sin cruzar ids a mano.
 */
export interface CatalogItem {
  id: number;
  createdAt: string;
  type: CatalogItemType;
  name: string;
  categoryId: number;
  categoryName: string;
  price: number;
  description?: string | null;
}

/**
 * Parámetros de consulta para listar el catálogo.
 * Objeto (no argumentos sueltos) para extenderlo sin romper la firma.
 *
 * `type` es opcional: filtra por producto/servicio. Es el "¿qué querés
 * facturar?" que se reutiliza tanto en la gestión como al emitir una factura.
 */
export interface GetCatalogParams {
  search?: string;
  page?: number;
  pageSize?: number;
  type?: CatalogItemType;
}
