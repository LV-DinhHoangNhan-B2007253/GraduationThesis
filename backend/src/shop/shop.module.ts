import { Module } from '@nestjs/common';
import { ShopController } from './controllers/Shop.controller';
import { ShopService } from './services/ShopService.service';
import { Shop, ShopSchema } from './schemas/Shop.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Promotion, PromotionSchema } from './schemas/Promotion.schema';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema },]), MongooseModule.forFeature([{ name: Promotion.name, schema: PromotionSchema },]), AuthModule,]
})
export class ShopModule { }
