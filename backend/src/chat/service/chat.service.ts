import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat, Message } from '../schema/Chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/auth/service/user.service';
import path from 'path';
import { CreateMessageDto } from '../dtos/createMessage.dto';
import { time } from 'console';



@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private ChatModel: Model<Chat>,
        private readonly UserService: UserService
    ) { }



    // Lưu tin nhắn vào cơ sở dữ liệu
    async saveMessage(message: CreateMessageDto) {
        const { sender_id, receiver_id, message_text } = message
        let chat = await this.ChatModel.findOne({
            participants: { $all: [sender_id, receiver_id] }
        }).populate('messages.sender_id', 'name avatarUrl')
        // nếu chưa có hội thoại
        if (!chat) {
            chat = new this.ChatModel({
                participants: [sender_id, receiver_id],
                messages: []
            })
        }
        const user = await this.UserService.getUserInfoById(sender_id)

        // trường hợp đã có
        const newMessage = {
            sender_id: new Types.ObjectId(sender_id),
            receiver_id: new Types.ObjectId(receiver_id),
            message_text,
            timestamp: new Date(),
            sender_name: user.name,
            sender_avatar: user.avatarUrl

        }
        chat.messages.push(newMessage)
        await chat.save()

        return newMessage
    }



    async getChatHistory(senderId: string, receiverId: string) {

        try {
            const chat = await this.ChatModel.findOne({ participants: { $all: [senderId, receiverId] } })
                .populate('messages.sender_id', 'name avatarUrl') // Populate thông tin người gửi


            const formattedMessages = chat ? chat.messages.map((message) => ({
                sender_name: (message.sender_id as any).name,
                sender_avatar: (message.sender_id as any).avatarUrl,
                sender_id: (message.sender_id as any)._id,
                receiver_id: message.receiver_id,
                message_text: message.message_text,
                timestamp: message.timestamp
                // sender_name: message
            })) : []

            return formattedMessages

            // return chat ? chat.messages : []

        } catch (error) {
            console.log(error);

        }
    }


    // 
    async getChatsByUserId(userId: string): Promise<any[]> {
        try {
            const chats = await this.ChatModel.find({ participants: userId }).populate({
                path: 'participants',
                select: "name avatarUrl"
            }).populate({
                path: 'messages.receiver_id',
                select: 'name avatarUrl', // Select sender details
            })

            if (!chats || chats.length === 0) {
                console.log("chưa có chat của user");

                return null
            }
            // const data = chats.map(chat => ({

            //     receiverInfo: chat.participants[0],
            //     messages: chat.messages.map(message => ({
            //         message_text: message.message_text,
            //         sender_id: message.sender_id,
            //         receiver_id: message.receiver_id._id,
            //         timestamp: message.timestamp,

            //     }))
            // }))

            // return data
            const data = chats.map(chat => {
                // Tìm người nhận (người không phải là userId)
                const receiverInfo = chat.participants.find(participant => participant._id.toString() !== userId);

                return {
                    receiverInfo: receiverInfo, // Trả về thông tin người nhận
                    messages: chat.messages.map(message => ({
                        message_text: message.message_text,
                        sender_id: message.sender_id,
                        receiver_id: message.receiver_id._id,
                        timestamp: message.timestamp,
                    }))
                };
            });

            return data;
        } catch (error) {
            console.log(error);

        }

    }
}

/**
 * thôn tin người nhận {
 *      tên,hình,id
 * }
 * mảng chat:[
 * {thôn ti đoạn chat:{id người gửi, id người nhận, nội dung, thời gian}}
 * ]
 */