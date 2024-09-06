'use client'
import { IUserUpdateInfo } from '@/interfaces/auth.interface'
import axios from './axios.service'

export const UpdateUserInfo = async (userForm: IUserUpdateInfo) => {
    try {
        const res = await axios.patch('/user/updateInfo', userForm)
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