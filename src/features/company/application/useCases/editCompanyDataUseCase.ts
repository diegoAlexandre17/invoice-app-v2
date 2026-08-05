import type { Company } from "@/features/company/domain/entities/Company";
import type { CompanyRepository } from "@/features/company/domain/repositories/CompanyRepository";

export const editCompanyDataUseCase = (companyRepository: CompanyRepository, companyData: Omit<Company,"createdAt">): Promise<void> => {
    return companyRepository.edit(companyData)
}