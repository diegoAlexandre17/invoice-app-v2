import type { Company } from "@/features/company/domain/entities/Company";

export interface CompanyRepository {
  getData(): Promise<Company | null>;
}
