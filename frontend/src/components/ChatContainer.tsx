import React, { useEffect, useRef } from "react";
import { useChatStore } from "@/hooks/store/useChatStore";
import ChatHeader from "@/partials/ChatHeader";
import NoChatHistory from "./NoChatHistory";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import MessagesLoadingSkeleton from "./MessagesLoadingState";
import MessageInput from "./MessageInput";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

const formatMessageTime = (date: string | Date) => {
  const d = new Date(date);

  if (isToday(d)) {
    return format(d, "hh:mm a");
  }

  if (isYesterday(d)) {
    return `Yesterday ${format(d, "hh:mm a")}`;
  }

  return format(d, "MMM d, hh:mm a");
};

const ChatContainer = () => {
  const selectedUser = useChatStore((s) => s.selectedUser);
  const user = useAuthStore((s) => s.authUser);
  const messages = useChatStore((s) => s.messages);
  const isMessagesLoading = useChatStore((s) => s.isMessagesLoading);
  const { getMessagesByUserId } = useChatStore((s) => s.actions);

  const messageEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser!._id);
  }, [selectedUser]);

  useEffect(() => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === user?._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === user?._id
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
                  <p className="text-xs text-end mt-1 opacity-75 flex items-center gap-1">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
                <div ref={messageEnd}></div>
              </div>
            ))}
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
