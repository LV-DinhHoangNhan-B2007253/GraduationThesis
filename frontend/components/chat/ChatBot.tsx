"use client";
import { RootState } from "@/redux/store";
import { MessToChatbot } from "@/services/chatbot.service"; // Chatbot API service
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface Product {
  name?: string;
  price?: number;
  url?: string;
  product_id?: string;
}

interface Category {
  name: string | null;
  category_id: string | null;
  product_quantity: number | null;
}

interface IChatBotMessage {
  text: string;
  sender: "user" | "bot";
  product?: Product[] | null;
  list_text?: string[] | null;
  sub_link_url?: string | null;
  sub_link_name?: string | null;
  categories?: Category[] | null;
}

function ChatBot() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { isLogin } = useSelector((state: RootState) => state.userLoginState);

  const [messages, setMessages] = useState<IChatBotMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const [isTyping, setIsTyping] = useState<boolean>(false); // Check if the bot is typing
  const scrollIntoView = useRef<HTMLDivElement | null>(null); // Scroll to the latest message

  // Khi component được render lần đầu, lấy lịch sử tin nhắn từ sessionStorage
  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Nếu không có lịch sử, hiển thị tin nhắn chào hỏi mặc định
      const initialMessage: IChatBotMessage = {
        text:
          userInfo && isLogin === true
            ? `Chào bạn ${userInfo.name}! Mình là Louis, nhân viên của sàn HNE-commerce, mình có thể giúp gì cho bạn? Đừng ngần ngại hỏi mình nhé`
            : "Xin chào quý khách, Mình là Louis, nhân viên của sàn HNE-commerce, mình có thể giúp gì cho bạn? Đừng ngần ngại hỏi mình nhé",
        sender: "bot",
      };
      setMessages([initialMessage]);
    }
  }, [userInfo, isLogin]);

  // Sử dụng useEffect để cuộn khi messages thay đổi
  useEffect(() => {
    // Kiểm tra nếu scrollIntoView hiện tại đã được gắn
    if (scrollIntoView.current) {
      // Cuộn tới phần tử có ref
      scrollIntoView.current.scrollIntoView({
        behavior: "smooth", // Cuộn mượt mà
        block: "end", // Cuộn đến cuối phần tử
      });
    }
  }, [messages]); // Hook này chạy lại mỗi khi `messages` thay đổi

  const handleSendMessage = async () => {
    if (!input.trim()) return; // Check if input is empty

    const newMessage: IChatBotMessage = {
      text: input,
      sender: "user",
    };

    // Add user's message to chat
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      sessionStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // Lưu lịch sử vào sessionStorage
      return updatedMessages;
    });
    setInput(""); // Clear the input after sending
    setIsTyping(true); // Show typing effect while waiting for bot's response

    try {
      // Send message to chatbot API and get the response
      const sendForm = {
        sender: "user",
        message: input,
        metadata: {
          userId: userInfo ? userInfo._id : null,
        },
      };

      const response = await MessToChatbot(sendForm);
      console.log("phản hồi của chatbot", response);

      // Trích xuất phản hồi của chatbot, bao gồm cả thông điệp và sản phẩm
      const extractResponse: IChatBotMessage = {
        text: response[0].text, // Dòng văn bản từ bot
        sender: "bot",
        product: response[1]?.custom?.product || null, // Nếu có sản phẩm, lưu vào product
        list_text: response[1]?.custom?.list_text || null,
        sub_link_name: response[1]?.custom?.sub_link_name || null,
        sub_link_url: response[1]?.custom?.sub_link_url || null,
        categories: response[1]?.custom?.category || null,
      };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, extractResponse];
        sessionStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // Lưu lịch sử vào sessionStorage
        return updatedMessages;
      });

      // Stop the typing effect when the bot responds
      setIsTyping(false);

      // Scroll to the bottom of the chat
      scrollIntoView.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.log("Error sending message to chatbot:", error);
    }
  };

  return (
    <div className="h-full">
      <div className="h-[90%] overflow-y-auto p-4">
        {/* Display chat messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 ${msg.sender === "user" ? "text-right" : ""}`}
          >
            {msg.sender === "bot" ? (
              <div className="flex items-center gap-2">
                <img
                  src="/chatbot.png"
                  alt="Chatbot logo"
                  className="w-10 h-10 bg-white rounded-full"
                />
                <div className="bg-bot-msg text-black inline-block max-w-[80%] p-2 rounded-md min-w-[30%] shadow-sm">
                  <span className="italic text-sm font-light">Louis</span>
                  <p className="text-left text-wrap text-base">{msg.text}</p>
                  {msg.list_text && (
                    <ul>
                      {msg.list_text.map((text, index) => (
                        <li key={index}>
                          {" "}
                          <span> - </span>
                          {text}
                        </li>
                      ))}
                    </ul>
                  )}
                  {msg.product && (
                    <div>
                      <div>
                        {msg.product.map((product: Product, index) => (
                          <div
                            key={index}
                            className="px-2 py-1 w-full mb-1 border border-primary-border rounded-sm"
                          >
                            <p className="font-light text-small italic">
                              {product.name} - {product.price}$
                            </p>
                            <Link
                              className="block text-end text-sm underline text-secondary-400"
                              href={`${product.url}`}
                              target="_blank"
                            >
                              xem hình ảnh
                            </Link>
                            <Link
                              className="block text-end text-sm underline text-secondary-400"
                              href={`/product/${product.product_id}`}
                            >
                              chi tiết sản phẩm
                            </Link>
                          </div>
                        ))}
                      </div>
                      {msg.sub_link_url && msg.sub_link_url && (
                        <div>
                          <Link
                            className="block text-sm text-primary-500 italic hover:underline"
                            href={`${msg.sub_link_url}`}
                          >
                            <p>{msg.sub_link_name}</p>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-secondary-200 text-white inline-block max-w-[80%] p-2 rounded-md min-w-[30%] shadow-sm">
                <span className="italic text-sm font-light">Bạn</span>
                <p className="text-left text-wrap text-base">{msg.text}</p>
              </div>
            )}
          </div>
        ))}

        {/* Typing animation for the bot */}
        {isTyping && (
          <div className="mb-3 text-left">
            <div className="flex items-start">
              <img
                src="/chatbot.png" // Path to your chatbot image
                alt="Chatbot"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="inline-block p-2 rounded-lg max-w-xs bg-gray-300 text-black">
                <div className="animate-pulse">
                  <span className="text-gray-500">.</span>
                  <span className="text-gray-500">.</span>
                  <span className="text-gray-500">.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll to bottom */}
        <div ref={scrollIntoView}></div>
      </div>

      {/* Input box and send button */}
      <div className="flex items-center p-2 border-t border-gray-300 h-[10%]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-grow border rounded-md p-2 bg-input text-input-text outline-none"
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

export default ChatBot;
