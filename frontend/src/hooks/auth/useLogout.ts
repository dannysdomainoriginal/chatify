import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libraries/axios";
import toast from "react-hot-toast";
import type { AuthUser } from "./useAuthUser";
import { useChatStore } from "../store/useChatStore";
import queryClient from "@/libraries/tanstack";

export const useLogout = () => {
  const { resetChatUI } = useChatStore((s) => s.actions);

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post("/auth/logout");
    },

    onSuccess: async () => {
      // 1️⃣ Safely set auth to null for quick rerender
      queryClient.setQueryData<AuthUser | null>(["auth-user"], null);

      // 2️⃣ Remove ALL user-scoped server state
      queryClient.removeQueries({
        queryKey: ["auth"],
      });

      // 3️⃣ Reset ALL auth-dependent UI state
      resetChatUI();

      // 4️⃣ UX Feedback
      toast.success("Logged out successfully");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error logging out");
    },
  });
};
