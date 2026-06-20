import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { PATHS } from "@/router/paths";
import { routes } from "./sidebarRoutes";
import { useTranslation } from "react-i18next";

const AppSidebar = () => {
  const { state } = useSidebar();

  const {t} = useTranslation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-primary text-primary-foreground">
        <SidebarHeader>
          <Link to={PATHS.dashboard} className="flex flex-row items-center">
            INVOICE LOGO
          </Link>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {routes.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild>
                  <Link to={item.url} className="p-5">
                    <div>{item.icon && <item.icon size={20} />}</div>
                    {state === "expanded" && <span>{t(item.titleKey)}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
