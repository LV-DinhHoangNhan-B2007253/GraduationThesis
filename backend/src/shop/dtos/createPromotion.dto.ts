export class createPromotionDto {
    shop_id: string
    title: string
    description: string
    discountType: string
    promotion_banner: File
    startDate: Date
    endDate: Date
    products: string[]
}