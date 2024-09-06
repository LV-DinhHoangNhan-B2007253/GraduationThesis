import { Module } from '@nestjs/common';
import { CategoryItemController } from './controller/categoryItem.controller';
import { CategoryItemService } from './service/categoryItem.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryItem, CategorySchema } from './schema/CategoryItem.schema'

@Module({
  controllers: [CategoryItemController],
  providers: [CategoryItemService],
  imports: [MongooseModule.forFeature([{ name: CategoryItem.name, schema: CategorySchema }])],
  exports: []
})
export class CategoryItemModule { }
