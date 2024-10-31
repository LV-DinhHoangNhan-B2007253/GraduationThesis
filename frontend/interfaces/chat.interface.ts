export interface IUserMessage {
    _id: string; // ObjectId
    name: string;
    avatarUrl: string;
}



export interface ISendMessage {
    sender_id: string | undefined;
    receiver_id: string | undefined;
    message_text: string;
}

export interface IMessage {
    sender_id: IUserMessage;
    receiver_id: IUserMessage;
    message_text: string;
    timestamp: Date; // Hoặc string tùy thuộc vào cách bạn nhận dữ liệu
    // _id: string; // ObjectId
}
export interface IReceiverInfo {
    _id: string,
    name: string,
    avatarUrl: string
}


export interface ISingleMess {
    sender_id: string;
    receiver_id: string;
    message_text: string;
    timestamp: Date; // Hoặc string tùy thuộc vào cách bạn nhận dữ liệu
    // _id: string; // ObjectId
    sender_name: string,
    sender_avatar: string
}
export interface IChat {
    receiverInfo: IReceiverInfo
    messages: ISingleMess[]
}