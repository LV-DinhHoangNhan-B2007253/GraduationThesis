import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../schema/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {

    }

    async getUserInfoById(userId: string): Promise<any> {
        try {
            const user = await this.userModel.findById(userId).select('-password -__v')
            if (!user) {
                return new UnauthorizedException(`cannot get user info with id : ${userId}`)
            }
            return user
        } catch (error) {
            console.log(error);

        }
    }
    async UpdateUserInformation(userId, updateForm): Promise<any> {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                { $set: updateForm },
            );
            if (!updatedUser) {
                throw new HttpException({
                    error: "User not existed",
                    status: HttpStatus.NOT_FOUND
                }, HttpStatus.NOT_FOUND)
            }

            return { message: "Update Success" }

        } catch (error) {
            console.log("Update Info Error:", error);

            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'An unexpected error occurred',
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
