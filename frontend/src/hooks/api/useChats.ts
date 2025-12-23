import { useQuery } from "@tanstack/react-query";
import api from "@/libraries/axios";

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
  return useQuery({
    queryKey: ["chat-partners"],
    queryFn: fetchChatPartners,

    staleTime: 60 * 1000, // 1 minute (shorter than contacts)
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
