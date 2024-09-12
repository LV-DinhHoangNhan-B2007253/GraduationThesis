import { forwardRef, Module } from '@nestjs/common';
import { CategoryItemController } from './controller/categoryItem.controller';
import { CategoryItemService } from './service/categoryItem.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryItem, CategoryItemSchema } from './schema/CategoryItem.schema'
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/service/product.service';
import { UserService } from 'src/auth/service/user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CategoryItemController],
  providers: [CategoryItemService, ProductService],
  imports: [MongooseModule.forFeature([{ name: CategoryItem.name, schema: CategoryItemSchema }]), forwardRef(() => ProductModule), forwardRef(() => AuthModule)],
  exports: [MongooseModule]
})
export class CategoryItemModule { }
