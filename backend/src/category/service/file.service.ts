import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
        const filePath = `${folder}/${uniqueFilename}`;

        // Bạn có thể tùy chỉnh thêm logic lưu trữ ở đây nếu cần, ví dụ lưu vào S3 hoặc một nơi lưu trữ file khác.

        return filePath; // Trả về đường dẫn của file đã upload
    }

    multerStorageConfig(destination: string) {
        return diskStorage({
            destination: `./uploads`, // Nơi lưu file
            filename: (req, file, cb) => {
                const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
                cb(null, uniqueFilename);
            },
        });
    }
}