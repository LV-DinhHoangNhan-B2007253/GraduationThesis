import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductReviewService } from '../service/comment.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createProductRatingDto } from '../dtos/createProductRatingDto.dto';
@Controller('api/review')
export class ProductReview {

    constructor(
        private readonly reviewService: ProductReviewService
    ) { }


    @Post('/create')
    @UseInterceptors(FilesInterceptor('review_img', 5, {
        storage: diskStorage({
            destination: './uploads/reviews',
            filename: (req, file, cb) => {
                const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
                cb(null, uniqueFilename)
            }
        })
    }))
    async CreateNewProductReview(
        @UploadedFiles() review_img: Array<Express.Multer.File>, @Body() createReview: createProductRatingDto) {
        const imagePaths = review_img.map(img => `http://localhost:3001/uploads/reviews/${img.filename}`)


        return this.reviewService.CreateProductRating(createReview, imagePaths)

    }

    @Get('/get/reviewId/:reviewId')
    GetProductReview(@Param('reviewId') reviewId: string) {
        return this.reviewService.GetReviewById(reviewId)
    }

}
