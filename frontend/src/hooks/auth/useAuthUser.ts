import { useQuery } from "@tanstack/react-query";
import api from "@/libraries/axios";

export interface AuthUser {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
}

const fetchAuthUser = async (): Promise<AuthUser> => {
  const res = await api.get<AuthUser>("/auth/check");
  return res.data;
};

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: fetchAuthUser,

    retry: false, // 👈 not authenticated ≠ error
    staleTime: 5 * 60 * 1000, // cache auth state
    refetchOnWindowFocus: false,
  });
};
