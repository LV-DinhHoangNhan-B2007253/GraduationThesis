import { Body, Controller, Get, Param, Patch, Req, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthGuard } from '../guards/auth.guard';
import { ProductService } from 'src/product/service/product.service';

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        // private readonly productService: ProductService
    ) { }

    @UseGuards(AuthGuard)
    @Get('/getProfile')
    GetUserInfoById(@Request() req) {

        const userId = req.user.id
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
}
