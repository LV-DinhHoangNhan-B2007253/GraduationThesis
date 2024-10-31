"use client";

import { IOrder } from "@/interfaces/order.interface";
import { GetOrdersByShop } from "@/services/order.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import OrderItem from "../shop/order/OrderItem";

function OrderManagement() {
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Tìm kiếm mã đơn hàng
  const [filter, setFilter] = useState<
    | "most-recent"
    | "oldest"
    | "status-pending"
    | "status-shipped"
    | "status-canceled"
    | "status-delivery"
  >("most-recent");

  const fetchOrderData = async () => {
    try {
      const data = await GetOrdersByShop(userInfo?.shop_id as string);
      setOrders(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "shipped":
        return "text-blue-500";
      case "canceled":
        return "text-red-500";
      case "delivery":
        return "text-green-500";
      default:
        return "text-black dark:text-white"; // Màu chữ xám mặc định
    }
  };

  // Hàm lọc và tìm kiếm
  useEffect(() => {
    let updatedOrders = [...orders]; // Không thay đổi orders gốc

    // Tìm kiếm theo mã đơn hàng (_id)
    if (searchQuery) {
      updatedOrders = updatedOrders.filter((order) =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    // Lọc theo trạng thái hoặc ngày
    switch (filter) {
      case "most-recent":
        updatedOrders.sort(
          (a, b) =>
            new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
        );
        break;
      case "oldest":
        updatedOrders.sort(
          (a, b) =>
            new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
        );
        break;
      case "status-pending":
        updatedOrders = updatedOrders.filter(
          (order) => order.status === "pending"
        );
        break;
      case "status-shipped":
        updatedOrders = updatedOrders.filter(
          (order) => order.status === "shipped"
        );
        break;
      case "status-canceled":
        updatedOrders = updatedOrders.filter(
          (order) => order.status === "canceled"
        );
        break;
      case "status-delivery":
        updatedOrders = updatedOrders.filter(
          (order) => order.status === "delivery"
        );
        break;
      default:
        break;
    }

    setFilteredOrders(updatedOrders); // Cập nhật danh sách đã lọc
  }, [searchQuery, filter, orders]);

  useEffect(() => {
    fetchOrderData();
  }, []);

  return (
    <div className="px-2 max-h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <input
            type="text"
            name="search"
            placeholder="order code"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-1 py-2 border rounded bg-light-input-field text-light-input-text border-light-input-border dark:text-dark-input-text dark:bg-dark-input-field dark:border-dark-input-border"
          />
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border p-2 mb-4"
          >
            <option value="most-recent">Most Recent</option>
            <option value="oldest">Oldest</option>
            <option value="status-pending">Pending</option>
            <option value="status-delivery">Delivery</option>
            <option value="status-canceled">Canceled</option>
            <option value="status-shipped">Shipped</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        {filteredOrders.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 p-2 text-left">
                  Order Code
                </th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">
                  Payment Status
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <OrderItem
                  key={order._id}
                  order={order}
                  getStatusClass={getStatusClass}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center flex-col py-10">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No orders found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;
