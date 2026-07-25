/**
 * Resultado paginado genérico.
 * `data`  → los registros de la página actual.
 * `total` → cantidad TOTAL de registros (sin paginar), para calcular páginas.
 *
 * Es genérico a propósito: sirve para clientes, facturas, productos, etc.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
}
