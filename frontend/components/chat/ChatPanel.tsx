import {
  IReceiverInfo,
  ISendMessage,
  ISingleMess,
} from "@/interfaces/chat.interface";
import { RootState } from "@/redux/store";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

function ChatPanel({ receiverInfo }: { receiverInfo: IReceiverInfo }) {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [inputSendMessage, setInputSendMessage] = useState<any>("");
  const [message, setMessagese] = useState<ISingleMess[]>([]);
  // Tham chiếu tới phần tử cuối danh sách tin nhắn để cuộn tới
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  //   tạo socket
  const socketRef = useRef<Socket | null>(null);

  const sendMessage = (message: ISendMessage) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", message);
      setInputSendMessage("");
    }
  };

  const handleSendMessage = () => {
    if (inputSendMessage.trim() && userInfo?._id && receiverInfo._id) {
      const newMessage: ISendMessage = {
        sender_id: userInfo?._id,
        receiver_id: receiverInfo._id,
        message_text: inputSendMessage,
      };
      // console.log(newMessage);
      sendMessage(newMessage);

      setInputSendMessage(""); // Xóa ô nhập sau khi gửi
    }
  };

  // Auto-scroll tới tin nhắn mới nhất khi `message` thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  useEffect(() => {
    // Khởi tạo socket chỉ nếu chưa có socket kết nối
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3002");

      // Chỉ thực hiện joinRoom khi senderId và receiverId có giá trị
      if (userInfo?._id && receiverInfo._id) {
        const senderId = userInfo._id;
        const receiverId = receiverInfo._id;
        socketRef.current.emit("joinRoom", { senderId, receiverId });

        // Nhận lịch sử chat từ server
        socketRef.current.on("chatHistory", (history: ISingleMess[]) => {
          setMessagese(history);
          // console.log("Received chat history:", history);
        });
      }

      // Lắng nghe sự kiện nhận tin nhắn
      socketRef.current.on("receiveMessage", (res) => {
        console.log("Received message:", res);
        setMessagese((prevMessages) => [...prevMessages, res]);
      });
    }
    console.log(receiverInfo);
    return () => {
      if (socketRef.current) {
        socketRef.current.off("joinRoom");
        socketRef.current.off("receiveMessage");
        socketRef.current.off("chatHistory");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [receiverInfo._id, userInfo?._id]);

  return (
    <div className="h-full bg-chat-panel">
      {/* Hiển thị danh sách tin nhắn */}
      <div className="overflow-y-auto h-[90%] mx-2">
        {message.length > 0 ? (
          message.map((message: ISingleMess, index: number) => (
            <div
              key={index}
              className={`my-2 ${
                message.sender_id === userInfo?._id ? "text-right" : "text-left"
              } `}
            >
              <div
                className={`inline-block min-w-[150px] text-wrap px-4 py-2 rounded-lg ${
                  message.sender_id === userInfo?._id
                    ? " bg-secondary-300 text-white"
                    : "bg-bot-msg text-black "
                }`}
              >
                <div className="flex items-center gap-3">
                  <p className="text-sm italic font-bold">{`${
                    message.sender_id === userInfo?._id
                      ? "You"
                      : message.sender_name
                  }`}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <p className="w-full text-wrap tracking-wider text-base mt-2">
                  {" "}
                  {message.message_text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-heading uppercase ">
            Chưa có tin nhắn nào! Trò chuyện ngay thôi.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ô nhập tin nhắn */}
      <div className="flex items-center p-2 border-t border-borderb h-[10%] bg-chat-input">
        <input
          type="text"
          value={inputSendMessage}
          onChange={(e) => setInputSendMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-grow border rounded-md p-2 bg-input text-input-text"
          placeholder="Nhập tin nhắn..."
        />

        <button
          onClick={handleSendMessage}
          className="ml-2 bg-secondary-500 text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-accent"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
