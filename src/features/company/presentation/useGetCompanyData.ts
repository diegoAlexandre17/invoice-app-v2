import type { Company } from "@/features/company/domain/entities/Company";
import { useQuery } from "@tanstack/react-query";
import { getCompanyDataUseCase } from "@/features/company/application/useCases/getCompanyDataUseCase";
import { companyRepositoryInstance } from "@/features/company/infrastructure/companyRepositoryInstance";

export const useGetCompanyData = () => {
  return useQuery<Company | null>({
    queryKey: ["company"],
    queryFn: () => getCompanyDataUseCase(companyRepositoryInstance),
  });
};
