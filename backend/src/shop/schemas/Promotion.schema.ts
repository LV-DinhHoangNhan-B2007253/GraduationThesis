import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";

@Schema({
    timestamps: false

})


@Schema()
export class Promotion extends Document {
    @Prop({ required: true })
    title: string; // tên chương trình

    @Prop({ required: true })
    description: string; // mô tả chương trình

    @Prop({ required: true })
    discountType: string; // loại khuyến mãi (percentage, fixed, etc.)

    @Prop({ default: '' })
    promotion_banner: string; //banner khuyến mãi

    @Prop({ required: true })
    startDate: Date; // ngày bắt đầu

    @Prop({ required: true })
    endDate: Date; // ngày kết thúc

    @Prop({ type: [String], required: true }) // danh sách ID sản phẩm áp dụng
    products: string[];

}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
