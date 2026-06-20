import { Building2, LayoutDashboard } from "lucide-react";
import { PATHS } from "@/router/paths";

export const routes = [
  {
    titleKey: "navigation.dashboard",
    url: PATHS.dashboard,
    icon: LayoutDashboard,
  },
  {
    titleKey: "navigation.customers",
    url: PATHS.customers,
    icon: Building2,
  },
] as const;
