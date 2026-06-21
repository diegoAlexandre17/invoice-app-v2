import MainLayout from "@/components/layouts/MainLayout";
import { PATHS, SEGMENTS } from "@/router/paths";
import { crumb } from "@/router/types";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

const Login = lazy(() => import("@/views/Login/Login"));
const Dashboard = lazy(() => import("@/views/Dashboard"));
const Customers = lazy(() => import("@/views/Customers"));

const Router = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: PATHS.admin,
      element: <MainLayout />,
      children: [
        {
          path: SEGMENTS.dashboard,
          element: <Dashboard />,
          handle: crumb("navigation.dashboard"),
        },
        {
          path: SEGMENTS.customers,
          element: <Customers />,
          handle: crumb("navigation.customers"),
        },
      ],
    },
  ]);

  return routes;
};

export default Router;
