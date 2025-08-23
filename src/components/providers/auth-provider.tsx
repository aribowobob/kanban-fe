"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useUserStore } from "@/lib/store/user-store";
import { authApi } from "@/lib/api/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, resetUser } = useUserStore();

  const token = getCookie("token");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (isError || !token) {
      resetUser();
    }
  }, [data, isError, token, setUser, resetUser]);

  return <>{children}</>;
}
