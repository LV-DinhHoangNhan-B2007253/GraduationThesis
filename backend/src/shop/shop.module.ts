import { Module } from '@nestjs/common';
import { ShopController } from './controllers/Shop.controller';
import { ShopService } from './services/ShopService.service';
import { Shop, ShopSchema } from './schemas/Shop.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [MongooseModule.forFeature([
    { name: Shop.name, schema: ShopSchema },

  ]), AuthModule]
})
export class ShopModule { }
