import { Controller } from '@nestjs/common';
import { ChatService } from '../service/service.service';

@Controller('api/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }
}
