import { IChat, IMessage } from "@/interfaces/chat.interface";
import { RootState } from "@/redux/store";
import { GetChatsByUserId } from "@/services/chat.service";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatPanel from "./ChatPanel";

function ChatWindow() {
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [chats, setchats] = useState<IChat[]>();
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null); // Trạng thái cho cuộc chat đã chọn

  const getChats = async () => {
    try {
      const data = await GetChatsByUserId(userInfo?._id as string);
      if (data) {
        setchats(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  //
  const handleChatSelect = (chat: IChat) => {
    setSelectedChat(chat); // Đặt chat đã chọn
  };
  //
  return (
    <div className="h-full  text-center  grid grid-cols-12 backdrop-blur-md gap-4 px-1">
      {/* Phần danh sách người dùng chat */}
      <div className="overflow-y-auto col-span-3 bg-light-modal-popup dark:bg-dark-modal-popup shadow-lg rounded-md h-full">
        {chats &&
          chats.map((chat) => (
            <div
              key={chat.receiverInfo._id}
              className="flex items-center p-2 gap-2 cursor-pointer hover:opacity-80 bg-emerald-300 mb-1 dark:bg-emerald-700"
              onClick={() => handleChatSelect(chat)}
            >
              <img
                src={
                  chat.receiverInfo.avatarUrl != ""
                    ? chat.receiverInfo.avatarUrl
                    : "/default-avatar.png"
                }
                alt={chat.receiverInfo.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <span className="text-orange-500 dark:text-white">
                {chat.receiverInfo.name}
              </span>
            </div>
          ))}
      </div>

      {/* Phần nội dung chat */}
      <div className="col-span-9 bg-light-modal-popup dark:bg-dark-modal-popup shadow-lg rounded-md  ">
        {selectedChat ? (
          <div className="h-[90%]">
            <ChatPanel receiverInfo={selectedChat.receiverInfo} />
          </div>
        ) : (
          <div className="text-clip italic font-light text-light-primary-text dark:text-dark-primary-text">
            Select a chat
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
