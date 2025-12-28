import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";
import { useAuthUser } from "./hooks/auth/useAuthUser";
import { useSocketStore } from "./hooks/store/useSocketStore";
import { useChatStore } from "./hooks/store/useChatStore";

const App = () => {
  const { data: user, isLoading } = useAuthUser();
  const { connectSocket, disconnectSocket } = useSocketStore((s) => s.actions);
  const { subscribeToNewMessages } = useSocketStore((s) => s.actions);
  const isSoundEnabled = useChatStore((s) => s.isSoundEnabled);

  useEffect(() => {
    if (user) {
      connectSocket(user);
      subscribeToNewMessages(user, isSoundEnabled);
    } else {
      disconnectSocket();
    }
  }, [user, connectSocket, disconnectSocket, isSoundEnabled]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        <Route
          path="/"
          element={user ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
