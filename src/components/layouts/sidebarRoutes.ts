import { PATHS } from "@/router/paths";
import { Building2, HandshakeIcon, LayoutDashboard, Receipt } from "lucide-react";

export const routes = [
  {
    titleKey: "navigation.dashboard",
    url: PATHS.dashboard,
    icon: LayoutDashboard,
  },
  {
    titleKey: "navigation.customers",
    url: PATHS.customers,
    icon: HandshakeIcon,
  },
  {
    titleKey: "navigation.invoices",
    url: PATHS.invoices,
    icon: Receipt,
  },
  {
    titleKey: "navigation.company",
    url: PATHS.company,
    icon: Building2,
  },
] as const;
