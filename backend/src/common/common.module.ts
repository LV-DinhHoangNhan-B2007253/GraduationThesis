import { Module, } from '@nestjs/common';
import { ClassifyService } from './classify.service';
import { HttpModule } from '@nestjs/axios'
@Module({
  imports: [HttpModule],
  providers: [ClassifyService],
  exports: [ClassifyService, HttpModule]
})
export class CommonModule { }
