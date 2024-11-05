import useChat from "@/hooks/useChat.hook";
import { IMessage, ISendMessage } from "@/interfaces/chat.interface";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  // Tạo một ref cho phần tử cuối cùng của danh sách tin nhắn
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Cuộn tới tin nhắn mới nhất mỗi khi messagese thay đổi
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagese]);

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

  useEffect(() => {}, [messagese]);

  return (
    <div>
      <div className="max-h-[400px] overflow-y-auto w-[400px] ">
        {messagese.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.sender_id === senderId?.toString()
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg w-[200px] ${
                msg.sender_id === senderId?.toString()
                  ? "bg-secondary-500 text-white"
                  : "bg-card-bg "
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm italic font-bold">{msg.sender_name}</p>
                <p className="text-xs text-label">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <p className="w-full text-wrap tracking-wider text-base mt-2">
                {msg.message_text}
              </p>
            </div>
          </div>
        ))}

        {/* Phần tử này để tự động cuộn tới */}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center p-2 border-t border-borderb">
        <input
          className="flex-1 p-2 border border-borderb rounded-lg bg-input text-input-text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-secondary-400 text-white rounded-lg transition"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
