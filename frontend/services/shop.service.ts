import axios from './axios.service'
import { ReSponseError } from './product.service'

export const CreateShop = async (userId: string, createShopForm: FormData) => {
    try {
        const res = await axios.post(`/shop/create/${userId}`, createShopForm, {
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

export const GetShopInfoByUserId = async (shop_id: string) => {
    try {
        const res = await axios.get(`shop/${shop_id}`)
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