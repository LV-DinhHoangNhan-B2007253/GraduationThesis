import { Controller } from '@nestjs/common';
import { ProductService } from '../service/service.service';

@Controller('api/product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
}
