import { Injectable } from '@nestjs/common';
import { CategoryItem } from '../schema/CategoryItem.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryItemService {
    @InjectModel(CategoryItem.name) private ItemModel: Model<CategoryItem>
}
