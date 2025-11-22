import { ROUTES } from "@/routes";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children?: React.ReactNode;
  requiredRole?: string;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { isLoading, isAuthenticated, userRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={ROUTES.UNAUTHORIZED} />;
  }

  return children || <Outlet />;
};

export default AuthGuard;
