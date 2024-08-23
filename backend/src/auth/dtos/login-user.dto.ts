import { IsEmail, IsString } from "class-validator"

export class userLoginDto {
    @IsEmail()
    email: string

    @IsString()
    password: string
}