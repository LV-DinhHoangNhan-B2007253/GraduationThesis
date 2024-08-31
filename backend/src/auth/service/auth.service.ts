import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/User.schema';
import { CreateUserDto } from '../dtos/create-user.dto';

import * as bcrypt from 'bcrypt';
import { userLoginDto } from '../dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    createAccessToken(payload: any) {
        return this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '1d' })
    }

    createRefreshToken(payload: any) {
        return this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '15d' })
    }

    async returnInfoAndToken(user: User) {
        const payload = {
            id: user._id,
            role: user.role
        }
        const { password, ...info } = user.toJSON();
        const accessToken = await this.createAccessToken(payload)
        const refreshToken = await this.createRefreshToken(payload)
        return {
            info,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    // basic auth
    async Login(userLogin: userLoginDto): Promise<any> {

        try {
            const user = await this.userModel.findOne({ email: userLogin.email }).select(' -__v')
            if (!user) {
                return new UnauthorizedException('This email is not registered')
            }

            const checkPassword = await bcrypt.compareSync(userLogin.password, user.password)
            if (!checkPassword) {
                return new UnauthorizedException('Password is not correct! pleas enter password again')
            }

            const { info, accessToken, refreshToken } = await this.returnInfoAndToken(user)

            return { info, accessToken, refreshToken }


        } catch (error) {
            console.log(error);

        }
    }

    async Register(userRegister: CreateUserDto): Promise<any> {
        try {

            const user = await this.userModel.findOne({ email: userRegister.email })
            // check user: trả về lỗi
            if (user && (user.email === userRegister.email)) {
                throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
            }
            const saltRound = parseInt(process.env.BCRYPT_SALT, 10)

            // nếu user chưa có -> tạo user -> trả về token
            const passHashed = await bcrypt.hash(userRegister.password, saltRound)
            const saveUser = await this.userModel.create({
                ...userRegister,
                password: passHashed
            })
            const data = await this.returnInfoAndToken(saveUser)

            return { accessToken: data.accessToken }

        } catch (error) {
            console.log(error);

            throw new Error('register failed');
        }

    }




    // google auth
    async validateSocialLoginUser(user: CreateUserDto): Promise<any> {
        try {
            const exsitedUser = await this.userModel.findOne({ email: user.email })
            if (exsitedUser) {
                const data = await this.returnInfoAndToken(exsitedUser)
                return data.accessToken
            }

            const saveUser = await this.userModel.create(user)


            const data = await this.returnInfoAndToken(saveUser)
            return data.accessToken
        } catch (error) {
            console.log(error);

        }
    }
}
