import { Type } from "@nestjs/common"
import { ObjectId } from "mongoose"

export class createProductDto {
    name: string
    sku: string
    type: string
    images: File[]
    price: number
    description: string
    stock_quantity: number
}