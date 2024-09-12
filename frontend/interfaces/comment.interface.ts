interface Reply {
    user_id: string
    reply_text: string
    date: Date
}




export interface IComment {
    product_id: string
    comment_text: string
    rating: number
    date: Date
    replies: Reply[]
}