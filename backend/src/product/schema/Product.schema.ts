import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";
import { Comment } from "src/auth/schema/User.schema";

@Schema({
    timestamps: false
})

@Schema()
export class Product extends Document {
    @Prop()
    name: string;

    @Prop()
    sku: string;


    // @Prop({ type: Types.ObjectId, ref: 'Category' })
    // category_id: Types.ObjectId;

    @Prop([String])
    images: string[];

    @Prop()
    price: number;

    @Prop()
    description: string;

    @Prop()
    stock_quantity: number;

    @Prop({ type: [Comment] })
    comments: Comment[];

    @Prop({ default: false })
    isOutStanding: boolean
}

export const ProductSchema = SchemaFactory.createForClass(Product);