import { useMutation } from "@tanstack/react-query";
import api from "@/libraries/axios";
import toast from "react-hot-toast";
import queryClient from "@/libraries/react-query";
import type { AuthUser } from "./useAuthUser";

export interface UpdateProfileInput {
  fullName?: string;
  profilePic?: string; // Base64 or URL depending on backend
  email?: string;
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: UpdateProfileInput): Promise<AuthUser> => {
      const res = await api.put<AuthUser>("/auth/update-profile", data);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      queryClient.setQueryData<AuthUser>(["auth-user"], data);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error updating profile");
    },
  });
};
