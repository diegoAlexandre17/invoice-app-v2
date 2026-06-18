import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { routes } from "./sidebarRoutes";

const AppSidebar = () => {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-primary text-primary-foreground">
        <SidebarHeader>
          <Link to="/admin/dashboard" className="flex flex-row items-center">
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
                    {state === "expanded" && <span>{item.title}</span>}
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
