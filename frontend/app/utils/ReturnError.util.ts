export const ReturnError = (error: any) => {
    if (error.response) {
        // Trả thông điệp lỗi từ server
        return Promise.reject(error.response.data.error);
    } else if (error.request) {
        return Promise.reject('No response received from server');
    } else {
        return Promise.reject(error.error);
    }
}