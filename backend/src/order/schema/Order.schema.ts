import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class OrderedProduct {
    @Prop({ type: Types.ObjectId, ref: 'Product' })
    product_id: Types.ObjectId;

    @Prop()
    quantity: number;

    @Prop()
    price_at_purchase: number;
}

@Schema()
export class Order extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user_id: Types.ObjectId;

    @Prop({ type: [OrderedProduct] })
    products: OrderedProduct[];

    @Prop()
    total_price: number;

    @Prop()
    status: string; // đã thanh toán || chưa thanh toán 

    @Prop()
    order_date: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);