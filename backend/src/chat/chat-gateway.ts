import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './service/chat.service';

import { Server, Socket } from 'socket.io'
import { UserService } from 'src/auth/service/user.service';
import { CreateMessageDto } from './dtos/createMessage.dto';
@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly chatService: ChatService,
        private readonly UserService: UserService

    ) { }
    @WebSocketServer() server: Server


    // Kết nối người dùng
    async handleConnection(client: Socket) {
        console.log(`User connected: ${client.id}`);
    }

    // Ngắt kết nối người dùng
    handleDisconnect(client: Socket) {
        console.log(`User disconnected: ${client.id}`);
    }

    // Tham gia vào room
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { senderId: string; receiverId: string }
    ) {
        const { senderId, receiverId } = data
        const roomId = this.getRoomId(senderId, receiverId);
        client.join(roomId);

        console.log(`User ${data.senderId} joined room ${roomId}`);

        const chatHistory = await this.chatService.getChatHistory(senderId, receiverId);


        this.server.to(roomId).emit('chatHistory', chatHistory);

    }

    // Xử lý khi nhận tin nhắn mới
    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: CreateMessageDto
    ) {
        const { sender_id, receiver_id, message_text } = message;


        const roomId = this.getRoomId(sender_id, receiver_id);



        const savedMessage = await this.chatService.saveMessage(message);

        console.log("saveMess", savedMessage);

        // this.server.to(roomId).emit('receiveMessage', savedMessage);
        this.server.to(roomId).emit('receiveMessage', savedMessage);



    }

    // Tạo ID cho room từ senderId và receiverId
    private getRoomId(user1: string, user2: string): string {
        return [user1, user2].sort().join('_');
    }
}

