import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe, } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { GoogleAuthGuard } from "../guards/google-auth/google-auth.guard";
import { CreateUserDto } from "../dtos/create-user.dto";
import { userLoginDto } from "../dtos/login-user.dto";
import { AuthGuard } from "../guards/auth.guard";
import { log, timeStamp } from "console";


@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }



    // Get




    // Post
    @Post('/register')
    @UsePipes(new ValidationPipe())
    Register(@Body() userRegister: CreateUserDto) {
        return this.authService.Register(userRegister)

    }

    @Post('/login')
    Login(@Body() loginInfo: userLoginDto) {
        return this.authService.Login(loginInfo)
    }

    // login with google
    @UseGuards(GoogleAuthGuard)
    @Get('/google/login')
    async googleLogin(@Request() req) {
    }


    @UseGuards(GoogleAuthGuard)
    @Get('/google/callback')
    googleCallback(@Request() req) {
        const user: CreateUserDto = req.user
        return this.authService.validateGoogleUser(user)
    }


    // login with facebook


}