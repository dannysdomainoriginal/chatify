import { create } from "zustand";
import { type AuthUser } from "../auth/useAuthUser";
import { io, Socket } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

interface SocketStore {
  socket: null | Socket;
  onlineUsers: string[];
  actions: SocketStoreActions;
}

interface SocketStoreActions {
  connectSocket: (user: AuthUser) => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  onlineUsers: [],

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
      if (!socket) return

      socket.off()
      if (socket.connected) socket.disconnect();

      set({ socket: null, onlineUsers: [] });
    },
  },
}));
