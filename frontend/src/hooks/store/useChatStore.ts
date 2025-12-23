import api from "@/libraries/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface ChatState {
  allContacts: Contact[];
  chatPartners: Contact[];
  messages: Message[];
  activeTab: "chats" | "contacts";
  selectedUser: Contact | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;

  actions: ChatActions;
}

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

interface Message {}

interface ChatActions {
  toggleSound: () => void;

  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (tab: Contact) => void;

  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
}

const localStorageKey = "ksnk:chatify:isSoundEnabled";

export const useChatStore = create<ChatState>((set, get) => ({
  allContacts: [],
  chatPartners: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled:
    JSON.parse(localStorage.getItem(localStorageKey) ?? "false") === true,

  actions: {
    toggleSound: () => {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify(!get().isSoundEnabled)
      );
      set({ isSoundEnabled: !get().isSoundEnabled });
    },

    setActiveTab: (activeTab) => set({ activeTab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
      set({ isUsersLoading: true });

      try {
        const res = await api.get<Contact[]>("/messages/contacts");
        set({ allContacts: res.data });
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Error getting contacts");
      } finally {
        set({ isUsersLoading: false });
      }
    },

    getMyChatPartners: async () => {
      set({ isUsersLoading: true });

      try {
        const res = await api.get<Contact[]>("/messages/chats");
        set({ chatPartners: res.data });
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Error getting your chats");
      } finally {
        set({ isUsersLoading: false });
      }
    },
  },
}));