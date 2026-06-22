export interface ICustomers {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone?: string | null;
  identification?: string | null;
  address?: string | null;
}
