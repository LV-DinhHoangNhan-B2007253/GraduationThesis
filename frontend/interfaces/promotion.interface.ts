import { IProduct } from "./product.interface"

export interface IPromotion {
    _id: string
    shop_id: string
    title: string
    description: string
    discountType: string
    promotion_banner: File
    startDate: Date
    endDate: Date
    products: string[]
}


export interface IPromotionDetail {
    _id: string
    shop_id: string
    title: string
    description: string
    discountType: string
    promotion_banner: string
    startDate: Date
    endDate: Date
    products: IProduct[]
}