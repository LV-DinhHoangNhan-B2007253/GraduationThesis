class orderedProduct {
    product_id: string;
    quantity: number;
    price_at_purchase: number;
}

export class createOrderDto {
    user_id: string;
    products: orderedProduct[]
    total_price: number
    shipping_address: string
}