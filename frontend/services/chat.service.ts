import axios from './axios.service'


export const GetChatsByUserId = async (userId: string) => {
    try {
        const res = await axios.get(`/chat/getChats/${userId}`)
        return res.data
    } catch (error) {
        console.log(error);
        throw error
    }
}