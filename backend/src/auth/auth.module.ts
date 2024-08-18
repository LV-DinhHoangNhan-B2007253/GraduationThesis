import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./service/auth.service";
import { UserSchema, User } from "./schema/User.schema";
import { MongooseModule } from "@nestjs/mongoose";
@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])]
})
export class AuthModule { }