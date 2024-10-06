import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Shop } from '../schemas/Shop.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateShopDto } from '../dtos/createShop.dto';
import { responseError } from 'src/utils/normalize.util';
import { UserService } from 'src/auth/service/user.service';
import { find } from 'rxjs';
import { error } from 'console';

@Injectable()
export class ShopService {

    constructor(
        @InjectModel(Shop.name) private ShopModel: Model<Shop>,
        private readonly UserService: UserService
    ) { }

    async CreateNewShop(logo: string, banner: string, createShopForm: CreateShopDto, userId: string) {
        try {
            // Kiểm tra xem người dùng có tồn tại không
            const findUser = await this.UserService.findUser(userId);
            if (!findUser) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Không tìm thấy userId"
                }, HttpStatus.NOT_FOUND);
            }

            // Kiểm tra xem shop đã tồn tại với owner hoặc shopMail
            const checkShop = await this.ShopModel.findOne({
                $or: [
                    { owner: userId },
                    { shopMail: createShopForm.shopMail },
                ],
            });

            // Kiểm tra shopMail đã tồn tại
            const checkShopMail = await this.ShopModel.exists({ shopMail: createShopForm.shopMail });

            if (checkShop) {
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: "Shop đã tồn tại hoặc bạn đã mở shop"
                }, HttpStatus.NOT_ACCEPTABLE);
            }

            if (checkShopMail) {
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: "Email đã tồn tại"
                }, HttpStatus.NOT_ACCEPTABLE);
            }

            // Tạo shop mới
            const newShop = new this.ShopModel({
                ...createShopForm,
                logoUrl: logo,
                shopBanner: banner,
                owner: new Types.ObjectId(userId)
            });

            await newShop.save();
            return { message: "Tạo shop thành công" };
        } catch (error) {
            console.log("Lỗi khi tạo shop mới", error);
            responseError(error);
        }
    }
}
