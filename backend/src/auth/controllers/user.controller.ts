import { Controller, Get, Request, UseGuards } from '@nestjs/common';
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
}
