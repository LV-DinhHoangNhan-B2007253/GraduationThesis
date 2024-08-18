import { Controller } from '@nestjs/common';
import { OrderService } from '../service/service.service';

@Controller('api/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }
}
