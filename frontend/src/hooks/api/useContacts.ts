import { useQuery } from "@tanstack/react-query";
import api from "@/libraries/axios";
import { useAuthUser } from "../auth/useAuthUser";

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
  const { data: authUser } = useAuthUser();

  return useQuery({
    queryKey: ["auth", authUser?._id, "contacts"],
    queryFn: fetchContacts,
    enabled: !!authUser?._id,
  });
};
