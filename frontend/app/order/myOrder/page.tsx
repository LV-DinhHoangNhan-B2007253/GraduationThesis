"use client";

import EmptyProductList from "@/components/EmptyProductList";
import OrderInfoCard from "@/components/order/OrderInfoCard";
import { IOrder } from "@/interfaces/order.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { GetOrderOfUser } from "@/services/order.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function MyOrder() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<IOrder[]>();

  const fetchOrderData = async () => {
    try {
      const data = await GetOrderOfUser(userInfo?._id as string);
      setOrders(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);
  return (
    <MainLayout>
      {orders && orders.length > 0 ? (
        <div className="px-2 py-4  my-2 bg-light-modal-popup dark:bg-dark-card-bg">
          {orders.reverse().map((order) => (
            <OrderInfoCard
              order={order}
              key={order._id}
              asAdmin={false}
              userAction={true}
            />
          ))}
        </div>
      ) : (
        <EmptyProductList />
      )}
    </MainLayout>
  );
}

export default MyOrder;
