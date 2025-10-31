"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authAPI } from "@/lib/api";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { token } = await authAPI.login(email, password);
    localStorage.setItem("token", token);
    setIsAuthenticated(true);

    // Small delay to ensure state is updated
    setTimeout(() => {
      router.push("/studio");
    }, 100);
  };

  const signup = async (email: string, password: string) => {
    const { token } = await authAPI.signup(email, password);
    localStorage.setItem("token", token);
    setIsAuthenticated(true);

    // Small delay to ensure state is updated
    setTimeout(() => {
      router.push("/studio");
    }, 100);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return { isAuthenticated, isLoading, login, signup, logout };
};
