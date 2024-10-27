import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, Observable, throwError } from 'rxjs';

// port:"http://127.0.0.1:8000/"
@Injectable()
export class ClassifyService {
    constructor(private readonly httpService: HttpService,
    ) { }

    async testPredict(commnets: string[]) {
        return await this.httpService.post(`http://127.0.0.1:8000/predict`, { commnets })
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
