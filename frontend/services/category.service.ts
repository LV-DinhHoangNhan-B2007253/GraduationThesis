'use client'
import axios from './axios.service'

export const GetAllCategory = async () => {
    try {
        const res = await axios.get('/category/getAll')
        return res.data
    } catch (error) {
        console.log(error);

    }
}

// export const GetCategoryItems = async (categoryId: string) => {
//     try {
//         const res = await axios.get(`/category/${categoryId}/items`)
//         return res.data
//     } catch (error: any) {
//         if (error.response) {
//             // Trả thông điệp lỗi từ server
//             return Promise.reject(error.response.data.error);
//         } else if (error.request) {
//             return Promise.reject('No response received from server');
//         } else {
//             return Promise.reject(error.error);
//         }
//     }
// }

export const searchProductAndShop = async (query: string) => {
    try {
        const res = await axios.get(`/category/search?query=${query}`)
        return res.data
    } catch (error) {
        console.log("sear product and shop error", error);

    }
}

export const GetCategoryAndProductByShopId = async (shopId: string) => {
    try {
        const res = await axios.get(`/category/shop/${shopId}`)
        // res = {category,products}
        return res.data
    } catch (error) {
        throw error
    }
}


export const RemoveProductFromCategory = async (categoryId: string, productIds: string[]) => {
    try {
        const res = await axios.delete(`/category/delete/product/${categoryId}`, { data: { productIds } })
        return res.data
    } catch (error) {
        console.log(error);
        throw error

    }
}

export const UpdateCategoryInfo = async (categoryId: string, editInfo: any) => {
    try {
        const res = await axios.patch(`/category/update/${categoryId}`, editInfo)
        return res.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const CreateNewCategory = async (createCategoryForm: any) => {
    try {
        const res = await axios.post('/category/create', createCategoryForm, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return res.data
    } catch (error) {
        console.log(error);
        throw error
    }
}


export const AddProductsToCategory = async (categoryId: string, products: any) => {
    try {
        const res = await axios.post(`/category/add/${categoryId}`, products)
        return res.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const DeleteOneCategoryById = async (categoryId: string) => {
    try {
        const res = await axios.delete(`/category/delete/${categoryId}`)
        return res.data
    } catch (error) {
        console.log(error);
        throw error
    }
}