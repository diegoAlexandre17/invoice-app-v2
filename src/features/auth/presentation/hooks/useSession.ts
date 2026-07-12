import { getCurrentUserUseCase } from "@/features/auth/application/useCases/getCurrentUserUseCase";
import { authRepositoryInstance } from "@/features/auth/infrastructure/authRepository";
import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => getCurrentUserUseCase(authRepositoryInstance),
    retry: false, 
  });
};
