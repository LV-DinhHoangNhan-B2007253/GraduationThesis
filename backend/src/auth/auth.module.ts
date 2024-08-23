import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './service/auth.service';
import { UserSchema, User } from './schema/User.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth-config';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controllers/user.controller';
import { UserService } from './service/user.service';
@Module({
    controllers: [AuthController, UserController],
    providers: [AuthService, GoogleStrategy, UserService,],
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },

        ]),
        ConfigModule.forFeature(googleOauthConfig),
        JwtModule.register({
            secret: process.env.ACCESS_TOKEN_SECRET
        }),
    ],
})
export class AuthModule { }
