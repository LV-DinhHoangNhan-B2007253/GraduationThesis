import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Shop } from '../schemas/Shop.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateShopDto } from '../dtos/createShop.dto';
import { responseError } from 'src/utils/normalize.util';
import { UserService } from 'src/auth/service/user.service';
import { find } from 'rxjs';
import { error } from 'console';
import { Type } from 'class-transformer';
import { query } from 'express';

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
            await this.UserService.UpdateShopIdForOwner(newShop._id, userId)
            return { message: "Tạo shop thành công" };
        } catch (error) {
            console.log("Lỗi khi tạo shop mới", error);
            responseError(error);
        }
    }

    async GetShopInfoByUserId(shop_id: string): Promise<Shop> {
        try {
            const Shop_id = new Types.ObjectId(shop_id)

            const shop = await this.ShopModel.findOne({ _id: Shop_id })
            if (!shop) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "cannot found shop"
                }, HttpStatus.NOT_FOUND)
            }
            return shop
        } catch (error) {
            console.log("Get shop Error", error);
            responseError(error)
        }
    }


    async GetShopInfoByName(shopName: string) {
        try {
            const shop = await this.ShopModel.findOne({ name: new RegExp(shopName, 'i') })
            return shop
        } catch (error) {
            console.log("find shop by name error", error);

        }
    }
}
