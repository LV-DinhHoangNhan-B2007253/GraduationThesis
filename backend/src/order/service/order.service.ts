import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from '../schema/Order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createOrderDto } from '../dtos/createOrder.dto';
import { responseError } from 'src/utils/normalize.util';
import { ProductService } from 'src/product/service/product.service';
import { UserService } from 'src/auth/service/user.service';
import { error } from 'console';
import { NotifyService } from 'src/notifycation/services/notify.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private OrderModel: Model<Order>,
        private readonly productService: ProductService,
        private readonly userService: UserService,
        private readonly NotifyService: NotifyService

    ) { }


    async GetAllOrder(): Promise<Order[]> {
        try {
            const orders = await this.OrderModel.find().exec()
            return orders
        } catch (error) {
            console.log("Get all orders Error", error);

            responseError(error)
        }
    }

    // lấy danh sách các đơn hàng của 1 shop theo id
    async GetOrdersByShop(shopId: string): Promise<Order[]> {
        try {
            const orders = await this.OrderModel.find({ shop_id: shopId }).exec()
            return orders
        } catch (error) {
            console.log("Get all orders Error", error);
            responseError(error)
        }
    }

    async GetOneOrder(orderId: string): Promise<Order> {
        try {
            const order = await this.OrderModel.findById(orderId)
            if (!order) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Order ID not found"
                }, HttpStatus.NOT_FOUND)
            }
            return order
        } catch (error) {
            console.log("Get one order by id Error", error);
            responseError(error)
        }
    }

    async CreateOrder(createOrderForm: createOrderDto) {
        const session = await this.OrderModel.db.startSession(); // Sử dụng session để đảm bảo tính toàn vẹn giao dịch
        session.startTransaction();

        try {
            // Tạo đơn hàng mới
            const newOrder = await this.OrderModel.create(createOrderForm);

            // Danh sách productId để xóa khỏi giỏ hàng sau khi mua
            const purchasedProductIds = createOrderForm.products.map(p => p.product_id);

            // Trừ số lượng của từng sản phẩm trong đơn hàng
            for (const product of createOrderForm.products) {
                const { product_id, quantity } = product;

                // Trừ số lượng sản phẩm trong kho
                const isSuccess = await this.productService.minusProductQuantity(product_id, quantity);

                if (!isSuccess) {
                    throw new Error(`Failed to reduce stock for product ID: ${product_id}`);
                }
            }

            // Xóa sản phẩm đã mua khỏi giỏ hàng của user
            await this.userService.removeProductsFromCart(createOrderForm.user_id, purchasedProductIds, session);

            // Commit transaction sau khi tất cả sản phẩm đã được xử lý
            await session.commitTransaction();
            session.endSession();

            return { message: "Order successful, thank you for shopping", order: newOrder };
        } catch (error) {
            console.log("Create order Error", error);

            // Rollback transaction nếu có lỗi xảy ra
            await session.abortTransaction();
            session.endSession();

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || 'An error occurred while creating the order',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async FindOrderOfUser(userId: string): Promise<Order[]> {
        try {
            const orders = await this.OrderModel.find({ user_id: userId })
            return orders
        } catch (error) {
            console.log("Find order Of User Error", error);

            responseError(error)

        }
    }

    async UpdateOrderStatus(orderId: string, updateOrderStatus: { status: string }) {
        try {
            let order = await this.OrderModel.findById(orderId)
            if (!order) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: "Order Not Found"
                }, HttpStatus.NOT_FOUND);
            }
            order.status = updateOrderStatus.status
            if (updateOrderStatus.status === 'shipped') {
                order.payment_status = 'paid'
                const products = order.products;
                for (const product of products) {
                    await this.productService.increaseSoldQuantity(product.product_id.toString());
                }

            } else {

                order.payment_status = 'unpaid'
            }
            await order.save()
            return { message: "Updated Order Status" }
        } catch (error) {
            console.log("Update order status Error", error);

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || 'An error occurred while update order status',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
