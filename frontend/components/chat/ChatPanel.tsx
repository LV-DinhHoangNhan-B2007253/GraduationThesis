import {
  IChat,
  IMessage,
  IReceiverInfo,
  ISendMessage,
  ISingleMess,
} from "@/interfaces/chat.interface";
import { RootState } from "@/redux/store";
import {
  faMicrophone,
  faMicrophoneLinesSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// phone

// const SpeechRecognition =
//   typeof window !== "undefined"
//     ? require("react-speech-recognition").default
//     : null;
// const { useSpeechRecognition } =
//   typeof window !== "undefined"
//     ? require("react-speech-recognition")
//     : {
//         useSpeechRecognition: () => ({
//           transcript: "",
//           listening: false,
//           resetTranscript: () => {},
//           browserSupportsSpeechRecognition: false,
//         }),
//       };
// //

//

function ChatPanel({ receiverInfo }: { receiverInfo: IReceiverInfo }) {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [inputSendMessage, setInputSendMessage] = useState<any>("");
  const [message, setMessagese] = useState<ISingleMess[]>([]);
  //
  // const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  // const [transcriptText, setTranscriptText] = useState("");
  // const {
  //   transcript,
  //   listening,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition,
  // } = useSpeechRecognition();
  //voice

  // const startListening = () => {
  //   if (SpeechRecognition && browserSupportsSpeechRecognition) {
  //     SpeechRecognition.startListening({ continuous: true, language: "vi-VN" });
  //   }
  // };

  // const stopListening = () => {
  //   if (SpeechRecognition && browserSupportsSpeechRecognition) {
  //     SpeechRecognition.stopListening();
  //     resetTranscript();
  //   }
  // };
  //
  // useEffect(() => {
  //   if (transcript) {
  //     inputSendMessage(transcript);
  //     setTranscriptText(transcript);
  //   }
  // }, [transcript]);

  // // //

  // useEffect(() => {
  //   // Kiểm tra support speech recognition sau khi component mount
  //   if (typeof window !== "undefined") {
  //     setIsSpeechSupported(!!SpeechRecognition);
  //   }
  // }, []);
  //
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
    <div>
      {/* Hiển thị danh sách tin nhắn */}
      <div className="max-h-[500px] overflow-y-auto px-3">
        {message.length > 0 ? (
          message.map((message: ISingleMess, index: number) => (
            <div
              key={index}
              className={`my-2 ${
                message.sender_id === userInfo?._id ? "text-right" : "text-left"
              } `}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.sender_id === userInfo?._id
                    ? " bg-blue-500 text-white"
                    : "bg-gray-300 text-black "
                }`}
              >
                <p className="text-sm italic font-light">{`${
                  message.sender_id === userInfo?._id
                    ? "You"
                    : message.sender_name
                }`}</p>
                <p className="w-full"> {message.message_text}</p>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">Không có tin nhắn nào.</div>
        )}
      </div>

      {/* Ô nhập tin nhắn */}
      <div className="flex items-center p-2 border-t border-gray-300 dark:border-gray-600">
        <input
          type="text"
          value={inputSendMessage}
          onChange={(e) => setInputSendMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-grow border rounded-md p-2"
          placeholder="Nhập tin nhắn..."
        />
        {/* <div>
          {isSpeechSupported ? (
            <FontAwesomeIcon icon={faMicrophone} size="2x" />
          ) : (
            <FontAwesomeIcon icon={faMicrophoneLinesSlash} size="2x" />
          )}
        </div> */}
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
