import { Injectable } from '@nestjs/common';
import { Chat, Message } from '../schema/Chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/auth/service/user.service';
import path from 'path';
import { CreateMessageDto } from '../dtos/createMessage.dto';



@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private ChatModel: Model<Chat>,
    ) { }



    // Lưu tin nhắn vào cơ sở dữ liệu
    async saveMessage(message: CreateMessageDto) {
        const { sender_id, receiver_id, message_text } = message
        let chat = await this.ChatModel.findOne({
            participants: { $all: [sender_id, receiver_id] }
        })
        // nếu chưa có hội thoại
        if (!chat) {
            chat = new this.ChatModel({
                participants: [sender_id, receiver_id],
                messages: []
            })
        }
        // trường hợp đã có
        const newMessage: Message = {
            sender_id: new Types.ObjectId(sender_id),
            receiver_id: new Types.ObjectId(receiver_id),
            message_text,
            timestamp: new Date()
        }
        chat.messages.push(newMessage)
        await chat.save()
        return newMessage
    }



    async getChatHistory(senderId: string, receiverId: string) {
        const chat = await this.ChatModel
            .findOne({ participants: { $all: [senderId, receiverId] } })
            .populate('participants', 'name avatarUrl') // lấy thông tin người dùng
            .populate('messages.sender_id', 'name avatarUrl')
            .populate('messages.receiver_id', 'name avatarUrl');

        // Return the messages array, or an empty array if no chat exists
        return chat ? chat.messages : [];
    }
}
