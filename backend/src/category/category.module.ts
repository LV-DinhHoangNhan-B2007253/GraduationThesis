import { Module } from '@nestjs/common';
import { CategoryController } from './controller/controller.controller';
import { CategoryService } from './service/service.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/Category.schema';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])]
})
export class CategoryModule { }
