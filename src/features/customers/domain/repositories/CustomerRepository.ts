import type {
  Customer,
  GetCustomersParams,
} from "@/features/customers/domain/entities/Customer";

export interface CustomerRepository {
    getAll(params?: GetCustomersParams): Promise<Customer[]>;
    create(customerData: Omit<Customer, "id" | "createdAt">): Promise<void>;
    // editCustomer(customer: Customer): Promise<Customer>;
    // deleteCustomer(customerId: number): Promise<void>;
}