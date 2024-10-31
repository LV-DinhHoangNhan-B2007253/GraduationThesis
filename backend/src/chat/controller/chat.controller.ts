import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from '../service/chat.service';

@Controller('api/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('/getChats/:userId')
    async GetChatlistByUserid(@Param('userId') userId: string) {
        return this.chatService.getChatsByUserId(userId)
    }
}
