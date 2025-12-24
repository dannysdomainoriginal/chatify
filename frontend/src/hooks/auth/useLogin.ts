import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libraries/axios";
import toast from "react-hot-toast";
import type { AuthUser } from "./useAuthUser";
import queryClient from "@/libraries/tanstack";

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

    onSuccess: async (data) => {
      toast.success("Logged in successfully");
      queryClient.setQueryData<AuthUser>(["auth-user"], data);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error logging in");
    },
  });
};
