import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { createProductDto } from '../dtios/createProduct.dto';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post('/:_id/create')
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, cb) => {
                const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
                cb(null, uniqueFilename);
            },
        }),
    }))
    async CreateNewProduct(@UploadedFiles() images: Array<Express.Multer.File>, @Param() categoryItemId: string, @Body() createProductForm: createProductDto) {
        const imagePaths = images.map(image => `http://localhost:3001/uploads/products/${image.filename}`);
        return this.productService.CreateNewProduct(categoryItemId, createProductForm, imagePaths)
    }

    @Get('/getAll')
    GetAllProducts() {
        return this.productService.GetAllProduct()
    }
    @Get('/get/:_id')
    GetProductById(@Param() productId) {
        return this.productService.GetOneProduct(productId)
    }

    @Delete('/delete-by-id/:productId/')
    DeleteOneProduct(@Param('productId') productId,) {

        return this.productService.DeleteOneProduct(productId,)
    }

    @Post('/cart/:userId/add/:productId')
    AddProductToCart(@Param('userId') userId: string, @Param('productId') productId: string) {
        return this.productService.AddToCart(userId, productId)
    }
    @Post('/wishlist/:userId/add/:productId')
    AddProductToWishList(@Param('userId') userId: string, @Param('productId') productId: string) {
        return this.productService.AddToWishList(userId, productId)
    }

    @Get('/search')
    SearchProducts(@Query('q') query: string) {
        return this.productService.SearchProduct(query)
    }
}