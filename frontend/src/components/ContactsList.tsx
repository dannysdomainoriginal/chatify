import React from "react";
import { useChatStore } from "@/hooks/store/useChatStore";
import { useContacts } from "@/hooks/api/useContacts";
import { useSocketStore } from "@/hooks/store/useSocketStore";

import UsersLoadingSkeleton from "./UsersLoadingState";
import ChatsListEmpty from "./ChatsListEmpty";

const ContactsList = () => {
  const { setSelectedUser } = useChatStore((s) => s.actions);
  const onlineUsers = useSocketStore((s) => s.onlineUsers);

  const { data: contacts = [], isLoading } = useContacts();

  if (isLoading) return <UsersLoadingSkeleton />;
  if (contacts.length === 0) return <ChatsListEmpty />;

  return (
    <>
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${
                onlineUsers.includes(contact._id) ? "online" : "offline"
              }`}
            >
              <div className="size-12 rounded-full">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
                />
              </div>
            </div>

            <div className="text-slate-200 font-medium truncate">
              {contact.fullName}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactsList;
