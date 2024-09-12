import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { createCategoryItemDto } from '../dtos/create-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
@Controller('api/category')
export class CategoryController {
    constructor(
        private readonly CategoryService: CategoryService,
    ) { }



    @Post('/create')
    @UseInterceptors(FileInterceptor('banner', {
        storage: diskStorage({
            destination: './uploads/banners'
            , filename: (req, file, cb) => {
                const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
                cb(null, uniqueFilename);
            }
        })
    }))
    async CreateNewCategory(@UploadedFile() banner: Express.Multer.File, @Body() createCategory: CreateCategoryDto) {

        const bannerPath = banner ? `http://localhost:3001/uploads/banners/${banner.filename}` : '';
        return this.CategoryService.createCategory(createCategory, bannerPath)
    }

    @Post('/add/categoryItem/:_id')
    AddCategoryItem(@Param() categoryId: string, @Body() item: createCategoryItemDto) {
        return this.CategoryService.addCategoryItem(categoryId, item)
    }

    @Get('/:_id/items')
    GetCategoryItems(@Param() categoryId: string) {
        return this.CategoryService.getCategoryItem(categoryId)
    }

    @Get('/getAll')
    GetAllCategory() {
        return this.CategoryService.getAllCategory()
    }
}
