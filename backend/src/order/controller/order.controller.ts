import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { createOrderDto } from '../dtos/createOrder.dto';

@Controller('api/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('/create')
    CreateOrder(@Body() createOrderForm: createOrderDto) {
        return this.orderService.CreateOrder(createOrderForm)
    }

    @Get('/find/:userId')
    FindOrderOfUser(@Param('userId') userId: string) {
        return this.orderService.FindOrderOfUser(userId)
    }
    @Patch('/updateStatus/:_id')
    UpdateOrderStatus(@Param() orderId: string, @Body() updateOrderStatus: { status: string }) {

        return this.orderService.UpdateOrderStatus(orderId, updateOrderStatus)
    }
}
