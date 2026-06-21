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
import { Link, useLocation } from "react-router";
import { PATHS } from "@/router/paths";
import { routes } from "./sidebarRoutes";
import { useTranslation } from "react-i18next";

const AppSidebar = () => {
  const { state } = useSidebar();
  const { pathname } = useLocation();

  const {t} = useTranslation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="">
        <SidebarHeader>
          <Link to={PATHS.dashboard} className="flex flex-row items-center">
            INVOICE LOGO
          </Link>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {routes.map((item) => {
              const isActive =
                pathname === item.url || pathname.startsWith(`${item.url}/`);

              return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:hover:bg-background"
                >
                  <Link
                    to={item.url}
                    className="p-5 transition-transform duration-200 ease-out hover:translate-x-1"
                  >
                    <div>{item.icon && <item.icon size={18} />}</div>
                    {state === "expanded" && <span>{t(item.titleKey)}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
