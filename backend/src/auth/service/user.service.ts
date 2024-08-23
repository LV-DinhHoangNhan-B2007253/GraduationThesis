import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../schema/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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
}
