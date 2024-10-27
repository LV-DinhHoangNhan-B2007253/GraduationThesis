import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import mongoose, { Document, Types } from "mongoose";

@Schema({
    timestamps: false
})

@Schema()
export class CategoryItem extends Document {
    @Prop()
    name: string;

    @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
    products: Types.ObjectId[];

    // danh mục thuộc shop nào
    @Prop({ type: Types.ObjectId, ref: "Shop", required: true })
    shop_creator_id: Types.ObjectId

    @Prop({ default: '' })
    banner: string
}

export const CategoryItemSchema = SchemaFactory.createForClass(CategoryItem);