"use client";

import ChatWindow from "@/components/chat/ChatWindow";
import MainLayout from "@/layouts/MainLayout";

function ChatPage() {
  return (
    <MainLayout>
      <div className="">
        <ChatWindow />
      </div>
    </MainLayout>
  );
}

export default ChatPage;
