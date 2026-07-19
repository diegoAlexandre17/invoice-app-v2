import type { CustomerRepository } from "@/features/customers/domain/repositories/CustomerRepository"

export const deleteCustomerUseCase = (
    customerRepository: CustomerRepository,
    customerId: number
) : Promise<void> => {
    return customerRepository.delete(customerId)
}