
import { IMessage, ISendMessage } from "@/interfaces/chat.interface";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";


function useChat({ senderId, receiverId }: { senderId: string | undefined, receiverId: string | undefined }) {
    // chat log
    const [messagese, setMessagese] = useState<IMessage[]>([])
    // 
    const [message, setMessage] = useState('')
    // const socket: Socket = io("http://localhost:3002")

    // socket
    const socketRef = useRef<Socket | null>(null);


    // const sendMessage = (message: ISendMessage) => {

    //     socket.emit('sendMessage', message)
    //     setMessage('')
    // }
    const sendMessage = (message: ISendMessage) => {
        if (socketRef.current) {
            socketRef.current.emit('sendMessage', message);
            setMessage('');
        }
    };
    // const joinRoom = () => {
    //     if (senderId && receiverId) {
    //         socket.emit('joinRoom', { senderId, receiverId });

    //         socket.on('chatHistory', (history: IMessage[]) => {
    //             setMessagese(history); // Ghi đè bằng lịch sử chat từ server
    //             console.log('Received chat history:', history);
    //         });
    //     }
    // };
    const joinRoom = () => {
        if (senderId && receiverId && socketRef.current) {
            socketRef.current.emit('joinRoom', { senderId, receiverId });

            // Nhận lịch sử chat từ server
            socketRef.current.on('chatHistory', (history: IMessage[]) => {
                setMessagese(history);
                console.log('Received chat history:', history);
            });
        }
    };
    useEffect(() => {
        // Khởi tạo socket chỉ nếu chưa có socket kết nối
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:3002");

            // Chỉ thực hiện joinRoom khi senderId và receiverId có giá trị
            if (senderId && receiverId) {
                socketRef.current.emit('joinRoom', { senderId, receiverId });

                // Nhận lịch sử chat từ server
                socketRef.current.on('chatHistory', (history: IMessage[]) => {
                    setMessagese(history);
                    console.log('Received chat history:', history);
                });
            }

            // Lắng nghe sự kiện nhận tin nhắn
            socketRef.current.on('receiveMessage', (res) => {
                // const formattedMessage = {
                //     ...res,
                //     sender_id: {
                //         ...res.sender_id,
                //         id: res.sender_id && res.sender_id._id ? res.sender_id._id.toString() : "",
                //     },
                // };
                setMessagese((prevMessages) => [...prevMessages, res]);
            });
        }

        return () => {
            // Ngắt kết nối khi component unmount
            if (socketRef.current) {
                socketRef.current.off('joinRoom');
                socketRef.current.off('receiveMessage');
                socketRef.current.off('chatHistory');
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [senderId, receiverId])



    return {
        messagese,
        message,
        setMessage,
        sendMessage,
        // joinRoom
    }
}

export default useChat