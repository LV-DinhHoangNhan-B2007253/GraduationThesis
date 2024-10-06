import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Comment } from '../schema/ProductComment.schema';
@Injectable()
export class ProductService {
    constructor(@InjectModel(Comment.name) private ProductModel: Model<Comment>,

    ) { }
}
