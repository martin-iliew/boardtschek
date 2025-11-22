import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode, JwtPayload } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DecodedToken extends JwtPayload {
  role?: string;
}

let accessTokenMemory: string | null = null;

export const setToken = (token: string | null): void => {
  console.log("setToken called with:", token); // DEBUG
  accessTokenMemory = token;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getToken = (): string | null => {
  if (accessTokenMemory) return accessTokenMemory;
  const stored = localStorage.getItem("token");
  accessTokenMemory = stored;
  return stored;
};

export const removeToken = (): void => {
  accessTokenMemory = null;
  localStorage.removeItem("token");
};

export const setRefreshToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("refreshToken", token);
  } else {
    localStorage.removeItem("refreshToken");
  }
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem("refreshToken");
};

export const logoutUser = (): void => {
  removeToken();
  removeRefreshToken();
};

export const decodeToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
