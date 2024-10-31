import { HttpException, HttpStatus, Injectable, Type } from '@nestjs/common';
import { Category, } from '../schema/Category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { normalizeName } from "../../utils/normalize.util"
import { ProductService } from 'src/product/service/product.service';
import { createCategoryItemDto } from '../dtos/createCategoryItem.dto';
import { error, log } from 'console';
import { Product } from 'src/product/schema/Product.schema';
import { ShopService } from 'src/shop/services/ShopService.service';
import { updateCategoryDto } from '../dtos/updateCategory.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private readonly CategoryModel: Model<Category>,
        private readonly productService: ProductService,
        private readonly shopService: ShopService,

    ) { }

    async createCategoryItem(createCategoryItemForm: createCategoryItemDto, bannerPath: string,): Promise<any> {
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
            return { message: `${newCategory.name} Created!` }
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

            if (!categories || categories.length === 0) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "category not found"
                }, HttpStatus.NOT_FOUND)
            }

            // Khởi tạo mảng sản phẩm để lưu trữ tất cả sản phẩm của các danh mục
            let products: Product[] = [];

            // Dùng Promise.all để xử lý bất đồng bộ cho từng danh mục và sản phẩm liên quan
            // await Promise.all(
            //     categories.map(async (category) => {
            //         const categoryProducts = await Promise.all(
            //             category.products.map((productId) => this.productService.getProductById(productId.toString()))
            //         );
            //         products = products.concat(categoryProducts);
            //     })
            // );

            // Sử dụng Promise.all và quản lý lỗi cho từng sản phẩm
            await Promise.all(
                categories.map(async (category) => {
                    const categoryProducts = await Promise.all(
                        category.products.map(async (productId) => {
                            try {
                                return await this.productService.getProductById(productId.toString());
                            } catch (error) {
                                if (error.status === HttpStatus.NOT_FOUND) {
                                    console.log(`Product with ID ${productId} not found.`);
                                    return null; // Bỏ qua sản phẩm không tìm thấy
                                }
                                throw error; // Ném lỗi khác nếu có
                            }
                        })
                    );

                    // Lọc bỏ sản phẩm không tìm thấy (null) và thêm vào mảng products
                    products = products.concat(categoryProducts.filter(product => product !== null));
                })
            );


            return { categories, products };
        } catch (error) {
            console.log("getCategorAndProductOfShop error", error);

        }
    }





    // Helper function to check existence of product
    async productExists(productId: string) {
        const product = await this.productService.getProductById(productId);
        return product !== null; // hoặc !product để kiểm tra
    }


    async getProductsByQuery(query: string) {
        try {
            let shopInfo = null;
            let products = [];

            const shop = await this.shopService.GetShopInfoByName(query);
            if (shop) {
                shopInfo = shop;

                const categories = await this.CategoryModel.find({ shop_creator_id: shop._id });

                // console.log(categories);


                // products = await Promise.all(
                //     categories.flatMap(async (category) => {
                //         const existingProducts = await Promise.all(
                //             category.products
                //                 .filter((productId) => Types.ObjectId.isValid(productId)) // Chỉ lấy các productId hợp lệ
                //                 .map(async (productId) => {
                //                     if (await this.productExists(productId.toString())) {
                //                         return this.productService.getProductById(productId.toString());
                //                     }
                //                     return null; // Trả về null nếu sản phẩm không tồn tại
                //                 })
                //         );

                //         return existingProducts.filter(product => product !== null); // Lọc các sản phẩm không tồn tại
                //     })
                // );

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

            // console.log(shopInfo, products);

            return { shopInfo, products };
        } catch (error) {
            console.log("get products by query error", error.message);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error getting products by query" + error.message
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





    // hàm chuyển products[] dạng string sang objectId
    private transformStringlistToObjectId(stringList: string[]): Types.ObjectId[] {
        return stringList.map((string) => new Types.ObjectId(string))

    }

    // chỉnh sửa thông tin 1 danh mục
    async updatecCatgegoryInfo(editForm: updateCategoryDto, categoryId: string) {
        try {
            console.log(editForm);

            // Kiểm tra nếu `products` tồn tại trước khi chuyển đổi
            // const productObjectIds = editForm.products
            //     ? this.transformStringlistToObjectId(editForm.products)
            //     : undefined;

            console.log("mãng đã chuyển");

            // Tạo đối tượng cập nhật chỉ bao gồm các phần thay đổi
            const updateData: Partial<{ name: string }> = {};
            if (editForm.name) updateData.name = editForm.name;
            // if (editForm.products) updateData.products = productObjectIds;


            console.log("các phần được thay đổi", updateData);



            // Cập nhật danh mục trong cơ sở dữ liệu
            const updatedCategory = await this.CategoryModel.findByIdAndUpdate(
                { _id: new Types.ObjectId(categoryId) },            // ID của danh mục cần cập nhật
                { $set: updateData },        // Chỉ cập nhật các phần thay đổi
                { new: true }                // Trả về danh mục đã cập nhật
            );

            if (!updatedCategory) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Category not found"
                }, HttpStatus.NOT_FOUND);
            }

            // console.log('sau khi cap nhat', updatedCategory);
            return { message: "Updated" }

        } catch (error) {
            console.log("update category info error: ", error);
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "update category info internal_server_error"
                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }


    async removeProductsFromCategory(categoryId: string, productIds: string[]) {
        try {
            // Chuyển đổi `productIds` từ `string[]` sang `ObjectId[]`
            // console.log(productIds);

            const productObjectIds = productIds.map(id => new Types.ObjectId(id));
            // console.log(productObjectIds);

            // Thực hiện cập nhật danh mục, loại bỏ các sản phẩm theo `productObjectIds`
            const updatedCategory = await this.CategoryModel.findByIdAndUpdate(
                categoryId,
                { $pull: { products: { $in: productObjectIds } } }, // Loại bỏ các sản phẩm có ID trong `productObjectIds`
                { new: true } // Trả về danh mục đã cập nhật
            );

            if (!updatedCategory) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: "Category not found",
                    },
                    HttpStatus.NOT_FOUND
                );
            }

            // console.log("Danh mục sau khi xóa sản phẩm:", updatedCategory);
            return { message: "Products removed successfully" };
        } catch (error) {
            console.log("Remove products from category error: ", error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: "Remove products from category internal_server_error",
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }


    async addProductsToCategory(categoryId: string, productIds: string[]) {
        try {
            // Chuyển đổi productIds từ string[] sang ObjectId[]
            const productObjectIds = productIds.map(id => new Types.ObjectId(id));

            // Tìm danh mục theo ID
            const category = await this.CategoryModel.findById(new Types.ObjectId(categoryId));

            if (!category) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: "Category not found",
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            // Lọc ra những sản phẩm chưa có trong danh mục
            const newProductIds = productObjectIds.filter(productId => !category.products.includes(productId));

            if (newProductIds.length === 0) {
                return { message: "No new products to add" }; // Không có sản phẩm mới để thêm
            }

            // Cập nhật danh mục để thêm các sản phẩm mới
            category.products.push(...newProductIds);
            await category.save();

            return { message: `Added ${productIds.length} products to the ${category.name} category` };
        } catch (error) {
            console.log("Error adding products to category: ", error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: "Internal server error",
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }


    async DeleteCategoryById(categoryId: string) {
        try {
            const deletedCategory = await this.CategoryModel.findByIdAndDelete(new Types.ObjectId(categoryId))
            if (!deletedCategory) {
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: "cannot found category"
                }, HttpStatus.NOT_ACCEPTABLE)
            }
            return { message: `${deletedCategory.name} Category has been deleted` }

        } catch (error) {
            console.log("Delete category error: ", error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: "Internal server error",
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}
