import { create } from "zustand";
import { type AuthUser } from "../auth/useAuthUser";
import { io, Socket } from "socket.io-client";
import queryClient from "@/libraries/tanstack";
import type { Message } from "../api/useMessages";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

interface SocketStore {
  socket: null | Socket;
  onlineUsers: string[];
  actions: SocketStoreActions;
  notifyMessage: Record<string, string> | null;
}

interface SocketStoreActions {
  connectSocket: (user: AuthUser) => void;
  disconnectSocket: () => void;
  subscribeToNewMessages: (user: AuthUser, soundEnabled: boolean) => void;
}

const notificationSound = new Audio("/sounds/notification.mp3");

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  onlineUsers: [],
  notifyMessage: null,

  actions: {
    connectSocket: (user) => {
      if (!user || get().socket?.connected) return;

      const socket = io(BASE_URL, {
        withCredentials: true,
      });

      socket.connect();
      set({ socket });

      // listen for online users
      socket.on("getOnlineUsers", (userIds: string[]) => {
        set({ onlineUsers: userIds });
      });
    },

    disconnectSocket: () => {
      const { socket } = get();
      if (!socket) return;

      socket.off();
      if (socket.connected) socket.disconnect();

      set({ socket: null, onlineUsers: [] });
    },

    subscribeToNewMessages: (user, soundEnabled) => {
      const { socket } = get();
      if (!socket) return;

      type SocketData = {
        id: string; // senderId
        fullName: string;
        newMessage: Message;
      };

      socket.off("newMessage");
      socket.on("newMessage", async (partner: SocketData) => {
        set({
          notifyMessage: {
            name: partner.fullName,
            id: partner.id,
          },
        });

        const queryKey = ["auth", user._id, "messages", partner.id];

        // ✅ Push message directly into cache
        const old = queryClient.getQueryData<Message[]>(queryKey) || [];
        queryClient.setQueryData<Message[]>(queryKey, () => {
          if (old.some((m) => m._id === partner.newMessage._id)) {
            return old;
          }

          return [...old, partner.newMessage];
        });

        await queryClient.invalidateQueries({ queryKey });

        if (soundEnabled) {
          notificationSound.currentTime = 0;
          notificationSound.play().catch(() => {});
        }

        set({ notifyMessage: null });
      });
    },
  },
}));
