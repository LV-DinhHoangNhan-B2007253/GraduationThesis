import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from '../schema/Product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createProductDto } from '../dtios/createProduct.dto';
import { CategoryItem } from 'src/category-item/schema/CategoryItem.schema';
import * as path from 'path';
import * as fs from 'fs';
import { User } from 'src/auth/schema/User.schema';
import { normalizeName } from 'src/utils/normalize.util';
@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private ProductModel: Model<Product>,
        @InjectModel(CategoryItem.name) private CategoryItemModel: Model<CategoryItem>,
        @InjectModel(User.name) private UserModel: Model<User>
    ) { }

    async CreateNewProduct(categoryItemId: string, createProductForm: createProductDto, images: string[]): Promise<any> {
        try {


            const newProduct = new this.ProductModel({
                ...createProductForm,
                images: images,
            });
            await newProduct.save()

            // Cập nhật CategoryItem
            const cateFound = await this.CategoryItemModel.findById(categoryItemId);
            if (!cateFound) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Cannot found category"
                }, HttpStatus.NOT_FOUND)
            }


            const productId = new Types.ObjectId(newProduct._id as string);
            cateFound.products.push(productId);
            await cateFound.save();

            return { message: `Create ${newProduct.name} success` }
        } catch (error) {
            console.log("Create New Product Error", error);

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Internal server error"
            }, HttpStatus.INTERNAL_SERVER_ERROR)

        }
    }

    private extractRelativePath(url: string) {
        // URL cơ sở của máy chủ tệp của bạn
        const baseUrl = 'http://localhost:3001/uploads/products';
        // Xóa URL cơ sở để có được đường dẫn tương đối
        return url.replace(`${baseUrl}/`, '');
    };

    private deleteImages(product: Product) {
        const rootDir = path.resolve(__dirname, '..', '..', '..', 'uploads', 'products'); // Thay đổi '..' để điều chỉnh đến đúng thư mục gốc

        for (const imageUrl of product.images) {
            // Trích xuất đường dẫn tương đối từ URL
            const relativePath = this.extractRelativePath(imageUrl);

            // Tạo đường dẫn đầy đủ đến tệp
            const imagePath = path.resolve(rootDir, relativePath);

            // Kiểm tra xem tệp có tồn tại trước khi cố gắng xóa
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath); // Xóa hình ảnh
                    console.log(`File deleted: ${imagePath}`);
                } catch (err) {
                    console.error(`Error deleting file ${imagePath}: ${err.message}`);
                }
            } else {
                console.warn(`File not found: ${imagePath}`);
            }
        }
    }

    async GetAllProduct(): Promise<Product[]> {
        try {
            const products = await this.ProductModel.find().exec()

            return products
        } catch (error) {
            console.log("Get All product Error", error);

        }
    }
    async DeleteOneProduct(productId: string,) {
        try {
            const product = await this.ProductModel.findById(new Types.ObjectId(productId))
            if (!product) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: `Cannot Found Product`
                }, HttpStatus.NOT_FOUND)
            }


            this.deleteImages(product)

            await this.ProductModel.findByIdAndDelete(new Types.ObjectId(productId))

            return { message: "Product has been deleted" }
        } catch (error) {
            console.log("Delete one product error", error);
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

    async GetOneProduct(productId: string,): Promise<Product> {
        try {
            const foundProduct = await this.ProductModel.findById(productId)
            if (!foundProduct) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: `Cannot Found Product`
                }, HttpStatus.NOT_FOUND)
            }


            return foundProduct
        } catch (error) {
            console.log("Get one product error", error);
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

    async AddToCart(userId: string, productId: string) {
        try {
            const user = await this.UserModel.findById(userId)
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "User Not Found"
                }, HttpStatus.NOT_FOUND)
            }
            const existingCartItem = user.cart.find(item => item.product_id.toString() === productId);
            if (existingCartItem) {
                // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
                existingCartItem.quantity += 1;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
                user.cart.push({
                    quantity: 1,
                    product_id: new Types.ObjectId(productId),
                });
            }
            await user.save(); // Lưu cập nhật vào database
            return { message: "Add to cart" }
        } catch (error) {
            console.log("Add to cart Error", error);

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

    async AddToWishList(userId: string, productId: string) {
        try {
            const user = await this.UserModel.findById(userId)
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "User Not Found"
                }, HttpStatus.NOT_FOUND)
            }
            const alreadyInWishlist = user.wishlist.find(item => item.toString() === productId);
            if (alreadyInWishlist) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Product is already in wishlist'
                }, HttpStatus.BAD_REQUEST);
            }

            // Thêm sản phẩm vào wishlist
            user.wishlist.push(new Types.ObjectId(productId));
            await user.save(); // Lưu cập nhật vào database
            return { message: "Add to wish list" }
        } catch (error) {
            console.log("Add to cart Error", error);

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

    async SearchProduct(query: string): Promise<Product[]> {
        try {
            const qry = normalizeName(query)
            const products = await this.ProductModel.find({
                $or: [
                    { name: { $regex: qry, $options: 'i' }, },
                    { sku: { $regex: qry, $options: 'i' } }
                ]
            }).exec()
            return products
        } catch (error) {
            console.log("Search Product Error", error);
        }
    }


}
