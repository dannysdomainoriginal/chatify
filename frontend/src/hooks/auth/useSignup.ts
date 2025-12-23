import { useMutation } from "@tanstack/react-query";
import api from "@/libraries/axios";
import toast from "react-hot-toast";
import queryClient from "@/libraries/react-query";
import type { AuthUser } from "./useAuthUser";

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

    onSuccess: (data) => {
      toast.success("Account created successfully");

      // Clear the cache to refresh server state
      queryClient.clear();

      // Optionally, immediately update auth-user query
      queryClient.setQueryData<AuthUser>(["auth-user"], data);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Error creating your account",
      );
    },
  });
};
