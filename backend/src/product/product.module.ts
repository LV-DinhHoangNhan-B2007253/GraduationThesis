import { Module } from '@nestjs/common';
import { ProductController } from './controller/controller.controller';
import { ProductService } from './service/service.service';
import { Product, ProductSchema } from './schema/Product.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])]
})
export class ProductModule { }
