import ActiveTabSwitch from "@/components/ActiveTabSwitch";
import AnimatedBorder from "@/components/AnimatedBorder";
import ChatContainer from "@/components/ChatContainer";
import ChatPlaceholder from "@/components/ChatPlaceholder";
import ChatsList from "@/components/ChatsList";
import ContactsList from "@/components/ContactsList";
import ProfileHeader from "@/partials/ProfileHeader";

import { useChatStore } from "@/hooks/store/useChatStore";
import { useSocketStore } from "@/hooks/store/useSocketStore";
import toast from "react-hot-toast";
import { useEffect } from "react";

const ChatPage = () => {
  const activeTab = useChatStore((s) => s.activeTab);
  const selectedUser = useChatStore((s) => s.selectedUser);

  const newMessage = useSocketStore((s) => s.notifyMessage);

  useEffect(() => {
    if (newMessage) {
      const { id, name } = newMessage;

      if (!selectedUser || id !== selectedUser?._id) {
        toast.success(`${name} sent a new message`);
      }
    }
  }, [newMessage]);

  return (
    <div className="text-white relative w-full max-w-6xl h-[800px]">
      <AnimatedBorder>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactsList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <ChatPlaceholder />}
        </div>
      </AnimatedBorder>
    </div>
  );
};

export default ChatPage;
