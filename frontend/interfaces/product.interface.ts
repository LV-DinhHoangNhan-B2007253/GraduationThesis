import { IComment } from "./comment.interface";

export interface IProduct {
    _id: string
    name: string;
    sku: string
    images: string[]
    price: number,
    stock_quantity: number
    isOutStanding: boolean
    comments: string[]
    description: string
    averageRating: number
    ratingCount: number
    sold_quantity: number
    shop_owner_id: string,
    goodCount: number,
    neutralCount: number,
    badCount: number

}

export interface ICreateProduct {
    name: string
    sku: string
    images: File[]
    price: number
    description: string
    stock_quantity: number
    shop_owner_id: string
}

export interface ICartItem {
    product_id: string,
    quantity: number
    _id: string,
    shop_owner_id: string
}

export interface IShopGroup {
    shop_owner_id: string;
    products: ICartItem[];
}

export interface IUpdateProductForm {
    name: string | undefined,
    price: number | undefined
    description: string | undefined,
    stock_quantity: number | undefined,
    sku: string | undefined
    isOutStanding: boolean
}


export interface IAnalyzeProduct {
    _id: string;
    name: string;
    sku: string;
    sold_quantity: number;
    averageRating: number;
    ratingCount: number;
    comments: string[]; // Mảng chỉ chứa nội dung bình luận
    ratingDistribution: { [key: number]: number };
    instock: number // Đếm số lượng đánh giá theo từng số sao
}