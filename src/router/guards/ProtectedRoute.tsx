import Loader from "@/components/shared/Loader";
import { useSession } from "@/features/auth/presentation/hooks/useSession";
import { PATHS } from "@/router/paths";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
  const { data: user, isLoading } = useSession();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to={PATHS.login} replace />;

  return <Outlet />;
};
