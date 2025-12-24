import { useQuery } from "@tanstack/react-query";
import api from "@/libraries/axios";
import { useAuthUser } from "../auth/useAuthUser";

export interface ChatPartner {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

const fetchChatPartners = async (): Promise<ChatPartner[]> => {
  const res = await api.get<ChatPartner[]>("/messages/chats");
  return res.data;
};

export const useChatPartners = () => {
  const { data: authUser } = useAuthUser()

  return useQuery({
    queryKey: ["auth", authUser?._id, "chat-partners"],
    queryFn: fetchChatPartners,
    enabled: !!authUser?._id
  });
};
