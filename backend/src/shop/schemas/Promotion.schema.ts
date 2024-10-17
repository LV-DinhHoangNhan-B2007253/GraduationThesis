import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";

@Schema({
    timestamps: false

})


@Schema()
export class Promotion extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Shop', })
    shop_id: Types.ObjectId

    @Prop()
    title: string; // tên chương trình

    @Prop()
    description: string; // mô tả chương trình

    @Prop()
    discountType: string; // loại khuyến mãi (percentage, fixed, etc.)

    @Prop()
    promotion_banner: string; //banner khuyến mãi

    @Prop({ default: Date.now() })
    startDate: string; // ngày bắt đầu

    @Prop()
    endDate: string; // ngày kết thúc

    @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] }) // danh sách ID sản phẩm áp dụng
    products: Types.ObjectId[];

}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
