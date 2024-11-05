import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom, Observable, throwError } from 'rxjs';

// port:"http://127.0.0.1:8000/"
@Injectable()
export class ClassifyService {
    constructor(private readonly httpService: HttpService,
    ) { }



    async LOGISTIC(comments: string[]) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`http://127.0.0.1:8000/predict/logistic`, { comments }).pipe(
                    catchError((error: AxiosError) => {
                        // Xử lý lỗi tại đây
                        console.error('Error making request:', error.response?.data || error.message);
                        throw error; // Ném lại lỗi để xử lý ngoài
                    })
                )
            );
            return response.data; // Trả về dữ liệu phản hồi {comment,label}
        } catch (error) {
            console.error('Request failed:', error);
            throw new Error('Failed to classify comments.'); // Ném lại lỗi để xử lý ở nơi gọi
        }
    }

    async SVM(comments: string[]) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`http://127.0.0.1:8000/predict/svm`, { comments }).pipe(
                    catchError((error: AxiosError) => {
                        // Xử lý lỗi tại đây
                        console.error('Error making request:', error.response?.data || error.message);
                        throw error; // Ném lại lỗi để xử lý ngoài
                    })
                )
            );
            return response.data; // Trả về dữ liệu phản hồi {comment,label}
        } catch (error) {
            console.error('Request failed:', error);
            throw new Error('Failed to classify comments.'); // Ném lại lỗi để xử lý ở nơi gọi
        }
    }


    async KNN(comments: string[]) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`http://127.0.0.1:8000/predict/knn`, { comments }).pipe(
                    catchError((error: AxiosError) => {
                        // Xử lý lỗi tại đây
                        console.error('Error making request:', error.response?.data || error.message);
                        throw error; // Ném lại lỗi để xử lý ngoài
                    })
                )
            );
            return response.data; // Trả về dữ liệu phản hồi {comment,label}
        } catch (error) {
            console.error('Request failed:', error);
            throw new Error('Failed to classify comments.'); // Ném lại lỗi để xử lý ở nơi gọi
        }
    }

    async RANDOM_FOREST(comments: string[]) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`http://127.0.0.1:8000/predict/random_forest`, { comments }).pipe(
                    catchError((error: AxiosError) => {
                        // Xử lý lỗi tại đây
                        console.error('Error making request:', error.response?.data || error.message);
                        throw error; // Ném lại lỗi để xử lý ngoài
                    })
                )
            );
            return response.data; // Trả về dữ liệu phản hồi {comment,label}
        } catch (error) {
            console.error('Request failed:', error);
            throw new Error('Failed to classify comments.'); // Ném lại lỗi để xử lý ở nơi gọi
        }
    }


    async hello(): Promise<any> {
        try {
            const response = await lastValueFrom(
                this.httpService.get(`http://127.0.0.1:8000/`)
            );
            return response.data; // Trả về dữ liệu từ phản hồi
        } catch (error) {
            // Xử lý lỗi nếu có
            throw new Error(`Error in hello: ${error.message}`);
        }

    }
}
