"use client";
import ChatWindow from "@/components/chat/ChatWindow";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { button } from "@nextui-org/react";
import { useState } from "react";

function MainLayout({ children }: { children: React.ReactNode }) {
  const [isOpenChatWindow, setIsOpenChatWindow] = useState<boolean>(false);
  return (
    <div className="relative">
      <Navbar />
      {/* <main>{children}</main> */}
      {children}
      <Footer />
      {/* toggle chat window */}
      {isOpenChatWindow ? (
        <div className=" bottom-2 right-0 z-[1000] mr-2 mb-2 top-3/4 backdrop-blur-md rounded shadow-md left-1/2 fixed ">
          <button
            onClick={() => setIsOpenChatWindow(false)}
            className="px-2 py-1 w-full text-right"
          >
            <span className="hover:text-red-400 hover:font-bold ">X</span>
          </button>
          <ChatWindow />
        </div>
      ) : (
        <div className="fixed bottom-2 right-0 z-[1000] mr-2 mb-2">
          <FontAwesomeIcon
            size="3x"
            icon={faFacebookMessenger}
            onClick={() => setIsOpenChatWindow(true)}
            className="text-blue-600 drop-shadow-2xl hover:cursor-pointer hover:text-blue-800"
          />
        </div>
      )}
    </div>
  );
}

export default MainLayout;
