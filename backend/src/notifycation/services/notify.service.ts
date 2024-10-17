import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class NotifyService {


    @WebSocketServer()
    server: Server;

    // Hàm gửi thông báo cho người bán
    async notifySeller(sellerId: string, order: any) {
        // Phát thông báo cho người bán qua socket
        this.server.to(sellerId).emit('orderNotification', {
            message: 'Bạn có đơn đặt hàng mới',
            order,
        });
    }
}
