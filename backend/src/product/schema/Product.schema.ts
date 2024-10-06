import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";

@Schema({
    timestamps: false
})

@Schema()
export class Product extends Document {
    @Prop()
    name: string;

    @Prop()
    sku: string; // mã sản phẩm

    @Prop([String])
    images: string[]; // danh sách hình ảnh của sản phẩm

    @Prop()
    price: number;

    @Prop()
    description: string;

    @Prop()
    stock_quantity: number; //số lượng hiện có

    @Prop({ default: false })
    isOutStanding: boolean

    @Prop({ default: 0, min: 0 })
    sold_quantity: number // đã bán bao nhiêu

    @Prop({ default: 0, min: 0, max: 5 })
    averageRating: number; // Điểm đánh giá trung bình

    @Prop({ default: 0, min: 0 })
    ratingCount: number; // Số lượng đánh giá

    @Prop({ type: [Types.ObjectId], ref: 'Comment', default: [] })
    comments: Types.ObjectId[]; // Danh sách bình luận của sản phẩm

    @Prop({ type: Types.ObjectId, ref: 'Shop' })
    shop_owner_id: Types.ObjectId

    // chương trình khuyến mãi 
    @Prop({ type: [Types.ObjectId], ref: 'Promotion', default: [] })
    promotion: Types.ObjectId[]
}

export const ProductSchema = SchemaFactory.createForClass(Product);