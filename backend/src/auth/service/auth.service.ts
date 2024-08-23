import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/User.schema';
import { CreateUserDto } from '../dtos/create-user.dto';

import * as bcrypt from 'bcrypt';
import { userLoginDto } from '../dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';


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

            if (user && (user.email === userRegister.email)) {
                return new UnauthorizedException(
                    'The account already exists, please choose another account name',
                );
            }
            const saltRound = parseInt(process.env.BCRYPT_SALT)

            const passHashed = await bcrypt.hash(userRegister.password, saltRound)
            await this.userModel.create({
                ...userRegister,
                password: passHashed
            })

            return { message: 'create account success' }

        } catch (error) {
            console.log(error);

            throw error('register failed');
        }

    }




    // google auth
    async validateGoogleUser(user: CreateUserDto): Promise<any> {
        try {
            const exsitedUser = await this.userModel.findOne({ email: user.email })
            if (exsitedUser) {
                const data = this.returnInfoAndToken(exsitedUser)
                return data
            }

            const saveUser = await this.userModel.create(user)
            console.log(saveUser);

            const data = this.returnInfoAndToken(saveUser)
            return data
        } catch (error) {
            console.log(error);

        }
    }
}
