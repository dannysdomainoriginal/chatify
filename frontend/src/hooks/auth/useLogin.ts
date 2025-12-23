import { useMutation } from "@tanstack/react-query";
import api from "@/libraries/axios";
import toast from "react-hot-toast";
import queryClient from "@/libraries/react-query";
import type { AuthUser } from "./useAuthUser";

export interface LoginInput {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginInput): Promise<AuthUser> => {
      const res = await api.post<AuthUser>("/auth/login", data);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success("Logged in successfully");

      // Clear all cache to refresh server state
      queryClient.clear();

      // Immediately update auth-user subscription
      queryClient.setQueryData<AuthUser>(["auth-user"], data);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error logging in");
    },
  });
};
