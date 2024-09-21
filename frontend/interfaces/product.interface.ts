import { IComment } from "./comment.interface";

export interface IProduct {
    _id: string
    name: string;
    sku: string
    images: string[]
    price: number,
    stock_quantity: number
    isOutStanding: boolean
    comment: IComment[]
    description: string

}

export interface ICreateProduct {
    name: string
    sku: string
    images: File[]
    price: number
    description: string
    stock_quantity: number
}

export interface ICartItem {
    product_id: string,
    quantity: number
    _id: string
}

export interface IUpdateProductForm {
    name: string | undefined,
    price: number | undefined
    description: string | undefined,
    stock_quantity: number | undefined,
    sku: string | undefined
    isOutStanding: boolean
}