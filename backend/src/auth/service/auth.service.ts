import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/User.schema';

@Injectable()
export class AuthService {
    @InjectModel(User.name) private userModel: Model<User>

    helloWord(): string {

        return 'Hello World! Huuuray!!!';
    }
}
