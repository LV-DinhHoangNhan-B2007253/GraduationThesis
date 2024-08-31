'use client'
import { IRegisterForm } from '@/interfaces/auth.interface';
import axios from './axios.service'
import { toast } from 'react-toastify';


export const RegisterUser = async (formData: IRegisterForm): Promise<any> => {
    try {
        const res = await axios.post('/auth/register', formData)
        return res.data
    } catch (error: any) {
        toast.error('Email đã tồn tại')
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

