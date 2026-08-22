export interface Customer {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  phone?: string | null;
  identification: string;
  address?: string | null;
}

/**
 * Parámetros de consulta para listar clientes.
 * Objeto (no argumentos sueltos) para extenderlo sin romper la firma.
 */
export interface GetCustomersParams {
  search?: string;
  page?: number;
  pageSize?: number;
}