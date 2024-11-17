"use client";
import ChatBot from "@/components/chat/ChatBot";
import ChatWindow from "@/components/chat/ChatWindow";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import { faClose, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { button } from "@nextui-org/react";
import { useEffect, useState } from "react";

function MainLayout({ children }: { children: React.ReactNode }) {
  const [isOpenChatWindow, setIsOpenChatWindow] = useState<boolean>(false);
  const [isOpenChatbot, setIsOpenChatbot] = useState<boolean>(false);

  const handleOpenChatWindow = () => {
    setIsOpenChatWindow(true);
    setIsOpenChatbot(false);
    sessionStorage.setItem("isOpenChatWindow", JSON.stringify(true));
    sessionStorage.setItem("isOpenChatbot", JSON.stringify(false));
  };

  const handleOpenChatBot = () => {
    setIsOpenChatWindow(false);
    setIsOpenChatbot(true);
    sessionStorage.setItem("isOpenChatWindow", JSON.stringify(false));
    sessionStorage.setItem("isOpenChatbot", JSON.stringify(true));
  };

  const handleCloseChatWindow = () => {
    setIsOpenChatWindow(false);
    sessionStorage.setItem("isOpenChatWindow", JSON.stringify(false));
  };

  const handleCloseChatBot = () => {
    setIsOpenChatbot(false);
    sessionStorage.setItem("isOpenChatbot", JSON.stringify(false));
  };

  useEffect(() => {
    // Check sessionStorage for saved state
    const savedChatWindowState = sessionStorage.getItem("isOpenChatWindow");
    const savedChatbotState = sessionStorage.getItem("isOpenChatbot");

    if (savedChatWindowState) {
      setIsOpenChatWindow(JSON.parse(savedChatWindowState));
    }
    if (savedChatbotState) {
      setIsOpenChatbot(JSON.parse(savedChatbotState));
    }
  }, []);

  return (
    <div className="relative">
      <Navbar />
      {/* <main>{children}</main> */}
      {children}
      <Footer />
      {/* toggle chat window */}
      {isOpenChatWindow ? (
        <div className=" bottom-0 right-0 z-[1000] top-3/4 backdrop-blur-md rounded shadow-md left-1/2 fixed ">
          <div className="flex justify-end bg-chat-input rounded-t-md">
            <button
              // onClick={() => setIsOpenChatWindow(false)}
              onClick={handleCloseChatWindow}
              className=" text-center px-3 hover:text-red-700 text-base "
            >
              <FontAwesomeIcon icon={faClose} color="white" />
            </button>
          </div>
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
            color="blue"
            className="text-blue-600 drop-shadow-2xl hover:cursor-pointer hover:text-blue-800  "
          />
        </div>
      )}
      {/* chatbot */}

      {isOpenChatbot ? (
        <div className=" bottom-0 right-0 z-[1000] top-3/4 backdrop-blur-md rounded shadow-md left-1/2 fixed ">
          <div className="flex items-center justify-between bg-secondary-500  rounded-t-md px-2 py-2">
            <h1 className="font-bold tracking-widest ">Louis-Bot</h1>

            <button
              // onClick={() => setIsOpenChatbot(false)}
              onClick={handleCloseChatBot}
              className="  text-white hover:text-red-500 font-bold"
            >
              <FontAwesomeIcon icon={faClose} />
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
