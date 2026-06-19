import { Suspense } from "react";
import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="w-full">
        <Navbar />
        <div className="flex-1 p-6 bg-background">
          <Suspense fallback={<div>Cargando…</div>}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
