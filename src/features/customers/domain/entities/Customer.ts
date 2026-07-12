export interface Customer {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  phone?: string | null;
  identification?: string | null;
  address?: string | null;
}
