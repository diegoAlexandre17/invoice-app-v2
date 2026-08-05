import { uploadCompanyLogoUseCase } from "@/features/company/application/useCases/uploadCompanyLogoUseCase";
import { companyRepositoryInstance } from "@/features/company/infrastructure/companyRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useUploadCompanyLogo = () => {
  return useMutation({
    mutationFn: ({ file, userId }: { file: File; userId: string }) =>
      uploadCompanyLogoUseCase(companyRepositoryInstance, file, userId),
  });
};