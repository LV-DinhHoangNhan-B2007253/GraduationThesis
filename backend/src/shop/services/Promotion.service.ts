import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { responseError } from 'src/utils/normalize.util';
import { createPromotionDto } from '../dtos/createPromotion.dto';
import { Promotion } from '../schemas/Promotion.schema';
import { error } from 'console';
import { ProductService } from 'src/product/service/product.service';

@Injectable()
export class PromotionService {
    constructor(
        @InjectModel(Promotion.name) private PromotionModel: Model<Promotion>,
        private readonly ProductService: ProductService
    ) { }


    async CreateNewPromotion(promotionData: createPromotionDto, bannerPath: string) {
        try {
            console.log(promotionData);

            // Chuyển đổi mảng product IDs từ chuỗi sang ObjectId
            const productIds = promotionData.products.map((id: string) => new Types.ObjectId(id));


            // Tạo đối tượng mới của Promotion với dữ liệu từ promotionData và bannerPath
            const newPromo = new this.PromotionModel({
                ...promotionData,
                promotion_banner: bannerPath,
                products: productIds
            });

            // Lưu khuyến mãi vào database
            await newPromo.save();

            // Trả về phản hồi thành công
            return { message: "Created new Promotion" };
        } catch (error) {
            // Xử lý lỗi, có thể tạo hàm `responseError` để log lỗi hoặc xử lý khác
            console.log("Create new promotion error:", error);

            // Trả về lỗi hoặc ném ra lỗi để xử lý ở tầng cao hơn
            throw new Error("Failed to create promotion");
        }
    }


    async GetPromotionsOfShop(shopId: string): Promise<Promotion[]> {
        try {
            const promos = await this.PromotionModel.find({ shop_id: shopId });
            console.log(promos);
            console.log(typeof promos[0].startDate);



            return promos;
        } catch (error) {
            responseError(error);
            return []; // Trả về mảng rỗng khi gặp lỗi
        }
    }


    async UpdatePromotion(id: string, updateData: createPromotionDto, bannerPath?: string) {
        try {
            const updateFields: any = { ...updateData };

            // Chuyển đổi mảng product IDs từ chuỗi sang ObjectId nếu tồn tại trong dữ liệu cập nhật
            if (updateData.products) {
                updateFields.products = updateData.products.map((id: string) => new Types.ObjectId(id));
            }

            // Nếu có banner mới, thêm vào đối tượng cập nhật
            if (bannerPath) {
                updateFields.promotion_banner = bannerPath;
            }

            // Cập nhật promotion
            const updatedPromotion = await this.PromotionModel.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedPromotion) {
                throw new Error('Promotion not found');
            }

            return { message: "Promotion updated successfully", updatedPromotion };
        } catch (error) {
            console.log("Update promotion error", error);
            throw new Error("Failed to update promotion");
        }
    }


    async deletePromotion(id: string): Promise<{ message: string }> {
        try {
            await this.PromotionModel.findByIdAndDelete(id);
            return { message: "Promotion deleted successfully" };
        } catch (error) {
            console.error("Error deleting promotion:", error);
            throw new Error("Failed to delete promotion");
        }
    }
    async GetPromotionDetailById(promotionId: string): Promise<any> {
        try {
            const promotion = await this.PromotionModel.findById(promotionId)
            if (!promotion) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Cannot found Promotion detail"
                }, HttpStatus.NOT_FOUND)
            }

            const products = await Promise.all(
                promotion.products.map(async (productId) => {
                    return this.ProductService.GetOneProduct(productId.toString()); // Lấy thông tin từng sản phẩm
                })
            );
            const responseData = {
                ...promotion.toObject(), // Sử dụng toObject() để lấy dữ liệu Promotion dưới dạng Object thuần
                products: products // Đưa vào thông tin sản phẩm đã lấy
            };
            return responseData
        } catch (error) {
            console.log("Get promotion detail error", error);
            responseError(error)
        }
    }
}
