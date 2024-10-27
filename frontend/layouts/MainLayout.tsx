"use client";
import ChatWindow from "@/components/chat/ChatWindow";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="">{children}</main>
      <Footer />
      <div className="fixed bottom-0 right-5 bg-orange-500 p-10">
        <ChatWindow />
      </div>
    </div>
  );
}

export default MainLayout;
