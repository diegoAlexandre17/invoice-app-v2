import { Outlet } from "react-router";
// import Navbar from "../Navbar/Navbar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Navbar from "../Navbar/Navbar";

const MainLayout = () => {
  /*  return (
    <div className="flex w-full h-full">
      <div className="hidden lg:block w-60 h-full lg:fixed bg-primary text-primary-foreground">
        <h4>sidebar</h4>
      </div>

      <div className="w-full lg:ml-60">
        <Navbar />
        <div className="p-6 bg-background">
          <Outlet />
        </div>
      </div>
    </div>
  ); */

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <main className="flex-1 p-6 bg-background">
        <Outlet />
      </main> */}

      <div className="w-full">
        <Navbar />
        <div className="flex-1 p-6 bg-background">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
