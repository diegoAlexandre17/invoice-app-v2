import type {
  Customer,
  GetCustomersParams,
} from "@/features/customers/domain/entities/Customer";

export interface CustomerRepository {
    getAll(params?: GetCustomersParams): Promise<Customer[]>;
    create(customerData: Omit<Customer, "id" | "createdAt">): Promise<void>;
    edit(customerData: Omit<Customer, "createdAt">): Promise<void>;
    // deleteCustomer(customerId: number): Promise<void>;
}