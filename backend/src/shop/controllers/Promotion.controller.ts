import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PromotionService } from '../services/Promotion.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { createPromotionDto } from '../dtos/createPromotion.dto';
@Controller('api/promotion')
export class PromotionController {
    constructor(
        private readonly promotionService: PromotionService
    ) { }

    @Get('/get/:shopId')
    GetPromotionsOfShop(@Param('shopId') shopId: string) {
        return this.promotionService.GetPromotionsOfShop(shopId)
    }

    @Post('/create')
    @UseInterceptors(FileInterceptor('promotion_banner', {
        storage: diskStorage({
            destination: './uploads/promotions',
            filename: (req, file, cb) => {
                const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
                cb(null, uniqueFilename);
            },
        }),
    }),)

    CreateNewPromotion(@UploadedFile() promotion_banner: Express.Multer.File, @Body() createNewPromotionForm: createPromotionDto) {
        const banner = `http://localhost:3001/uploads/promotions/${promotion_banner.filename}`

        return this.promotionService.CreateNewPromotion(createNewPromotionForm, banner)
    }


    @Patch('/update/:id')
    @UseInterceptors(FileInterceptor('promotion_banner', {
        storage: diskStorage({
            destination: './uploads/promotions',
            filename: (req, file, cb) => {
                const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
                cb(null, uniqueFilename);
            },
        }),
    }))
    async UpdatePromotion(
        @Param('id') id: string, // Nhận ID từ đường dẫn
        @UploadedFile() promotion_banner: Express.Multer.File,
        @Body() updatePromotionData: createPromotionDto
    ) {
        let banner: string;

        // Nếu có banner mới, cập nhật đường dẫn
        if (promotion_banner) {
            banner = `http://localhost:3001/uploads/promotions/${promotion_banner.filename}`;
        }

        // Gọi service để cập nhật thông tin
        return this.promotionService.UpdatePromotion(id, updatePromotionData, banner);
    }

    @Delete('/delete/:id')
    async deletePromotion(@Param('id') id: string) {
        return this.promotionService.deletePromotion(id);
    }

    @Get('/get/detail/:promotionId')
    GetPromotionDetailById(@Param('promotionId') promotionId: string) {
        return this.promotionService.GetPromotionDetailById(promotionId)
    }
}
