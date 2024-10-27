import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Message {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    sender_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    receiver_id: Types.ObjectId;

    @Prop()
    message_text: string;

    @Prop()
    timestamp: Date;
}

@Schema()
export class Chat extends Document {
    @Prop({ type: [Types.ObjectId], ref: 'User' })
    participants: Types.ObjectId[];

    @Prop({ type: [Message], ref: 'Message' })
    messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);