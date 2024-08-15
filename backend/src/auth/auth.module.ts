import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./service/auth.service";
@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: []
})
export class AuthModule { }