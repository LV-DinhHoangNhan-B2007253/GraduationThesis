export interface IOrderedProduct {
    product_id: string,
    quantity: number,
    price_at_purchase?: number
}

export interface IOrder {
    _id: string,
    user_id: string
    total_price: number,
    status: string
    order_date: Date
    shipping_address: string
    products: IOrderedProduct[]
}