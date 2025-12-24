import { useQuery } from "@tanstack/react-query";
import api from "@/libraries/axios";
import { useAuthUser } from "../auth/useAuthUser";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const fetchMessages = async (userId: string): Promise<Message[]> => {
  const res = await api.get<Message[]>(`/messages/${userId}`);
  return res.data;
};

export const useMessages = (partnerId: string) => {
  const { data: authUser } = useAuthUser();

  return useQuery({
    queryKey: ["auth", authUser?._id, "messages", partnerId],
    queryFn: () => fetchMessages(partnerId),
    enabled: !!authUser?._id && !!partnerId,
  });
};
