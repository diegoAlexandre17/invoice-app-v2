import type { Company } from "@/features/company/domain/entities/Company";
import { useQuery } from "@tanstack/react-query";
import { getCompanyDataUseCase } from "@/features/company/application/useCases/getCompanyDataUseCase";
import { companyRepositoryInstance } from "@/features/company/infrastructure/companyRepositoryInstance";
import { companyKeys } from "@/features/company/presentation/companyKeys";

export const useGetCompanyData = () => {
  return useQuery<Company | null>({
    queryKey: companyKeys.all,
    queryFn: () => getCompanyDataUseCase(companyRepositoryInstance),
  });
};
