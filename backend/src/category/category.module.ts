import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/Category.schema';
import { CategoryItemModule } from 'src/category-item/category-item.module';
import { CategoryItemService } from 'src/category-item/service/categoryItem.service';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/service/product.service';
import { FileService } from './service/file.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryItemService, ProductService, FileService],
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]), CategoryItemModule, ProductModule, AuthModule]
})
export class CategoryModule { }
