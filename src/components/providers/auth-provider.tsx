"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useUserStore } from "@/lib/store/user-store";
import { useIsClient } from "@/lib/hooks/use-is-client";
import { authApi } from "@/lib/api/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, resetUser } = useUserStore();
  const isClient = useIsClient();

  const token = isClient ? getCookie("token") : null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    enabled: !!token && isClient,
    retry: false,
  });

  useEffect(() => {
    if (isClient) {
      setLoading(isLoading);
    }
  }, [isLoading, setLoading, isClient]);

  useEffect(() => {
    if (isClient) {
      if (data) {
        setUser(data.data);
      } else if (isError || !token) {
        resetUser();
      }
    }
  }, [data, isError, token, setUser, resetUser, isClient]);

  return <>{children}</>;
}
