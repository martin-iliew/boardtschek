"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/lib/utils";
import { ROUTES } from "@/routes";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  return null;
}
