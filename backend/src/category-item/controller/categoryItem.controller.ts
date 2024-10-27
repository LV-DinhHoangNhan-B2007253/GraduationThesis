import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryItemService } from '../service/categoryItem.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createCategoryItemDto } from '../dtos/createCategoryItem.dto';
@Controller('api/categoryItem')
export class CategoryItemController {
    constructor(private readonly CategoryItemService: CategoryItemService) { }

    @Get('/getAll')
    GetAllCategoryItems() {
        return this.CategoryItemService.getAllCategoryItems()
    }


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
    async CreateNewCategory(@UploadedFile() banner: Express.Multer.File, @Body() createCategoryForm: createCategoryItemDto) {

        const bannerPath = banner ? `http://localhost:3001/uploads/banners/${banner.filename}` : '';
        return this.CategoryItemService.createCategoryItem(createCategoryForm, bannerPath,)
    }
}
