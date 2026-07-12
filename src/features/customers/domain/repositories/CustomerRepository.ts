import type { Customer } from "@/features/customers/domain/entities/Customer";

export interface CustomerRepository {
    getAll(): Promise<Customer[]>;
    /* createCustomer(customer: Omit<Customer, "id" | "createdAt">): Promise<Customer>;
    editCustomer(customer: Customer): Promise<Customer>;
    deleteCustomer(customerId: number): Promise<void>; */
}