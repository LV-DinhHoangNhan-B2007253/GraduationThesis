import { IProduct } from "./product.interface"

export interface IPromotion {
    _id: string
    shop_id: string
    title: string
    description: string
    discountType: string
    promotion_banner: File
    startDate: string
    endDate: string
    products: string[]
}


export interface IPromotionDetail {
    _id: string
    shop_id: string
    title: string
    description: string
    discountType: string
    promotion_banner: string
    startDate: string
    endDate: string
    products: IProduct[]
}