import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema, } from './schema/Category.schema'
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/service/product.service';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, ProductService,],
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]), forwardRef(() => ProductModule), forwardRef(() => AuthModule), forwardRef(() => CommonModule), forwardRef(() => ShopModule)],
  exports: [MongooseModule, CategoryService]
})
export class CategoryModule { }
