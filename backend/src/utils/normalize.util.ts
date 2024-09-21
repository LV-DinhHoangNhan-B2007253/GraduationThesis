import { HttpException, HttpStatus } from "@nestjs/common";

export function normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function responseError(error: any): any {
    if (error instanceof HttpException) {
        throw error
    } else {
        throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}