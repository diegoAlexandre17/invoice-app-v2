import MainLayout from "@/components/layouts/MainLayout";
import { lazy } from "react";
import { useRoutes } from "react-router";

const Dashboard = lazy(() => import("@/views/Dashboard"));

const DEFAULT_ROUTE = "/";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/admin",
      element: <MainLayout />,
      children: [{ path: "/admin/dashboard", element: <Dashboard /> }],
    },
  ]);

  return routes;
};

export default Router;
