import { PATHS } from "@/router/paths";
import { Building2, HandshakeIcon, LayoutDashboard } from "lucide-react";

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
    titleKey: "navigation.company",
    url: PATHS.company,
    icon: Building2,
  },
] as const;
