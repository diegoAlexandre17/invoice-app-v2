import type {
  Customer,
  GetCustomersParams,
} from "@/features/customers/domain/entities/Customer";
import type { PaginatedResult } from "@/shared/domain/pagination";

export interface CustomerRepository {
    getAll(params?: GetCustomersParams): Promise<PaginatedResult<Customer>>;
    create(customerData: Omit<Customer, "id" | "createdAt">): Promise<void>;
    edit(customerData: Omit<Customer, "createdAt">): Promise<void>;
    delete(customerId: number): Promise<void>;
}