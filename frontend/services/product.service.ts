'use client'
import axios from './axios.service'

export const CreateNewProduct = async (categoryId: string, createProductForm: any) => {
    try {
        const res = await axios.post(`/product/${categoryId}/create`, createProductForm, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return res.data
    } catch (error: any) {
        if (error.response) {
            // Trả thông điệp lỗi từ server
            return Promise.reject(error.response.data.error);
        } else if (error.request) {
            return Promise.reject('No response received from server');
        } else {
            return Promise.reject(error.error);
        }
    }

}

export const GetAllProducts = async (page: number, limit: number) => {
    try {
        const res = await axios.get(`/product/getAll?page=${page}&limit=${limit}`)
        return res.data
    } catch (error) {
        console.log(error);

    }
}


export const GetOneProduct = async (productId: string) => {
    try {
        const res = await axios.get(`/product/get/${productId}`)
        return res.data
    } catch (error: any) {
        if (error.response) {
            // Trả thông điệp lỗi từ server
            return Promise.reject(error.response.data.error);
        } else if (error.request) {
            return Promise.reject('No response received from server');
        } else {
            return Promise.reject(error.error);
        }
    }


}

export const DeleteOneProduct = async (productId: string,) => {
    try {
        const res = await axios.delete(`/product/delete-by-id/${productId}`,)
        return res.data
    } catch (error: any) {
        if (error.response) {
            // Trả thông điệp lỗi từ server
            return Promise.reject(error.response.data.error);
        } else if (error.request) {
            return Promise.reject('No response received from server');
        } else {
            return Promise.reject(error.error);
        }
    }
}

export const AddToCart = async (userId: string, productId: string) => {
    try {
        const res = await axios.post(`/product/cart/${userId}/add/${productId}`)
        return res.data
    } catch (error: any) {
        if (error.response) {
            // Trả thông điệp lỗi từ server
            return Promise.reject(error.response.data.error);
        } else if (error.request) {
            return Promise.reject('No response received from server');
        } else {
            return Promise.reject(error.error);
        }
    }
}


export const AddToWishList = async (userId: string, productId: string) => {
    try {
        const res = await axios.post(`/product/wishlist/${userId}/add/${productId}`)
        return res.data
    } catch (error: any) {
        if (error.response) {
            // Trả thông điệp lỗi từ server
            return Promise.reject(error.response.data.error);
        } else if (error.request) {
            return Promise.reject('No response received from server');
        } else {
            return Promise.reject(error.error);
        }
    }
}

export const GetProductInCart = async (userId: string) => {
    try {
        const res = await axios.get(`/user/${userId}/cart`)
        return res.data
    } catch (error: any) {
        if (error.response) {
            // Trả thông điệp lỗi từ server
            return Promise.reject(error.response.data.error);
        } else if (error.request) {
            return Promise.reject('No response received from server');
        } else {
            return Promise.reject(error.error);
        }
    }
}

export const GetProductInWishList = async (userId: string) => {
    try {
        const res = await axios.get(`/user/${userId}/wishlist`)
        return res.data
    } catch (error: any) {
        if (error.response) {
            // Trả thông điệp lỗi từ server
            return Promise.reject(error.response.data.error);
        } else if (error.request) {
            return Promise.reject('No response received from server');
        } else {
            return Promise.reject(error.error);
        }
    }
}

export const SearchProduct = async (query: string) => {
    try {
        const res = await axios.get(`/product/search?q=${query}`)
        return res.data
    } catch (error) {
        ReSponseError(error)
    }
}

export const ReSponseError = (error: any) => {
    if (error.response) {
        // Trả thông điệp lỗi từ server
        return Promise.reject(error.response.data.error);
    } else if (error.request) {
        return Promise.reject('No response received from server');
    } else {
        return Promise.reject(error.error);
    }
}


export const GetProductByCategory = async (categoryId: string) => {
    try {
        const res = await axios.get(`/product/byCategory/${categoryId}`)
        return res.data
    } catch (error) {
        ReSponseError(error)
    }
}

export const GetRelatedProducts = async (productId: string) => {
    try {
        const res = await axios.get(`/product/${productId}/related`)
        return res.data
    } catch (error) {
        ReSponseError(error)
    }
}

// todo

export const RemoveProductInCart = async (userId: string, productId: string) => {
    try {
        const res = await axios.patch(`/user/${userId}/cart/remove/${productId}`)
        return res.data
    } catch (error) {
        ReSponseError(error)
    }
}

export const RemoveProductInWishList = async (userId: string, productId: string) => {
    try {
        const res = await axios.patch(`/user/${userId}/wishlist/remove/${productId}`)
        return res.data
    } catch (error) {
        ReSponseError(error)
    }
}

export const UpdateProductQuantityInCart = async (userId: string, productId: string, updateBody: { updateQuantity: number }) => {
    try {
        const res = await axios.patch(`/user/${userId}/cart/update/${productId}`, updateBody)
        return res.data
    } catch (error) {
        ReSponseError(error)
    }
}


export const UpdateProductInfo = async (productId: string, updateProductForm: any) => {
    try {
        const res = await axios.patch(`/product/update/${productId}`, updateProductForm)
        return res.data
    } catch (error) {
        ReSponseError(error)
    }
}

export const GetOutStandingProducts = async () => {
    try {
        const res = await axios.get('/product/outstanding')
        return res.data
    } catch (error) {
        ReSponseError(error)
    }
}