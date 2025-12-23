import React, { useEffect } from "react";
import { useChatStore } from "@/hooks/store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingState";
import ChatsListEmpty from "./ChatsListEmpty";

const ChatsList = () => {
  const { getAllContacts, setSelectedUser } = useChatStore((s) => s.actions);
  const contacts = useChatStore((s) => s.allContacts);
  const isUsersLoading = useChatStore((s) => s.isUsersLoading);

  useEffect(() => {
    getAllContacts().then(() => console.log(contacts));
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (contacts.length == 0) return <ChatsListEmpty />;

  return (
    <>
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            {/* TODO: Fix online status and make it work with Socket */}
            <div className={`avatar online`}>
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

export default ChatsList;
