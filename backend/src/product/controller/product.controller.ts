import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { createProductDto } from '../dtos/createProduct.dto';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { updateProductDto } from '../dtos/updateProduct.dos';

@Controller('api/product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }


    // đồng bộ các trường dữ liệu sau khi sửa
    @Patch('/syncData')
    SyncData() {
        return this.productService.migrateProducts()
    }


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
    GetAllProducts(@Query('page') page: number = 1, @Query('limit') limit: number = 30) {
        return this.productService.GetAllProduct(page, limit)
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
    @Get('/byCategory/:_id')

    GetProductsByCategoryItem(@Param() categoryItemId: string) {
        return this.productService.GetProductsByCategoryItem(categoryItemId)
    }


    @Get('/:_id/related')
    GetRelatedProduct(@Param() productId: string) {
        return this.productService.GetRelatedProduct(productId)
    }
    @Get('/outstanding')
    GetOutStandingProduct() {
        return this.productService.getOutstandingProducts()
    }

    @Get('/byShop/:ownerId')
    GetProductsByOwner(@Query('page') page: number = 1, @Query('limit') limit: number = 30, @Param('ownerId') ownerId: string) {
        return this.productService.GetProductByOwnerIdWithPage(page, limit, ownerId)
    }

    @Patch('/update/:_id')
    UpdateProductInfo(@Param() productId: string, @Body() updateProductBody: updateProductDto) {

        return this.productService.UpdateProductInfo(updateProductBody, productId)
    }

    @Get('/get/shop/:shop_id')
    GetAllProductsOfShop(@Param('shop_id') shop_id: string) {
        return this.productService.getAllProductOfShop(shop_id)
    }

    // trả về thông tin sản phẩm cho trang analyze ở client, đã chuẩn hóa đầy đủ các trường cần thiết

    @Get('/get/analyze/:productId')
    GetAnalyzeProductInfo(@Param('productId') productId: string) {
        return this.productService.getAnalyzeProductInfo(productId)
    }

    @Get('/recomment')
    async GetRecommentProducts() {
        return this.productService.getRecommendedProducts()
    }

    // test các chức năng
}
