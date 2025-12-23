import { useMutation } from "@tanstack/react-query";
import api from "@/libraries/axios";
import toast from "react-hot-toast";
import queryClient from "@/libraries/react-query";
import type { AuthUser } from "./useAuthUser";

export const useLogout = () => {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post("/auth/logout");
    },

    onSuccess: () => {
      toast.success("Logged out successfully");

      // Clear all queries to reset server state
      queryClient.clear();

      // Immediately update auth-user subscription to null
      queryClient.setQueryData<AuthUser | null>(["auth-user"], null);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error logging out");
    },
  });
};
