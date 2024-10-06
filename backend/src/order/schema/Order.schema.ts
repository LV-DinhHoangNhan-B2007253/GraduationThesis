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

    @Prop({ enum: ['pending', 'delivery', 'shipped', 'canceled'], default: 'pending' })
    status: string; // đã thanh toán || chưa thanh toán 

    @Prop({ enum: ['unpaid', 'paid'], default: 'unpaid' })
    payment_status: string; // Trạng thái thanh toán

    @Prop({ enum: ['cash', 'vnpay', 'momo', 'zalopay'], required: true })
    payment_method: string; // Phương thức thanh toán

    @Prop({ default: Date.now })
    order_date: Date;

    @Prop()
    shipping_address: string;

}

export const OrderSchema = SchemaFactory.createForClass(Order);