import useChat from "@/hooks/useChat.hook";
import { IMessage, ISendMessage } from "@/interfaces/chat.interface";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

function ChatBox({
  senderId,
  receiverId,
}: {
  senderId: string | undefined;
  receiverId: string | undefined;
}) {
  // trong sideEff -> kết nối room chat-> lắng nghe sự kiện khi tin  nhắn được gửi đi và nhận phản hồi từ server
  // hàm để gửi tin nhắn -> emit sự kiện để gửi tin nhắn
  const { message, setMessage, messagese, sendMessage } = useChat({
    senderId,
    receiverId,
  });

  const handleSendMessage = () => {
    if (message.trim() && senderId && receiverId) {
      const newMessage: ISendMessage = {
        sender_id: senderId,
        receiver_id: receiverId,
        message_text: message,
      };
      console.log(newMessage);
      console.log(
        "Are they equal?",
        senderId?.toString() === receiverId?.toString()
      );
      sendMessage(newMessage);
      setMessage(""); // Xóa ô nhập sau khi gửi
    }
  };

  useEffect(() => {
    console.log("Messages:", messagese); // Log messages to see state updates
    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);
  }, [messagese]);

  return (
    <div>
      <div className="max-h-[300px] overflow-y-auto">
        {messagese.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.sender_id?._id?.toString() === senderId?.toString()
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs ${
                msg.sender_id?._id?.toString() === senderId?.toString()
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              <p className="font-semibold">{msg.sender_id.name}</p>
              <p>{msg.message_text}</p>
              <span className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center p-2 border-t border-gray-300">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
