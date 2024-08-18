import { Injectable } from '@nestjs/common';
import { Product } from '../schema/Product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
    @InjectModel(Product.name) private ProductModel: Model<Product>
}
