import type { CompanyRepository } from "@/features/company/domain/repositories/CompanyRepository";

export const uploadCompanyLogoUseCase = (
  companyRepository: CompanyRepository,
  file: File,
  userId: string
): Promise<string> => {
  return companyRepository.uploadLogo(file, userId);
};