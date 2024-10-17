import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";
import { Address } from "./UserAdress.schema";

@Schema({
    timestamps: false
})




@Schema()
export class CartItem {
    @Prop({ type: Types.ObjectId, ref: 'Product' })
    product_id: Types.ObjectId;

    @Prop({ default: 1 })
    quantity: number;

    @Prop()
    shop_owner_id: Types.ObjectId
}

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ default: '' })
    avatarUrl: string

    @Prop({ unique: true, required: true })
    email: string;

    @Prop()
    password: string;

    @Prop({ default: '' })
    phone_number: string;

    @Prop({ enum: ['user', 'owner', 'admin'], default: 'user' })
    role: string

    @Prop({ type: Address, default: null })
    addresses: Address;

    @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
    wishlist: Types.ObjectId[];

    @Prop({ type: [CartItem], default: [] })
    cart: CartItem[];

    @Prop({ type: Types.ObjectId, default: null })
    shop_id: Types.ObjectId
}


export const UserSchema = SchemaFactory.createForClass(User);