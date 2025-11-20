import { useState, useEffect, useCallback, ReactNode } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";
import {
  setToken,
  getToken,
  decodeToken,
  removeToken,
  removeRefreshToken,
  isTokenExpired,
} from "@/lib/utils";
import { refreshToken as requestRefreshToken, logoutUser } from "@/api/auth";

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

  const forceLogout = () => {
    removeToken();
    removeRefreshToken();
    setTokenState(null);
    setUserRole(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAccessToken = getToken();
        if (!storedAccessToken || isTokenExpired(storedAccessToken)) {
          const newAccessToken = await requestRefreshToken();
          if (newAccessToken) {
            applyToken(newAccessToken);
          }
        } else {
          applyToken(storedAccessToken);
        }
      } catch {
        forceLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [applyToken]);

  const logout = () => {
    forceLogout();
    logoutUser();
  };

  const authContextValue: AuthContextType = {
    token,
    userRole,
    logout,
    setTokenState: applyToken,
    isLoading,
    isAuthenticated: !!token,
    forceLogout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
