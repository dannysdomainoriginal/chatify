import { useQuery } from "@tanstack/react-query";
import api from "@/libraries/axios";

export interface AuthUser {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
}

const fetchAuthUser = async (): Promise<AuthUser | null> => {
  const statusCodes = [400, 401, 403];

  try {
    const res = await api.get<AuthUser>("/auth/check");
    return res.data;
  } catch (err: any) {
    if (statusCodes.includes(err.response?.status)) {
      return null;
    }
    throw err; // for other errors, bubble up
  }
};

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: fetchAuthUser,
    retry: false,

    staleTime: 5 * 60 * 1000,
  });
};
