import { Injectable } from '@nestjs/common';
import { json } from 'stream/consumers';

@Injectable()
export class AuthService {

    helloWord(): string {

        return 'Hello World! Huuuray!!!';
    }
}
