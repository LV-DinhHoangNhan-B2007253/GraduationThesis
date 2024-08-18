import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";

@Schema({
    timestamps: false
})

export class Address {
    @Prop()
    street: string;
    @Prop()
    city: string;
}

@Schema()
export class Reply {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user_id: Types.ObjectId;

    @Prop()
    reply_text: string;

    @Prop()
    date: Date;
}

@Schema()
export class Comment {
    @Prop({ type: Types.ObjectId, ref: 'Product' })
    product_id: Types.ObjectId;

    @Prop()
    comment_text: string;

    @Prop()
    rating: number;

    @Prop()
    date: Date;

    @Prop({ type: [Reply] })
    replies: Reply[];
}

@Schema()
export class CartItem {
    @Prop({ type: Types.ObjectId, ref: 'Product' })
    product_id: Types.ObjectId;

    @Prop()
    quantity: number;
}

@Schema()
export class User extends Document {
    @Prop()
    name: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop()
    phone_number: string;

    @Prop({ default: 1 })
    role: number // 1 === user role, 0 === admin role

    @Prop({ type: Address })
    addresses: Address;

    @Prop({ type: [Types.ObjectId], ref: 'Product' })
    wishlist: Types.ObjectId[];

    @Prop({ type: [CartItem] })
    cart: CartItem[];

    @Prop({ type: [Types.ObjectId], ref: 'Order' })
    orders: Types.ObjectId[];

    @Prop({ type: [Comment] })
    comments: Comment[];
}


export const UserSchema = SchemaFactory.createForClass(User);