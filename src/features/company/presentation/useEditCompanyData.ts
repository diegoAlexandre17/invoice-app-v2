import { editCompanyDataUseCase } from "@/features/company/application/useCases/editCompanyDataUseCase"
import type { Company } from "@/features/company/domain/entities/Company"
import { companyRepositoryInstance } from "@/features/company/infrastructure/companyRepositoryInstance"
import { useMutation } from "@tanstack/react-query"

export const useEditCompanyData = () =>{
    return useMutation({
        mutationFn: (companyData: Omit<Company,"createdAt">) => editCompanyDataUseCase(companyRepositoryInstance, companyData)
    })
}