import { Controller, Get } from '@nestjs/common';
import { CategoryItemService } from '../service/categoryItem.service';

@Controller('api/categoryItem')
export class CategoryItemController {
    constructor(private readonly CategoryItemService: CategoryItemService) { }

    @Get('/getAll')
    GetAllCategoryItems() {
        return this.CategoryItemService.getAllCategoryItems()
    }
}
