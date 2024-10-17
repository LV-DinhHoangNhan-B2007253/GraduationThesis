import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Comment extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user_id: Types.ObjectId; // Người dùng viết bình luận

    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    product_id: Types.ObjectId; // Sản phẩm mà bình luận thuộc về

    @Prop({ required: true })
    content: string; // Nội dung bình luận

    @Prop({ default: Date.now })
    created_at: Date; // Ngày viết bình luận

    @Prop({ default: 0, min: 0, max: 5 })
    rating: number; // Đánh giá (0-5 sao)

    @Prop({ default: [] })
    review_img: string[]
}

export const CommentSchema = SchemaFactory.createForClass(Comment);