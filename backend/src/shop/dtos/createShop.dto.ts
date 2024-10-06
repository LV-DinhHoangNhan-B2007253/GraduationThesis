import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateShopDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEmail()
    shopMail: string;

    @IsNotEmpty()
    @IsString()
    shopPhone: string;

    @IsNotEmpty()
    @IsString()
    shopLocation: string;

    logoUrl: string

    shopBanner: string

}