import { Module } from '@nestjs/common';
import { ChatController } from './controller/controller.controller';
import { ChatService } from './service/service.service';
import { Chat, ChatSchema } from './schema/Chat.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])]
})
export class ChatModule { }
