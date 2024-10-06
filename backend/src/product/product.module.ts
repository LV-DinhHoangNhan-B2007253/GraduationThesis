import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { Product, ProductSchema } from './schema/Product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryItemModule } from 'src/category-item/category-item.module';
import { CategoryItemService } from 'src/category-item/service/categoryItem.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/auth/service/user.service';
import { Comment, CommentSchema } from './schema/ProductComment.schema';
import { CommentController } from './controller/comment.controller';

@Module({
  controllers: [ProductController, CommentController],
  providers: [ProductService, CategoryItemService, UserService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), forwardRef(() => CategoryItemModule), forwardRef(() => AuthModule)
  ],
  exports: [MongooseModule, ProductService]
})
export class ProductModule { }
