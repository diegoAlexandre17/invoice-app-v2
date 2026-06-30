import { Suspense } from "react";
import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";

const MainLayout = () => {
  const { t } = useTranslation();

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex w-full flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col p-6 container mx-auto">
          <Suspense fallback={<div>{t("common.loading")}</div>}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
