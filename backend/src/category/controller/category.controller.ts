import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createCategoryItemDto } from '../dtos/createCategoryItem.dto';
import { query } from 'express';
@Controller('api/category')
export class CategoryController {
    constructor(private readonly CategoryService: CategoryService) { }

    @Get('/getAll')
    GetAllCategoryItems() {
        return this.CategoryService.getAllCategoryItems()
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
        return this.CategoryService.createCategoryItem(createCategoryForm, bannerPath,)
    }
    // lấy các sản phẩm của 1 danh mục theo id
    @Get('/get/:categoryId')
    async GetProductsByCategory(@Param('categoryId') categoryId: string) {
        return this.CategoryService.getProductsByCategory(categoryId)
    }

    @Get('/shop/:shopId')
    async GetCategoryAndProductsByShop(@Param('shopId') shopId: string) {
        return this.CategoryService.getCategorAndProductOfShop(shopId)
    }

    @Get('/search')
    async GetShopInfoNProductsBySearch(@Query('query') query: string) {
        return this.CategoryService.getProductsByQuery(query)
        // return query
    }
}
