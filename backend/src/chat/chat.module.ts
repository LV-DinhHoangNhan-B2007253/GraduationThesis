import { Module } from '@nestjs/common';
import { ChatController } from './controller/chat.controller';
import { ChatService } from './service/chat.service';
import { Chat, ChatSchema } from './schema/Chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat-gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]), AuthModule]
})
export class ChatModule { }
