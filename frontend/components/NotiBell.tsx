import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Tạo kết nối socket toàn cục nếu chưa có.
const socket: Socket = io("http://localhost:3002");

function NotificationBell() {
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    // Lắng nghe sự kiện khi có tin nhắn mới.
    socket.on("receiveMessage", () => {
      setHasNewMessage(true);
    });

    // Cleanup khi component unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const handleBellClick = () => {
    // Xử lý khi người dùng bấm vào nút chuông, ví dụ: mở chatbox
    setHasNewMessage(false);
  };

  return (
    <button onClick={handleBellClick} className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-6 h-6 text-gray-600"
      >
        <path d="M12 24c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zm10-6v-7c0-4.411-3.589-8-8-8s-8 3.589-8 8v7l-2 2v1h20v-1l-2-2z" />
      </svg>
      {hasNewMessage && (
        <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}

export default NotificationBell;
