import { RootState } from "@/redux/store";
import { MessToChatbot } from "@/services/chatbot.service"; // Chatbot API service
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

interface IChatBotMessage {
  text: string;
  sender: "user" | "bot";
  url?: string | null;
}

function ChatBot() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { isLogin } = useSelector((state: RootState) => state.userLoginState);
  const [messages, setMessages] = useState<IChatBotMessage[]>([
    {
      text:
        userInfo && isLogin === true
          ? `Chào bạn ${userInfo.name}! Mình là Louis, nhân viên của sàn HNE-commerce, mình có thể giúp gì cho bạn? Đừng ngần ngại hỏi mình nhé`
          : "Xin chào quý khách, Mình là Louis, nhân viên của sàn HNE-commerce, mình có thể giúp gì cho bạn? Đừng ngần ngại hỏi mình nhé",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false); // Check if the bot is typing

  const scrollIntoView = useRef<HTMLDivElement | null>(null); // Scroll to the latest message

  const handleSendMessage = async () => {
    if (!input.trim()) return; // Check if input is empty

    const newMessage: IChatBotMessage = {
      text: input,
      sender: "user",
    };

    // Add user's message to chat
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput(""); // Clear the input after sending
    setIsTyping(true); // Show typing effect while waiting for bot's response

    try {
      // Send message to chatbot API and get the response
      const sendForm = {
        sender: "user",
        message: input,
      };
      const response = await MessToChatbot(sendForm);

      const botMessage: IChatBotMessage = {
        text: response[0].text,
        sender: "bot",
      };

      // Update bot's response to the chat
      setMessages((prevMessages) => [...prevMessages, botMessage]);

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
                  alt="Chatbor logo"
                  className="w-10 h-10 bg-white rounded-full"
                />
                <div className="bg-bot-msg text-black inline-block max-w-[80%] p-2 rounded-md min-w-[30%] shadow-sm">
                  <span className="italic text-sm font-light">Louis</span>
                  <p className="text-left text-wrap text-base">{msg.text}</p>
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
