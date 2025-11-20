import { createContext } from "react";

export interface AuthContextType {
  token: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokenState: (token: string | null) => void;
  logout: () => void;
  logoutOnError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
