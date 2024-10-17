import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Comment } from '../schema/ProductComment.schema';
import { responseError } from 'src/utils/normalize.util';
import { createProductRatingDto } from '../dtos/createProductRatingDto.dto';
import { ProductService } from './product.service';
import { UserService } from 'src/auth/service/user.service';
@Injectable()
export class ProductReviewService {
    constructor(@InjectModel(Comment.name) private CommentModel: Model<Comment>,
        private readonly ProductService: ProductService,
        private readonly UserService: UserService
    ) { }


    async CreateProductRating(createRatingForm: createProductRatingDto, imagePaths: string[]) {
        try {
            console.log(createRatingForm);
            console.log(imagePaths);


            const { product_id, rating } = createRatingForm
            // tìm sản phẩm cần đánh giá
            const ratedProduct = await this.ProductService.GetOneProduct(product_id)
            // tạo đánh giá mới
            const newReview = new this.CommentModel({
                ...createRatingForm,
                review_img: imagePaths,

            })
            await newReview.save()
            // sau khi tạo review -> nhận được _id của review vừa tạo ra -> push vào comments[] của product
            ratedProduct.comments.push(new Types.ObjectId(newReview._id as string))
            // tăng lượt đánh giá và tính lại điểm đánh giá trung bình của sản phẩm
            ratedProduct.ratingCount += 1

            // Tính toán lại điểm đánh giá trung bình
            // Lấy tổng điểm đánh giá hiện tại và thêm điểm mới vào
            const totalRating = ratedProduct.averageRating * (ratedProduct.ratingCount - 1) + rating;
            ratedProduct.averageRating = Math.min(totalRating / ratedProduct.ratingCount, 5); // Giới hạn tối đa là 5
            await ratedProduct.save()
            return { message: "thanks for review" }
        } catch (error) {
            console.log("Create product rating error", error);

            responseError(error)
        }
    }

    async GetReviewById(productId: string): Promise<any | null> {
        try {
            const review = await this.CommentModel.findById(productId)
            // Kiểm tra xem review có tồn tại hay không
            if (!review) {
                return null; // Hoặc ném lỗi nếu bạn muốn
            }

            const user = await this.UserService.getUserInfoById(review.user_id.toString())


            const comment = {
                user_name: user?.name || '',
                user_avatar: user?.avatarUrl || '',
                content: review.content,
                rating: review.rating,
                review_img: review.review_img,
                date: review.created_at
            };

            return comment; // Trả về đối tượng comment
        } catch (error) {
            console.log("Get Product Review Error", error);
            responseError(error);
            throw error; // Ném lại lỗi nếu cần
        }
    }
}
