import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setCookie } from "cookies-next";
import { toast } from "sonner";

import { authApi } from "@/lib/api/auth";
import { useUserStore } from "@/lib/store/user-store";
import { handleApiError } from "@/lib/api/api-client";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const useLoginPage = () => {
  const { replace } = useRouter();
  const { setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store token in cookie
      setCookie("token", data.data.token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Set user in store
      setUser(data.data.user);

      toast.success("Login successful!");
      replace("/dashboard");
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loginMutation,
  };
};
