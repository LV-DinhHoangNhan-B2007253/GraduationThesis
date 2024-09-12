import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import mongoose, { Document, Types } from "mongoose";

@Schema({
    timestamps: false
})

@Schema()
export class Category extends Document {
    @Prop()
    name: string;

    @Prop({ type: [Types.ObjectId], ref: 'CategoryItem', default: [] })
    categoryItem: Types.ObjectId[];

    @Prop({ default: '' })
    banner: string
}

export const CategorySchema = SchemaFactory.createForClass(Category);