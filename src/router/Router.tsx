import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";
import { ProtectedRoute } from "@/router/guards/ProtectedRoute";
import { PublicOnlyRoute } from "@/router/guards/PublicOnlyRoute";
import { PATHS, SEGMENTS } from "@/router/paths";
import { crumb } from "@/router/types";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

const Login = lazy(() => import("@/views/auth/Login"));
const RecoveryPassword = lazy(() => import("@/views/auth/RecoveryPassword"));
const ResetPassword = lazy(() => import("@/views/auth/ResetPassword"));
const Register = lazy(() => import("@/views/auth/Register"));
const Dashboard = lazy(() => import("@/views/Dashboard"));
const Customers = lazy(() => import("@/views/customers/Customers"));
const CompanyData = lazy(() => import("@/views/company/CompanyData"));

const Router = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/auth/login" />,
    },
    {
      element: <AuthLayout />,
      children: [{ path: PATHS.resetPassword, element: <ResetPassword /> }],
    },
    {
      path: PATHS.auth,
      element: <PublicOnlyRoute />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            {
              path: "/auth/login",
              element: <Login />,
            },
            {
              path: PATHS.recoveryPassword,
              element: <RecoveryPassword />,
            },
            {
              path: PATHS.register,
              element: <Register />,
            },
          ],
        },
      ],
    },
    {
      path: PATHS.admin,
      element: <ProtectedRoute />,
      children: [
        {
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
             {
              path: SEGMENTS.company,
              element: <CompanyData />,
              handle: crumb("navigation.company"),
            },
          ],
        },
      ],
    },
  ]);

  return routes;
};

export default Router;
