'use client'
import { ICreateArea } from '@/interfaces/area.interface'
import axios from './axios.service'
import { ICategory } from '@/interfaces/category.interface'

export const CreateArea = async (formData: any) => {
    try {
        const res = await axios.post('/category/create', formData, {
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

export const GetAllArea = async () => {
    try {
        const res = await axios.get('/category/getAll')
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

export const AddCategoryItem = async (categoryId: string, Item: string) => {
    try {
        const res = await axios.post(`/category/add/categoryItem/${categoryId}`, Item)
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
export const GetAreaAndCategoryLabel = async () => {
    try {
        const res = await axios.get('/category/get/category/item/label')
        return res.data
    } catch (error) {
        console.log(error);

    }
}