import axios from './axios.service'

import fastService from './fastAPI.service'

export const CreateProductRating = async (ratingForm: any) => {
    try {
        const res = await axios.post(`/review/create`, ratingForm, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log(res.data);

    } catch (error) {
        console.log(error);

    }
}

// classi comments
export const ClassifyComments = async (comments: any) => {
    try {
        const res = await fastService.post('/predict', { comments })
        console.log(res.data);
        return res.data
    } catch (error) {
        console.log(error);

    }
}