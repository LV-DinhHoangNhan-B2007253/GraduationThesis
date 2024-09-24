import { ReturnError } from '@/app/utils/ReturnError.util'
import axios from './axios.service'

export const CreateOrder = async (createOrderForm: any) => {
    try {
        const res = await axios.post('/order/create', createOrderForm)
        return res.data
    } catch (error) {

    }
}

export const GetOrderOfUser = async (userId: string) => {
    try {
        const res = await axios.get(`/order/find/${userId}`)
        return res.data
    } catch (error) {
        console.log(error);


    }
}

export const UpdateOrderStatus = async (orderId: string, status: string) => {
    try {
        const res = await axios.patch(`/order/updateStatus/${orderId}`, { status })
        return res.data
    } catch (error: any) {
        ReturnError(error)
    }
}