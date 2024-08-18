import { Controller } from '@nestjs/common';
import { CategoryService } from '../service/service.service';

@Controller('api/category')
export class CategoryController {
    constructor(private readonly CategoryService: CategoryService) { }
}
