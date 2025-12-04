import apiClient from "@/api/auth/apiClient";
import axios from "axios";
import { setToken, setRefreshToken } from "@/lib/utils";

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(data: LoginPayload): Promise<string> {
  try {
    const response = await apiClient.post("/login", data);
    const { accessToken, refreshToken } = response.data;
    setToken(accessToken);
    setRefreshToken(refreshToken);
    return accessToken;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.message || "Login failed.";
    } else {
      throw "An unexpected error occurred.";
    }
  }
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUrl: string;
}

export async function registerUser(data: RegisterPayload): Promise<string> {
  try {
    const response = await apiClient.post("/api/Auth/register", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw "An unexpected error occurred.";
    }
  }
}

interface ChangePasswordPayload {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function changePassword(
  data: ChangePasswordPayload
): Promise<string> {
  try {
    const response = await apiClient.post("/api/Auth/change-password", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw "An unexpected error occurred.";
    }
  }
}

export async function fetchUserProfile() {
  const response = await apiClient.get("/api/Auth/user");
  return response.data;
}
