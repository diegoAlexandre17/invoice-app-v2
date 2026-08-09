import type { Company } from "@/features/company/domain/entities/Company";

const REQUIRED_FIELDS: Array<keyof Company> = [
  "name",
  "identification",
  "address",
  "phone",
  "email",
];

export const isCompanyDataComplete = (company: Company | null): boolean => {
  if (!company) return false;

  return REQUIRED_FIELDS.every((field) => Boolean(company[field]));
};
