"use client";

import { IOrder } from "@/interfaces/order.interface";
import { GetAllOrder } from "@/services/order.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function OrderManagement() {
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
      const data = await GetAllOrder();
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
        updatedOrders = updatedOrders.sort(
          (a, b) =>
            new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
        );
        break;
      case "oldest":
        updatedOrders = updatedOrders.sort(
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
    <div className="px-2">
      <div className="flex justify-between items-center">
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
      <div>
        {filteredOrders.length > 0 ? (
          <div className="text-light-primary-text dark:text-dark-primary-text text-small sm:text-base">
            {filteredOrders.map((order) => (
              <Link
                key={order._id}
                href={`/order/${order._id}`}
                className="flex justify-between items-center px-4 py-3 bg-light-card-bg dark:bg-dark-card-bg my-2 border border-light-card-border dark:border-dark-card-border hover:bg-light-modal-popup dark:hover:bg-dark-modal-popup transition-all duration-300 hover:shadow-md hover:scale-105"
              >
                <p>
                  Code:{" "}
                  <span className="underline decoration-indigo-500">
                    {order._id}
                  </span>
                </p>
                <div className="flex items-center gap-4 justify-between min-w-[200px]">
                  <p className="font-bold">Status:</p>
                  <p className={`font-bold ${getStatusClass(order.status)}`}>
                    {order.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
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
