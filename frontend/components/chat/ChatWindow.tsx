import React, { useEffect } from "react";

function ChatWindow() {
  useEffect(() => {
    console.log("chat mount!");
    return () => {
      console.log("chat unmount");
    };
  }, []);
  return (
    <div className="w-full h-full text-center min-h-[500px] grid grid-cols-12 backdrop-blur-md gap-4 px-1">
      <div className="col-span-3  bg-light-modal-popup dark:bg-dark-modal-popup shadow-lg rounded-md"></div>
      <div className="col-span-9 bg-light-modal-popup dark:bg-dark-modal-popup shadow-lg rounded-md"></div>
    </div>
  );
}

export default ChatWindow;
