import { Injectable } from '@nestjs/common';
import { Category } from '../schema/Category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
    @InjectModel(Category.name) private userModel: Model<Category>
}
