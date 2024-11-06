import { IChat, IMessage } from "@/interfaces/chat.interface";
import { RootState } from "@/redux/store";
import { GetChatsByUserId } from "@/services/chat.service";
import React, { useEffect, useRef, useState } from "react";
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
    <div className="grid grid-cols-12 h-full max-h-[85vh] min-h-[85vh] gap-1">
      {/* Phần danh sách người dùng chat */}
      <div className="col-span-3 bg-chat-panel overflow-y-auto h-full">
        {chats &&
          chats.map((chat) => (
            <div
              key={chat.receiverInfo._id}
              className="flex items-center gap-1 w-full bg-secondary-200 px-2 py-1 mb-1 hover:bg-secondary-400 cursor-pointer rounded-sm"
              onClick={() => handleChatSelect(chat)}
            >
              <img
                loading="lazy"
                src={
                  chat.receiverInfo.avatarUrl != ""
                    ? chat.receiverInfo.avatarUrl
                    : "/default-avatar.png"
                }
                alt={chat.receiverInfo.name}
                className="min-w-[20px] min-h-[20px] max-w-[40px] max-h-[40px] rounded-full"
              />
              <div className="flex flex-col gap-1">
                <p className="text-ellipsis truncate font-bold text-base">
                  {chat.receiverInfo.name}
                </p>
                <p className="italic font-light text-ellipsis truncate text-sm text-gray-500">
                  {chat.messages[chat.messages.length - 1].message_text}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Phần nội dung chat */}
      <div className=" col-span-9">
        {selectedChat ? (
          <div className="h-full max-h-[85vh] min-h-[85vh]">
            <ChatPanel receiverInfo={selectedChat.receiverInfo} />
          </div>
        ) : (
          <h1 className="text-center font-bold text-heading uppercase ">
            Chọn một hội thoại để bắt đầu trò chuyện
          </h1>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
