import { useState, useEffect, useCallback, ReactNode } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";
import { setToken, getToken, decodeToken, logoutUser } from "@/lib/utils";
import { ROUTES } from "@/routes";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUserRoleFromToken = useCallback(() => {
    const decoded = decodeToken();
    if (decoded && decoded.role) setUserRole(decoded.role);
    else setUserRole(null);
  }, []);

  const applyToken = useCallback(
    (accessToken: string | null) => {
      setToken(accessToken);
      setTokenState(accessToken);
      if (accessToken) setUserRoleFromToken();
    },
    [setUserRoleFromToken]
  );

  const logoutOnError = () => {
    logoutUser();
    setTokenState(null);
    setUserRole(null);
    window.location.href = ROUTES.LOGIN;
  };

  const logout = () => {
    logoutUser();
    window.location.href = ROUTES.LOGOUT;
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAccessToken = getToken();
        if (storedAccessToken) {
          applyToken(storedAccessToken);
        }
      } catch {
        logoutOnError();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [applyToken]);

  const authContextValue: AuthContextType = {
    token,
    userRole,
    isLoading,
    isAuthenticated: !!token,
    setTokenState: applyToken,
    logout,
    logoutOnError,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
