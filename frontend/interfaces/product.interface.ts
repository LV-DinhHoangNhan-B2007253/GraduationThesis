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