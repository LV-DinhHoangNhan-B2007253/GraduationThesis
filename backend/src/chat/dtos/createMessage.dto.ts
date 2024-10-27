// dto/create-message.dto.ts
import { Types } from 'mongoose';

export class CreateMessageDto {
    sender_id: string;
    receiver_id: string;
    message_text: string;
}