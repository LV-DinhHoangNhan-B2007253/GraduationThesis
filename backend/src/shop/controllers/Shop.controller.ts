import { Body, Controller, Param, Post, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShopService } from '../services/ShopService.service';
import { CreateShopDto, } from '../dtos/createShop.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('api/shop')
export class ShopController {

    constructor(private readonly ShopService: ShopService) { }

    @Post('/create/:userId')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'logoUrl', maxCount: 1 },
            { name: 'shopBanner', maxCount: 1 },
        ], {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    if (file.fieldname === 'logoUrl') {
                        cb(null, './uploads/shop/logo');
                    } else if (file.fieldname === 'shopBanner') {
                        cb(null, './uploads/shop/banner');
                    }
                },
                filename: (req, file, cb) => {
                    const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
                    cb(null, uniqueFilename);
                },
            }),
        }),
    )
    @UsePipes(new ValidationPipe({ transform: true }))
    async CreateNewShop(
        @Param('userId') userId: string,
        @UploadedFiles() files: { logoUrl?: Express.Multer.File[], shopBanner?: Express.Multer.File[] },
        @Body() createShopForm: CreateShopDto,
    ) {
        console.log(files); // Kiểm tra tệp đã tải lên
        console.log(createShopForm);

        // Extract the uploaded files based on their fieldname
        const logoFile = files.logoUrl ? files.logoUrl[0] : null; // Lấy tệp logo
        const bannerFile = files.shopBanner ? files.shopBanner[0] : null; // Lấy tệp banner

        // file path
        const logoFilePath = logoFile ? `http://localhost:3001/uploads/shop/logo/${logoFile.filename}` : null;
        const bannerFilePath = bannerFile ? `http://localhost:3001/uploads/shop/banner/${bannerFile.filename}` : null;

        return this.ShopService.CreateNewShop(logoFilePath, bannerFilePath, createShopForm, userId);
    }
}
