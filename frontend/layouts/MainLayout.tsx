"use client";
import ChatBot from "@/components/chat/ChatBot";
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
  const [isOpenChatbot, setIsOpenChatbot] = useState<boolean>(false);

  const handleOpenChatWindow = () => {
    setIsOpenChatWindow(true);
    setIsOpenChatbot(false);
  };

  const handleOpenChatBot = () => {
    setIsOpenChatWindow(false);
    setIsOpenChatbot(true);
  };
  return (
    <div className="relative">
      <Navbar />
      {/* <main>{children}</main> */}
      {children}
      <Footer />
      {/* toggle chat window */}
      {isOpenChatWindow ? (
        <div className=" bottom-0 right-0 z-[1000] top-3/4 backdrop-blur-md rounded shadow-md left-1/2 fixed ">
          <button
            onClick={() => setIsOpenChatWindow(false)}
            className="px-4 py-1 w-full text-right bg-secondary-500 text-white hover:text-red-500 font-bold rounded-t-md"
          >
            X
          </button>
          <div className="">
            <ChatWindow />
          </div>
        </div>
      ) : (
        // messenger icon
        <div className="fixed bottom-2 left-0 z-[1000] ml-2 mb-2 ">
          <FontAwesomeIcon
            size="3x"
            icon={faFacebookMessenger}
            onClick={handleOpenChatWindow}
            className="text-blue-600 drop-shadow-2xl hover:cursor-pointer hover:text-blue-800  "
          />
        </div>
      )}
      {/* chatbot */}

      {isOpenChatbot ? (
        <div className=" bottom-0 right-0 z-[1000] top-3/4 backdrop-blur-md rounded shadow-md left-1/2 fixed ">
          <div className="flex items-center justify-between bg-secondary-500  rounded-t-md px-2 py-2">
            <p>AikaBot-Chatbot hỗ trợ khách hàng</p>
            <button
              onClick={() => setIsOpenChatbot(false)}
              className="  text-white hover:text-red-500 font-bold"
            >
              X
            </button>
          </div>
          <div className="h-[500px]">
            <ChatBot />
          </div>
        </div>
      ) : (
        // chatbot icon
        <div
          className="fixed bottom-10 left-0 z-[1000] ml-2   bg-primary-100 rounded-full w-12 mb-12 cursor-pointer "
          onClick={handleOpenChatBot}
        >
          <img
            src="/chatbot.png"
            alt="Chatbot icon"
            className="animate-bounce"
          />
        </div>
      )}
    </div>
  );
}

export default MainLayout;
