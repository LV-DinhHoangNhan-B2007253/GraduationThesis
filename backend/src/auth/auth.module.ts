import { forwardRef, Module } from '@nestjs/common';
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
import { ProductModule } from 'src/product/product.module';
import { AddressController } from './controllers/address.controller';
@Module({
    controllers: [AuthController, UserController, AddressController],
    providers: [AuthService, GoogleStrategy, UserService,],
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },

        ]),
        ConfigModule.forFeature(googleOauthConfig),
        JwtModule.register({
            secret: process.env.ACCESS_TOKEN_SECRET
        }),
        forwardRef(() => ProductModule)
    ],
    exports: [MongooseModule, UserService]
})
export class AuthModule { }
