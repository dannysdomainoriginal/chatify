import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/libraries/axios";

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

export const useMessages = (userId?: string) => {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: ({ queryKey }) => {
      const [_, id] = queryKey;
      return fetchMessages(id!);
    },

    enabled: !!userId,
    placeholderData: keepPreviousData,

    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
