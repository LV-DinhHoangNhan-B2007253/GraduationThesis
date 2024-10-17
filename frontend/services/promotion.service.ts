import { create } from 'domain'
import axios from './axios.service'
import { ReSponseError } from './product.service'

export const GetPromotionsOfShop = async (shopId: string) => {
    try {
        const res = await axios.get(`/promotion/get/${shopId}`)
        return res.data
    } catch (error) {
        ReSponseError(error)
    }
}

export const CreateNewPromotion = async (formData: any) => {
    try {
        const res = await axios.post('/promotion/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return res.data
    } catch (error) {
        console.log(error);
        ReSponseError(error)
    }
}

export const UpdatePromotion = async (formData: any, promoId: string) => {
    try {
        const res = await axios.patch(`/promotion/update/${promoId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return res.data
    } catch (error) {
        console.log(error);
        ReSponseError(error)
    }
}

export const deletePromotion = async (promoId: string) => {
    try {
        const response = await axios.delete(`/promotion/delete/${promoId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting promotion:', error);
        // Xử lý lỗi tại đây
    }
};

export const GetPromotionsDetailById = async (promotionId: string) => {
    try {
        const res = await axios.get(`/promotion/get/detail/${promotionId}`)
        return res.data
    } catch (error) {
        console.log(error);
        ReSponseError(error)
    }
}