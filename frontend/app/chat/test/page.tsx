"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  senderId: string;
  receiverId: string;
  messageText: string;
}

const socket: Socket = io("http://localhost:3002"); // Point to your NestJS server

const senderId = "66fd5a079e79f4607dff701c"; // ID của người gửi
const receiverId = "6700186e7a1574208261dab9"; // ID của người nhận

export default function ChatComponent() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    // Tham gia phòng chat khi component được mount
    startChat();

    // Lắng nghe sự kiện phản hồi từ server
    socket.on("phanhoi", (res) => {
      console.log(res);
    });

    // Lắng nghe sự kiện nhận tin nhắn
    socket.on("newMessage", (res) => {
      console.log(res);

      setMessages((prevMessages) => [...prevMessages, res.message]);
      console.log(messages);
    });

    // Dọn dẹp sự kiện khi component unmounts
    return () => {
      socket.off("newMessage");
      socket.off("phanhoi");
    };
  }, []);

  const startChat = async () => {
    await socket.emit("joinRoom", {
      senderId: senderId,
      receiverId: receiverId,
    });
  };

  const sendMessage = () => {
    const messageData: Message = {
      senderId: senderId, // ID của người gửi
      receiverId: receiverId, // ID của người nhận
      messageText: newMessage,
    };

    socket.emit("sendMessage", messageData);
    console.log("emit message", messageData);

    setNewMessage(""); // Xóa nội dung input sau khi gửi
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
