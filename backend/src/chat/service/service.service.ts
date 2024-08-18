import { Injectable } from '@nestjs/common';
import { Chat } from '../schema/Chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
    @InjectModel(Chat.name) private ChatModel: Model<Chat>
}
