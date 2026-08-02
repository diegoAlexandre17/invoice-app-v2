import type { Company } from "@/features/company/domain/entities/Company";
import type { CompanyRepository } from "@/features/company/domain/repositories/CompanyRepository";

export const getCompanyDataUseCase = (
  companyRepository: CompanyRepository,
): Promise<Company | null> => {
  return companyRepository.getData();
};