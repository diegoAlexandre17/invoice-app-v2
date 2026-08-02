import type { Company } from "@/features/company/domain/entities/Company";
import type { CompanyRepository } from "@/features/company/domain/repositories/CompanyRepository";

export const editCompanyDataUseCase = (companyReposity: CompanyRepository, companyData: Omit<Company,"createdAt">): Promise<void> => {
    return companyReposity.edit(companyData)
}