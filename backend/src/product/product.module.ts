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
import { ProductReview } from './controller/comment.controller';
import { ProductReviewService } from './service/comment.service';
import { CommonModule } from 'src/common/common.module';
import { ClassifyService } from 'src/common/classify.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ProductController, ProductReview],
  providers: [ProductService, CategoryItemService, UserService, ProductReviewService, ClassifyService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), forwardRef(() => CategoryItemModule), forwardRef(() => AuthModule,), forwardRef(() => CommonModule),
    HttpModule
  ],
  exports: [MongooseModule, ProductService]
})
export class ProductModule { }
