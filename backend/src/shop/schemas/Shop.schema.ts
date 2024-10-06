import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";

@Schema({
    timestamps: false

})


@Schema()
export class Shop {
    @Prop({ required: true })
    name: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    owner: Types.ObjectId; // Liên kết với User

    @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
    products: Types.ObjectId[]; // Các sản phẩm trong shop

    @Prop({ default: '' })
    logoUrl: string;

    @Prop()
    shopBanner: string

    @Prop({ default: true })
    isActive: boolean; // Để quản lý trạng thái hoạt động của shop (có thể tắt shop nếu cần)

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ unique: true })
    shopMail: string

    @Prop()
    shopPhone: string

    @Prop()

    shopLocation: string

}

export const ShopSchema = SchemaFactory.createForClass(Shop);
