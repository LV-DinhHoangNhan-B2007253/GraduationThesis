'use client'
import axios from './axios.service'

export const GetAllCategory = async () => {
    try {
        const res = await axios.get('/categoryItem/getAll')
        return res.data
    } catch (error) {
        console.log(error);

    }
}

export const GetCategoryItems = async (categoryId: string) => {
    try {
        const res = await axios.get(`/category/${categoryId}/items`)
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