/**
 * Categoría de servicio/producto, definida por el usuario.
 *
 * Entidad pura del dominio: describe el NEGOCIO, no la fila de Supabase.
 * El mapeo de columnas (created_at -> createdAt) vive en el repositorio.
 */
export interface Category {
  id: number;
  createdAt: string;
  name: string;
}
