

export interface ICreateReview {
    user_id: string
    product_id: string
    content: string
    rating: number
    review_img: File[]
}

export interface IComment {
    user_name: string,
    user_avatar: string,
    content: string,
    rating: number,
    review_img: string[]
    date: Date
}