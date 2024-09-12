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
}

export const CategoryItemSchema = SchemaFactory.createForClass(CategoryItem);