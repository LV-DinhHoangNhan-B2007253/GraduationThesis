import { Body, Controller, Get, Post, Request, Res, UseGuards, UsePipes, ValidationPipe, } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { GoogleAuthGuard } from "../guards/google-auth/google-auth.guard";
import { CreateUserDto } from "../dtos/create-user.dto";
import { userLoginDto } from "../dtos/login-user.dto";


@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // GIỮ
    // Post
    @Post('/register')
    // @UsePipes(new ValidationPipe())
    async Register(@Body() userRegister: CreateUserDto) {
        const accessToken = await this.authService.Register(userRegister)

        return accessToken
    }

    // GIỮ
    @Post('/login')
    Login(@Body() loginInfo: userLoginDto) {
        return this.authService.Login(loginInfo)
    }

    // GIỮ
    // login with google
    @UseGuards(GoogleAuthGuard)
    @Get('/google/login')
    async googleLogin(@Request() req) {
    }


    // GIỮ
    @UseGuards(GoogleAuthGuard)
    @Get('/google/callback')
    async googleCallback(@Request() req, @Res() res) {
        const user: CreateUserDto = req.user
        const accessToken = await this.authService.validateSocialLoginUser(user);
        res.redirect(`http://localhost:3000/callback?access_token=${accessToken}`);


    }


}