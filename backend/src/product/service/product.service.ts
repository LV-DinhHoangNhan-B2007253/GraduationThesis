import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from '../schema/Product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createProductDto } from '../dtos/createProduct.dto';
import { CategoryItem } from 'src/category-item/schema/CategoryItem.schema';
import * as path from 'path';
import * as fs from 'fs';
import { User } from 'src/auth/schema/User.schema';
import { normalizeName, responseError } from 'src/utils/normalize.util';
import { error, log } from 'console';
import { updateProductDto } from '../dtos/updateProduct.dos';
@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private ProductModel: Model<Product>,
        @InjectModel(CategoryItem.name) private CategoryItemModel: Model<CategoryItem>,
        @InjectModel(User.name) private UserModel: Model<User>,

    ) { }

    async CreateNewProduct(categoryItemId: string, createProductForm: createProductDto, images: string[]): Promise<any> {
        try {

            console.log(createProductForm);

            const newProduct = new this.ProductModel({
                ...createProductForm,
                images: images,
                shop_owner_id: new Types.ObjectId(createProductForm.shop_owner_id)
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

    async GetAllProduct(page: number, limit: number): Promise<{ products: Product[], totalProduct: number }> {
        try {
            const skip = (page - 1) * limit;
            const products = await this.ProductModel.find().skip(skip).limit(limit).exec()
            const totalProduct = await this.ProductModel.countDocuments().exec()
            return { products, totalProduct }
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

            const product = await this.ProductModel.findById(productId)

            const existingCartItem = user.cart.find(item => item.product_id.toString() === productId);

            if (existingCartItem) {
                // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
                existingCartItem.quantity += 1;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
                user.cart.push({
                    quantity: 1,
                    product_id: new Types.ObjectId(productId),
                    shop_owner_id: product.shop_owner_id
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


    async GetProductsByCategoryItem(categoryItemId: string): Promise<CategoryItem> {
        try {
            const data = await this.CategoryItemModel.findById(categoryItemId).populate('products')
            if (!data) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Cannot get Product"
                }, HttpStatus.NOT_FOUND)
            }
            return data
        } catch (error) {
            console.log("Get product by categoryItem Error", error);
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "server error"
                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    async GetRelatedProduct(productId: string): Promise<Product[]> {
        try {
            const product = await this.ProductModel.findById(productId).exec();

            let relatedProducts: Product[] = [];

            const priceRange = 0.1 * product.price;
            relatedProducts = await this.ProductModel.aggregate([
                {
                    $match: {
                        price: { $gte: product.price - priceRange, $lte: product.price + priceRange },
                        _id: { $ne: product._id },
                    },
                },
                {
                    $sample: { size: 7 },
                },
            ]).exec();

            return relatedProducts
        } catch (error) {
            console.log("Get related product Error", error);

        }
    }


    async GetProductByOwnerIdWithPage(page: number, limit: number, ownerId: string): Promise<{ products: Product[], totalProduct: number }> {
        try {
            const skip = (page - 1) * limit;
            const products = await this.ProductModel.find({ shop_owner_id: new Types.ObjectId(ownerId) }).skip(skip).limit(limit).exec()
            const totalProduct = await this.ProductModel.countDocuments({
                shop_owner_id: new Types.ObjectId(ownerId),
            }).exec();
            console.log(products.length);

            return { products, totalProduct }
        } catch (error) {
            console.log("Get All product Error", error);

        }
    }

    async UpdateProductInfo(updateProductBody: updateProductDto, productId: string) {
        try {
            const foundProduct = await this.ProductModel.findByIdAndUpdate(productId, updateProductBody)
            if (!foundProduct) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Product not found!"

                }, HttpStatus.NOT_FOUND)
            }
            return { message: "Update success!" }
        } catch (error) {
            console.log("Update product Error: ", error);
            responseError(error)
        }
    }

    async getOutstandingProducts(): Promise<Product[] | []> {
        try {
            const products = await this.ProductModel
                .find({ isOutStanding: true }) // Lấy các sản phẩm có isOutStanding là true
                .exec();
            return products;
        } catch (error) {
            console.log("get outstanding product Error", error);
            responseError(error)
        }
    }

    async getAllProductOfShop(shop_id: string): Promise<Product[]> {
        try {
            const products = await this.ProductModel.find({ shop_owner_id: new Types.ObjectId(shop_id) })
            return products
        } catch (error) {
            console.log("Get all product of shop error", error)

        }
    }

    async increaseSoldQuantity(product_id: string) {
        try {
            await this.ProductModel.findOneAndUpdate(
                { _id: new Types.ObjectId(product_id) },
                { $inc: { sold_quantity: 1 } }  // Sử dụng $inc để tăng sold_quantity
            );
        } catch (error) {
            console.log("Increase sold quantity error", error);
            responseError(error);
        }
    }

    // handle with product quantitu
    async minusProductQuantity(productId: string, minusQuantity: number): Promise<boolean> {
        try {
            let product = await this.ProductModel.findById(productId)
            if (!product) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Cannot found product"
                }, HttpStatus.NOT_FOUND)
            }
            if (product.stock_quantity < minusQuantity) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `Cannot minus quantity this product bescause instock just have ${product.stock_quantity}  product!`
                }, HttpStatus.BAD_REQUEST)

            }
            product.stock_quantity = product.stock_quantity - minusQuantity
            await product.save()
            return true
        } catch (error) {
            console.log("Minus product quantity Error", error);
            responseError(error)

        }
    }




    //đồng bộ dữ liệu khi thay đổi schema

    async migrateProducts() {
        const products = await this.ProductModel.find();

        for (const product of products) {
            // Kiểm tra và thêm giá trị mặc định cho các trường mới nếu chưa có
            if (product.averageRating === undefined) {
                product.averageRating = 0; // Giá trị mặc định
            }
            if (product.ratingCount === undefined) {
                product.ratingCount = 0; // Giá trị mặc định
            }
            if (product.comments === undefined) {
                product.comments = []; // Giá trị mặc định
            }
            if (product.sold_quantity === undefined) {
                product.sold_quantity = 0
            }
            if (product.shop_owner_id === undefined) {
                product.shop_owner_id = null
            }
            if (product.promotion === undefined) {
                product.promotion = []
            }

            await product.save(); // Lưu bản ghi đã cập nhật
            return "oke"
        }
    }


    async getAnalyzeProductInfo(productId: string) {
        try {
            // Tìm sản phẩm và populate thông tin từ Comment
            const product = await this.ProductModel.findById(new Types.ObjectId(productId))
                .populate({
                    path: 'comments', // Liên kết với comment
                    model: 'Comment', // Chỉ định model Comment
                    select: 'content rating', // Lấy các trường content và rating
                })
                .exec();

            if (!product) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Cannot found Product"
                }, HttpStatus.NOT_FOUND)
            }

            // Trích xuất nội dung bình luận
            const extractedComments = product.comments.map((comment: any) => comment.content);

            // Tính số lượng đánh giá theo từng số sao
            const ratingDistribution = product.comments.reduce((acc: any, comment: any) => {
                const rating = comment.rating;
                acc[rating] = (acc[rating] || 0) + 1; // Tăng số lượng đánh giá theo số sao
                return acc;
            }, {});

            // Dữ liệu cần trả về
            return {
                _id: product._id,
                name: product.name,
                sku: product.sku,
                sold_quantity: product.sold_quantity,
                averageRating: product.averageRating,
                ratingCount: product.ratingCount,
                comments: extractedComments, // Mảng comment
                ratingDistribution: ratingDistribution,
                instock: product.stock_quantity // Phân phối số lượt đánh giá theo sao
            };
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw new Error('Error fetching product details');
        }
    }

}
