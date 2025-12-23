import React, { useEffect } from "react";
import { useChatStore } from "@/hooks/store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingState";
import ChatsListEmpty from "./ChatsListEmpty";

const ChatsList = () => {
  const { getMyChatPartners, setSelectedUser } = useChatStore((s) => s.actions);
  const chats = useChatStore((s) => s.chatPartners);
  const isUsersLoading = useChatStore((s) => s.isUsersLoading);

  useEffect(() => {
    getMyChatPartners().then(() => console.log(chats));
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length == 0) return <ChatsListEmpty />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            {/* TODO: Fix online status and make it work with Socket */}
            <div className={`avatar online`}>
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
