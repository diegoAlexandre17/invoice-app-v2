import MainLayout from "@/components/layouts/MainLayout";
import { PATHS, SEGMENTS } from "@/router/paths";
import { lazy } from "react";
import { useRoutes } from "react-router";

const Dashboard = lazy(() => import("@/views/Dashboard"));
const Customers = lazy(() => import("@/views/Customers"));

const Router = () => {
  const routes = useRoutes([
    {
      path: PATHS.admin,
      element: <MainLayout />,
      children: [
        { path: SEGMENTS.dashboard, element: <Dashboard /> },
        { path: SEGMENTS.customers, element: <Customers /> },
      ],
    },
  ]);

  return routes;
};

export default Router;
