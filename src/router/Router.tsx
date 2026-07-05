import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";
import { PATHS, SEGMENTS } from "@/router/paths";
import { crumb } from "@/router/types";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

const Login = lazy(() => import("@/views/auth/Login"));
const Dashboard = lazy(() => import("@/views/Dashboard"));
const Customers = lazy(() => import("@/views/Customers/Customers"));
const RecoveryPassword = lazy(() => import("@/views/auth/RecoveryPassword"));
const Register = lazy(() => import("@/views/auth/Register"));

const Router = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/auth/login" />,
    },
    {
      path: PATHS.auth,
      element: <AuthLayout />,
      children: [
        {
          path: "/auth/login",
          element: <Login />,
        },
        {
          path: "/auth/recovery-password",
          element: <RecoveryPassword />,
        },
        {
          path: "/auth/register",
          element: <Register />,
        },
      ],
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
