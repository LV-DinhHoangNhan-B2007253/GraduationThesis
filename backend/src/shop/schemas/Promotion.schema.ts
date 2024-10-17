import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";

@Schema({
    timestamps: false

})


@Schema()
export class Promotion extends Document {
    @Prop()
    title: string; // tên chương trình

    @Prop()
    description: string; // mô tả chương trình

    @Prop()
    discountType: string; // loại khuyến mãi (percentage, fixed, etc.)

    @Prop({ default: '' })
    promotion_banner: string; //banner khuyến mãi

    @Prop()
    startDate: Date; // ngày bắt đầu

    @Prop()
    endDate: Date; // ngày kết thúc

    @Prop({ type: [String], default: [] }) // danh sách ID sản phẩm áp dụng
    products: string[];

}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
