import { Body, Controller, Get, Patch, Req, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService
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
}
