import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import mongoose, { Document, Types } from "mongoose";

@Schema({
    timestamps: false
})

@Schema()
export class Category extends Document {
    @Prop()
    name: string;

    @Prop({ type: [Types.ObjectId], ref: 'Product' })
    products: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);