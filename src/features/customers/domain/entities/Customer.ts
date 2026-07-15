export interface Customer {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  phone?: string | null;
  identification?: string | null;
  address?: string | null;
}

/**
 * Parámetros de consulta para listar clientes.
 * Objeto (no argumentos sueltos) para extenderlo sin romper la firma:
 * cuando se agregue paginación entran aquí `page` y `pageSize`.
 */
export interface GetCustomersParams {
  search?: string;
  // page?: number;
  // pageSize?: number;
}
