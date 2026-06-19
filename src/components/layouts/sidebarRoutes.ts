import { Building2, LayoutDashboard } from "lucide-react";
import { PATHS } from "@/router/paths";

export const routes = [
  {
    title: "Dashboard",
    url: PATHS.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    url: PATHS.customers,
    icon: Building2,
  },
];
