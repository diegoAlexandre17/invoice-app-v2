import type { Category } from "@/features/categories/domain/entities/Category";

/**
 * Contrato del repositorio de categorías.
 *
 * La capa de aplicación depende de ESTA interfaz, nunca de la implementación
 * concreta (SupabaseCategoryRepository). Eso es lo que permite reemplazar el
 * backend sin tocar los casos de uso ni la UI.
 */
export interface CategoryRepository {
  /**
   * Devuelve TODAS las categorías del usuario (sin paginar).
   * Van a un combobox que filtra localmente, así que se necesita la lista
   * completa.
   */
  getAll(): Promise<Category[]>;

  /**
   * Crea una categoría y DEVUELVE la creada (con su id).
   * Se devuelve la entidad —y no void— para el flujo "create-on-the-fly":
   * al crear una categoría desde el combobox, el formulario la selecciona al
   * instante sin recargar la lista.
   */
  create(categoryData: Omit<Category, "id" | "createdAt">): Promise<Category>;
}
