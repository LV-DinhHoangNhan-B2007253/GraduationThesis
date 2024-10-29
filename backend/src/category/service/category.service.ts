import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category, } from '../schema/Category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { normalizeName } from "../../utils/normalize.util"
import { ProductService } from 'src/product/service/product.service';
import { createCategoryItemDto } from '../dtos/createCategoryItem.dto';
import { error, log } from 'console';
import { Product } from 'src/product/schema/Product.schema';
import { ShopService } from 'src/shop/services/ShopService.service';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private readonly CategoryModel: Model<Category>,
        private readonly productService: ProductService,
        private readonly shopService: ShopService,

    ) { }

    async createCategoryItem(createCategoryItemForm: createCategoryItemDto, bannerPath: string,): Promise<Category> {
        try {
            const { name, shop_creator_id } = createCategoryItemForm
            const normalize = normalizeName(name)
            const foundItem = await this.CategoryModel.findOne({ name: normalize, shop_creator_id: new Types.ObjectId(shop_creator_id) })
            if (foundItem) {
                throw new HttpException({
                    status: HttpStatus.CREATED,
                    error: `this '${createCategoryItemForm.name}' category existed!`
                }, HttpStatus.CREATED)
            }
            const newCategory = new this.CategoryModel({
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

    async getAllCategoryItems(): Promise<Category[]> {
        try {
            const data = await this.CategoryModel.find().select("-__v").exec()
            return data
        } catch (error) {
            console.log("Get all categoryItems Error", error);

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Internal server error"
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getProductsByCategory(categoryId: string) {
        try {
            const category = await this.CategoryModel.findById(categoryId)
            if (!category) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "category not found"
                }, HttpStatus.NOT_FOUND)
            }
            const { products } = category
            const productList = Promise.all(
                products.map((productId) => this.productService.getProductById(productId.toString()))
            )

            return productList
        } catch (error) {
            console.log("get product by category error", error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error getting products by category"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // lấy danh mục và sản danh sách sản phẩm của 1 shop
    async getCategorAndProductOfShop(shopId: string) {
        try {
            const shop_creatorId = new Types.ObjectId(shopId)
            const categories = await this.CategoryModel.find({ shop_creator_id: shop_creatorId })

            if (!categories) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "category not found"
                }, HttpStatus.NOT_FOUND)
            }

            // Khởi tạo mảng sản phẩm để lưu trữ tất cả sản phẩm của các danh mục
            let products: Product[] = [];

            // Dùng Promise.all để xử lý bất đồng bộ cho từng danh mục và sản phẩm liên quan
            await Promise.all(
                categories.map(async (category) => {
                    const categoryProducts = await Promise.all(
                        category.products.map((productId) => this.productService.getProductById(productId.toString()))
                    );
                    products = products.concat(categoryProducts);
                })
            );

            return { categories, products };
        } catch (error) {

        }
    }




    async getProductsByQuery(query: string) {
        try {
            let shopInfo = null;
            let products = [];

            const shop = await this.shopService.GetShopInfoByName(query);
            if (shop) {
                shopInfo = shop;
                const categories = await this.CategoryModel.find({ shop_creator_id: shop._id });

                products = await Promise.all(
                    categories.flatMap((category) =>
                        category.products
                            .filter((productId) => Types.ObjectId.isValid(productId)) // Chỉ lấy các productId hợp lệ
                            .map((productId) => this.productService.getProductById(productId.toString()))
                    )
                );
                // return await this.getCategorAndProductOfShop(shop._id.toString())
            } else {
                const category = await this.CategoryModel.findOne({ name: new RegExp(query, 'i') });

                if (category) {
                    products = await Promise.all(
                        category.products
                            .filter((productId) => Types.ObjectId.isValid(productId)) // Chỉ lấy các productId hợp lệ
                            .map((productId) => this.productService.getProductById(productId.toString()))
                    );
                } else {
                    products = await this.productService.getProductByNameOrType(query);
                }
            }

            return { shopInfo, products };
        } catch (error) {
            console.log("get products by query error", error.message);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error getting products by query"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
