// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { Category } from '../schema/Category.schema';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { CreateCategoryDto } from '../dtos/create-category.dto';
// import { CategoryItemService } from 'src/category-item/service/categoryItem.service';

// import { normalizeName } from "../../utils/normalize.util"
// import { ProductService } from 'src/product/service/product.service';
// import { FileService } from './file.service';
// import path from 'path';

// @Injectable()
// export class CategoryService {
//     constructor(@InjectModel(Category.name) private CategoryModel: Model<Category>,
//         private readonly CategoryItemService: CategoryItemService,
//         private readonly ProductService: ProductService,
//     ) { }



//     /**
//      *
//      * @param createCategory category form
//      * @param bannerPath image bath
//      * @returns message: string
//      */
//     async createCategory(createCategory: CreateCategoryDto, bannerPath: string): Promise<any> {
//         try {
//             const normalize = normalizeName(createCategory.name)
//             const foundCategory = await this.CategoryModel.findOne({ name: normalize })
//             if (foundCategory) {
//                 throw new HttpException({
//                     status: HttpStatus.CONFLICT,
//                     error: `This '${createCategory.name}' area existed!`
//                 }, HttpStatus.CONFLICT)
//             }
//             await this.CategoryModel.create({ ...createCategory, banner: bannerPath });
//             return { message: `Create '${createCategory.name}' area Success` }
//         } catch (error) {
//             console.log("Create new area error", error);
//             if (error instanceof HttpException) {
//                 throw error
//             } else {

//                 throw new HttpException({
//                     status: HttpStatus.INTERNAL_SERVER_ERROR,
//                     error: "Internal server error"
//                 }, HttpStatus.INTERNAL_SERVER_ERROR)
//             }
//         }
//     }

//     // async addCategoryItem(categoryId: string, Item): Promise<any> {
//     //     try {
//     //         const foundCategory = await this.CategoryModel.findById(categoryId)
//     //         if (!foundCategory) {
//     //             throw new HttpException({
//     //                 status: HttpStatus.NOT_FOUND,
//     //                 error: `this category id:  '${categoryId}'  not found!'`
//     //             }, HttpStatus.NOT_FOUND)
//     //         }
//     //         const newCategoryItem = await this.CategoryItemService.createCategoryItem(Item)
//     //         foundCategory.categoryItem.push(new Types.ObjectId(newCategoryItem._id as string))
//     //         await foundCategory.save()
//     //         return { message: `Add ${newCategoryItem.name} category success` }
//     //     } catch (error) {
//     //         console.log("addCategoryItem error", error);
//     //         if (error instanceof HttpException) {
//     //             throw error
//     //         } else {

//     //             throw new HttpException({
//     //                 status: HttpStatus.INTERNAL_SERVER_ERROR,
//     //                 error: "Internal server error"
//     //             }, HttpStatus.INTERNAL_SERVER_ERROR)
//     //         }
//     //     }
//     // }

//     async getCategoryItem(categoryId: string): Promise<any> {
//         try {


//             const Items = await this.CategoryModel.findById(categoryId).populate('categoryItem').exec()
//             if (!Items) {
//                 throw new HttpException({
//                     status: HttpStatus.NOT_FOUND,
//                     error: "items not found"
//                 }, HttpStatus.NOT_FOUND)
//             }
//             return Items.categoryItem
//         } catch (error) {
//             console.log(error);

//         }
//     }

//     async getAllCategory(): Promise<Category[]> {
//         try {
//             const listCategory = await this.CategoryModel.find()
//             return listCategory
//         } catch (error) {
//             console.log();
//         }
//     }

//     async getCategoryAndItemsLabels(): Promise<Category[]> {
//         try {
//             const data = await this.CategoryModel.find().populate({
//                 path: 'categoryItem',
//                 select: '_id name',
//             }).select('-__v').exec()
//             return data
//         } catch (error) {
//             console.log(error);

//         }
//     }

//     async getOneCategoryAndItemsLabelsById(categoryId): Promise<Category> {
//         try {
//             const data = await this.CategoryModel.findById(categoryId).populate({
//                 path: 'categoryItem',
//                 populate: {
//                     path: 'products'
//                 }
//             }).select('-__v').exec()
//             return data
//         } catch (error) {
//             console.log(error);

//         }
//     }

// }

