import React from "react";

function ChatBot() {
  return (
    <div className="h-full">
      <div className="h-[90%] overflow-y-auto">Phần chat</div>
      <div className="flex items-center p-2 border-t border-borderb h-[10%]">
        <input
          type="text"
          // value={inputSendMessage}
          // onChange={(e) => setInputSendMessage(e.target.value)}
          // onKeyPress={(e) => {
          //   if (e.key === "Enter") {
          //     handleSendMessage();
          //   }
          // }}
          className="flex-grow border rounded-md p-2 bg-input text-input-text"
          placeholder="Nhập tin nhắn..."
        />

        <button
          // onClick={handleSendMessage}
          className="ml-2 bg-secondary-500 text-white px-4 py-2 rounded-md"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
