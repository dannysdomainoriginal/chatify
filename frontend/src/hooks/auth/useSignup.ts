import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libraries/axios";
import toast from "react-hot-toast";
import type { AuthUser } from "./useAuthUser";
import queryClient from "@/libraries/tanstack";

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupInput): Promise<AuthUser> => {
      const res = await api.post<AuthUser>("/auth/signup", data);
      return res.data;
    },

    onSuccess: async (data) => {
      toast.success("Account created successfully");
      queryClient.setQueryData<AuthUser>(["auth-user"], data);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Error creating your account"
      );
    },
  });
};
