"use client";

import OrderInfoCard from "@/components/order/OrderInfoCard";
import { IOrder } from "@/interfaces/order.interface";
import MainLayout from "@/layouts/MainLayout";
import { GetOneOrderById } from "@/services/order.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function OrderDetail(props: any) {
  const orderId = props.params.orderId;
  const [order, setOrder] = useState<IOrder>();

  const getOrderInfo = async () => {
    try {
      const data = await GetOneOrderById(orderId);
      if (data) {
        setOrder(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getOrderInfo();
  }, []);

  return (
    <MainLayout>
      <div>
        {order && (
          <OrderInfoCard
            order={order as IOrder}
            asAdmin={true}
            key={order?._id}
            userAction={false}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default OrderDetail;
