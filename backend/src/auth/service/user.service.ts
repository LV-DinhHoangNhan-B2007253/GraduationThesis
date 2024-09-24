import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../schema/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';
import { Product } from 'src/product/schema/Product.schema';
import { responseError } from 'src/utils/normalize.util';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Product.name) private productModel: Model<Product>
    ) {

    }

    async getUserInfoById(userId: string): Promise<any> {
        try {
            const user = await this.userModel.findById(userId).select('-password -__v')
            if (!user) {
                return new UnauthorizedException(`cannot get user info with id : ${userId}`)
            }
            return user
        } catch (error) {
            console.log(error);

        }
    }


    async UpdateUserInformation(userId, updateForm): Promise<any> {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                { $set: updateForm },
            );
            if (!updatedUser) {
                throw new HttpException({
                    error: "User not existed",
                    status: HttpStatus.NOT_FOUND
                }, HttpStatus.NOT_FOUND)
            }

            return { message: "Update Success" }

        } catch (error) {
            console.log("Update Info Error:", error);

            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'An unexpected error occurred',
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getCartProducts(userId: string): Promise<any> {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "User not found"
                }, HttpStatus.NOT_FOUND)
            }

            return user.cart
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'An unexpected error occurred',
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getWishlistProducts(userId: string): Promise<any> {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "User not found"
                }, HttpStatus.NOT_FOUND)
            }
            return user.wishlist
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'An unexpected error occurred',
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async removeProductInCart(userId: string, productId: string): Promise<any> {
        try {
            const user = await this.userModel.findById(userId)
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "user not found"
                }, HttpStatus.NOT_FOUND)
            }
            user.cart = user.cart.filter(
                (item) => item.product_id.toString() !== productId,
            );
            await user.save();
            return { message: 'Removed!' };
        } catch (error) {
            console.log("remove product in cart Error", error);

            responseError(error)
        }
    }

    async removeProductInWishList(userId: string, productId: string): Promise<any> {
        try {
            const user = await this.userModel.findById(userId)
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "user not found"
                }, HttpStatus.NOT_FOUND)
            }
            user.wishlist = user.wishlist.filter(
                (item) => item.toString() !== productId,
            );
            await user.save();
            return { message: 'Removed!' };
        } catch (error) {
            console.log("remove product in cart Error", error);

            responseError(error)
        }
    }

    async updateProductQuantityInCart(userId: string, productId: string, updateBody: { updateQuantity: number }) {
        try {
            const user = await this.userModel.findById(userId)
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "user not found"
                }, HttpStatus.NOT_FOUND)
            }
            // Tìm sản phẩm trong giỏ hàng
            const cartItemIndex = user.cart.findIndex(
                (item) => item.product_id.toString() == productId
            );



            if (cartItemIndex == -1) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Product not found in cart"
                }, HttpStatus.NOT_FOUND);
            }
            // Cập nhật số lượng sản phẩm
            // if (updateBody.updateQuantity <= 0) {
            //     // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
            //     user.cart.splice(cartItemIndex, 1);
            // } else {
            //     // Nếu số lượng > 0, cập nhật số lượng
            //     user.cart[cartItemIndex].quantity = Number(updateBody.updateQuantity);
            // }
            user.cart[cartItemIndex].quantity = Number(updateBody.updateQuantity);

            // Lưu thay đổi vào database
            await user.save();
            return {
                message: updateBody.updateQuantity <= 0
                    ? "Product removed from cart"
                    : "Product quantity updated successfully",
            };
        } catch (error) {
            console.log("Update product quantity in cart error", error);
            responseError(error)

        }
    }

    // xóa sản phẩm trong giỏ hàng khi user đã mua hàng => tạo order thành công

    async removeProductsFromCart(userId: string, productIds: string[], session: any = null): Promise<any> {
        try {
            const user = await this.userModel.findById(userId).session(session);
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "User not found",
                }, HttpStatus.NOT_FOUND);
            }

            // Lọc giỏ hàng để loại bỏ các sản phẩm đã mua
            user.cart = user.cart.filter(
                (item) => !productIds.includes(item.product_id.toString()),
            );

            // Lưu lại giỏ hàng sau khi xóa các sản phẩm đã mua
            await user.save({ session });
            return { message: 'Products removed from cart successfully' };
        } catch (error) {
            console.log("Error removing products from cart:", error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || 'Failed to remove products from cart',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
