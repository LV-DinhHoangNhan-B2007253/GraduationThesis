import { forwardRef, Module } from '@nestjs/common';
import { ShopController } from './controllers/Shop.controller';
import { ShopService } from './services/ShopService.service';
import { Shop, ShopSchema } from './schemas/Shop.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Promotion, PromotionSchema } from './schemas/Promotion.schema';
import { PromotionService } from './services/Promotion.service';
import { PromotionController } from './controllers/Promotion.controller';
import { ProductModule } from 'src/product/product.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [ShopController, PromotionController],
  providers: [ShopService, PromotionService,],
  imports: [MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema },]), MongooseModule.forFeature([{ name: Promotion.name, schema: PromotionSchema },]), forwardRef(() => AuthModule), forwardRef(() => ProductModule), forwardRef(() => CategoryModule)],
  exports: [ShopService, MongooseModule]
})
export class ShopModule { }
