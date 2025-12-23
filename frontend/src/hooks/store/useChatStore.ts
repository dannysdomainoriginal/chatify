import { create } from "zustand";

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface ChatUIState {
  activeTab: "chats" | "contacts";
  selectedUser: Contact | null;
  isSoundEnabled: boolean;

  actions: {
    setActiveTab: (tab: "chats" | "contacts") => void;
    setSelectedUser: (user: Contact | null) => void;
    toggleSound: () => void;
  };
}

const localStorageKey = "ksnk:chatify:isSoundEnabled";

export const useChatStore = create<ChatUIState>((set, get) => ({
  activeTab: "chats",
  selectedUser: null,
  isSoundEnabled:
    JSON.parse(localStorage.getItem(localStorageKey) ?? "false") === true,

  actions: {
    setActiveTab: (activeTab) => set({ activeTab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    toggleSound: () => {
      const next = !get().isSoundEnabled;
      localStorage.setItem(localStorageKey, JSON.stringify(next));
      set({ isSoundEnabled: next });
    },
  },
}));
