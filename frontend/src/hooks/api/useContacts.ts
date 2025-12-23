import { useQuery } from "@tanstack/react-query";
import api from "@/libraries/axios";

export interface Contact {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

const fetchContacts = async (): Promise<Contact[]> => {
  const res = await api.get<Contact[]>("/messages/contacts");
  return res.data;
};

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,

    // 👇 important bits
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // cache cleanup
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
