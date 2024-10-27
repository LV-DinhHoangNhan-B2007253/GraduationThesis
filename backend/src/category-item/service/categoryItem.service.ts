import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryItem } from '../schema/CategoryItem.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { normalizeName } from "../../utils/normalize.util"
import { ProductService } from 'src/product/service/product.service';
import { createCategoryItemDto } from '../dtos/createCategoryItem.dto';

@Injectable()
export class CategoryItemService {
    constructor(@InjectModel(CategoryItem.name) private readonly ItemModel: Model<CategoryItem>,
        private readonly productService: ProductService
    ) { }

    async createCategoryItem(createCategoryItemForm: createCategoryItemDto, bannerPath: string,): Promise<CategoryItem> {
        try {
            const { name, shop_creator_id } = createCategoryItemForm
            const normalize = normalizeName(name)
            const foundItem = await this.ItemModel.findOne({ name: normalize, shop_creator_id: new Types.ObjectId(shop_creator_id) })
            if (foundItem) {
                throw new HttpException({
                    status: HttpStatus.CREATED,
                    error: `this '${createCategoryItemForm.name}' category existed!`
                }, HttpStatus.CREATED)
            }
            const newCategory = new this.ItemModel({
                ...createCategoryItemForm,
                banner: bannerPath,
                shop_creator_id: new Types.ObjectId(shop_creator_id)
            })
            await newCategory.save()
            return newCategory
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
