import { useLogOut } from '@/hooks/store/useAuthStore'
import React from 'react'

const ChatPage = () => {
  const logOut = useLogOut()

  return (
    <div className="z-10">
      <button onClick={async () => await logOut()}>Logout</button>  
    </div>
  );
}

export default ChatPage