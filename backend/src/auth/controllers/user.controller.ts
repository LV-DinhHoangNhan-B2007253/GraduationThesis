import { Body, Controller, Get, Param, Patch, Req, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        // private readonly productService: ProductService
    ) { }

    // GIỮ
    @UseGuards(AuthGuard)
    @Get('/getProfile')
    GetUserInfoById(@Request() req) {

        const userId = req.user.id
        return this.userService.getUserInfoById(userId)
    }

    @Get('/getOne/:_id')
    GetOneUser(@Param() userId: string) {
        return this.userService.getUserInfoById(userId)
    }


    @UseGuards(AuthGuard)
    @Patch('/updateInfo')
    UpdateUserInfo(@Body() userForm, @Request() req) {
        const userId = req.user.id
        return this.userService.UpdateUserInformation(userId, userForm)
    }

    @Get('/:userId/cart')
    async getCartProducts(@Param('userId') userId: string) {
        return this.userService.getCartProducts(userId);
    }
    @Get('/:userId/wishlist')
    async getWishListProducts(@Param('userId') userId: string) {
        return this.userService.getWishlistProducts(userId);
    }

    @Patch('/:userId/cart/remove/:productId')
    RemoveProductInCart(@Param('userId') userId: string, @Param('productId') productId: string) {
        return this.userService.removeProductInCart(userId, productId)
    }


    @Patch('/:userId/wishlist/remove/:productId')
    RemoveProductInWishList(@Param('userId') userId: string, @Param('productId') productId: string) {
        return this.userService.removeProductInWishList(userId, productId)
    }


    @Patch('/:userId/cart/update/:productId')
    UpdateProductQuantityInCart(@Param('userId') userId: string, @Param('productId') productId: string, @Body() updateBody: { updateQuantity: number }) {
        return this.userService.updateProductQuantityInCart(userId, productId, updateBody)
    }
}
