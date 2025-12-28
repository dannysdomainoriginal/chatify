import { useChatStore } from "@/hooks/store/useChatStore";
import { useSocketStore } from "@/hooks/store/useSocketStore";
import { XIcon } from "lucide-react";
import React, { useEffect, useMemo } from "react";

const ChatHeader = () => {
  const selectedUser = useChatStore((s) => s.selectedUser);
  const { setSelectedUser } = useChatStore((s) => s.actions);
  const onlineUsers = useSocketStore((s) => s.onlineUsers);

  // Check if user is online
  const isOnline = useMemo(() => {
    return selectedUser ? onlineUsers.includes(selectedUser._id) : false;
  }, [onlineUsers, selectedUser]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup
    return () => window.removeEventListener("keydown", handleEscKey);
  });

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700 max-h-[84px] px-6 flex-1">
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedUser?.profilePic || "/avatar.png"}
              alt={selectedUser?.fullName}
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedUser?.fullName}
          </h3>
          <p className="text-slate-400 text-sm">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-40 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
};

export default ChatHeader;
