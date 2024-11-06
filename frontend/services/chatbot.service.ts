import axios from './rasaConfig.service'

export const MessToChatbot = async (form: any) => {
    try {
        const res = await axios.post('webhook', form)
        return res.data
    } catch (error) {
        throw error
    }
}