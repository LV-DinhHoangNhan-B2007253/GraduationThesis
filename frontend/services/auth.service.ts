'use client'
import { EXPORT_DETAIL } from 'next/dist/shared/lib/constants';
import axios from './axios.service'
import { ILoginFrom, IRegisterForm } from '@/interfaces/auth.interface';


export const RegisterUser = async (formData: IRegisterForm): Promise<any> => {
    try {
        const res = await axios.post('/auth/register', formData)
        return res.data
    } catch (error: any) {
        if (error.response) {
            return Promise.reject(error.response.data.message)
        }
        else if (error.request) {
            return Promise.reject("No response received from server")
        }
        else {
            return Promise.reject(error.error)
        }
    }
}

export const LoginUser = async (loginForm: ILoginFrom) => {
    try {
        const res = await axios.post('/auth/login', loginForm)
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


export const GetUserInfo = async () => {
    try {
        const res = await axios.get('/user/getProfile')
        return res.data
    } catch (error) {
        return null
    }
}


export const GetOneUserById = async (userId: string) => {
    try {
        const res = await axios.get(`/user/getOne/${userId}`)
        return res.data
    } catch (error) {
        console.log(error);

    }
}