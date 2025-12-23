import React, { useEffect, useRef } from "react";
import { useChatStore } from "@/hooks/store/useChatStore";
import { useMessages } from "@/hooks/api/useMessages";
import { useAuthUser } from "@/hooks/auth/useAuthUser";

import ChatHeader from "@/partials/ChatHeader";
import NoChatHistory from "./NoChatHistory";
import MessagesLoadingSkeleton from "./MessagesLoadingState";
import MessageInput from "./MessageInput";

import { format, isToday, isYesterday } from "date-fns";

const formatMessageTime = (date: string | Date) => {
  const d = new Date(date);

  if (isToday(d)) return format(d, "hh:mm a");
  if (isYesterday(d)) return `Yesterday ${format(d, "hh:mm a")}`;
  return format(d, "MMM d, hh:mm a");
};

const ChatContainer = () => {
  const selectedUser = useChatStore((s) => s.selectedUser);
  const { data: authUser } = useAuthUser();

  const { data: messages = [], isLoading } = useMessages(selectedUser?._id);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!messageEndRef.current) return;
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {isLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.receiverId !== authUser?._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser?._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-auto md:w-[25rem] object-cover"
                    />
                  )}

                  {msg.text && <p className="mt-2">{msg.text}</p>}

                  <p className="text-xs text-end mt-1 opacity-75">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}

            <div ref={messageEndRef} />
          </div>
        ) : (
          <NoChatHistory />
        )}
      </div>

      <MessageInput />
    </>
  );
};

export default ChatContainer;
