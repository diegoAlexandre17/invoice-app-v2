export type Currency = "USD" | "EUR";

export interface Company {
  id: number;
  createdAt: string;
  name: string;
  identification: string;
  address: string;
  phone: string;
  email: string;
  logo: string | null; 
  currency: Currency;
}
