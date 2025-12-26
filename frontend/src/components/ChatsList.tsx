import React from "react";
import { useChatStore } from "@/hooks/store/useChatStore";
import { useChatPartners } from "@/hooks/api/useChats";

import UsersLoadingSkeleton from "./UsersLoadingState";
import ChatsListEmpty from "./ChatsListEmpty";
import { useSocketStore } from "@/hooks/store/useSocketStore";

const ChatsList = () => {
  const { setSelectedUser } = useChatStore((s) => s.actions);
  const onlineUsers = useSocketStore((s) => s.onlineUsers);

  const { data: chats = [], isLoading } = useChatPartners();

  if (isLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <ChatsListEmpty />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline" }`}>
              <div className="size-12 rounded-full">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                />
              </div>
            </div>

            <div className="text-slate-200 font-medium truncate">
              {chat.fullName}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatsList;
