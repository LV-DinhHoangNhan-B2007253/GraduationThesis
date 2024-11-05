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
        const res = await fastService.post('/predict/logistic', { comments })
        console.log(res.data);
        return res.data
    } catch (error) {
        console.log(error);

    }
}


export const ClassifyCommentWithMethod = async (comments: any, method: string) => {
    try {
        // method: svm,knn,logistic,random_forest
        const res = await fastService.post(`/predict/${method}`, { comments })
        console.log(res.data);
        return res.data
    } catch (error) {
        console.log(error);

    }
}


