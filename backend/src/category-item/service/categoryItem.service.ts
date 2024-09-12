import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryItem } from '../schema/CategoryItem.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createCategoryItemDto } from 'src/category/dtos/create-item.dto';
import { normalizeName } from "../../utils/normalize.util"

@Injectable()
export class CategoryItemService {
    constructor(@InjectModel(CategoryItem.name) private readonly ItemModel: Model<CategoryItem>) { }

    async createCategoryItem(item: createCategoryItemDto): Promise<CategoryItem> {
        try {
            const normalize = normalizeName(item.name)
            const foundItem = await this.ItemModel.findOne({ name: normalize })
            if (foundItem) {
                throw new HttpException({
                    status: HttpStatus.CREATED,
                    error: `this '${item.name}' category existed!`
                }, HttpStatus.CREATED)
            }
            const res = new this.ItemModel(item)
            return res.save()
        } catch (error) {
            console.log("Create category item error", error);
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Internal server error"
                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    async getAllCategoryItems(): Promise<CategoryItem[]> {
        try {
            const data = await this.ItemModel.find().select("-__v").exec()
            return data
        } catch (error) {
            console.log("Get all categoryItems Error", error);

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Internal server error"
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}
