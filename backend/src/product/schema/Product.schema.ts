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

    @Prop({ type: Types.ObjectId, })
    shop_owner_id: Types.ObjectId

    // chương trình khuyến mãi 
    @Prop({ type: [Types.ObjectId], ref: 'Promotion', default: [] })
    promotion: Types.ObjectId[]
    // 27-10-2024
    // bổ sung số lượng đánh giá theo good, neutral, bad
    @Prop({ default: 0 })
    goodCount: number

    @Prop({ default: 0 })
    neutralCount: number

    @Prop({ default: 0 })
    badCount: number


    // loại của sản phẩm -> dùng hỗ trợ cho việc tìm kiếm

    @Prop({ default: "" })
    type: string
}

export const ProductSchema = SchemaFactory.createForClass(Product);