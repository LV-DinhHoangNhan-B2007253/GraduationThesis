"use client";
import { UserInfo } from "@/interfaces/auth.interface";
import { IOrder } from "@/interfaces/order.interface";
import { IProduct } from "@/interfaces/product.interface";
import { GetOneUserById } from "@/services/auth.service";
import { GetOneOrderById } from "@/services/order.service";
import { GetOneProduct } from "@/services/product.service";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function OrderItem({
  orderId,
}: // getStatusClass,
{
  orderId: string;
  // getStatusClass: (status: string) => string;
}) {
  const [order, setOrder] = useState<IOrder>();
  const [userOrder, setUserOrder] = useState<UserInfo>();

  const getStatusClass = (status: string | undefined) => {
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

  const getOrderInfo = async () => {
    try {
      const data = await GetOneOrderById(orderId);
      if (data) {
        setOrder(data);
        const userInf = await GetOneUserById(data.user_id);
        if (userInf) {
          setUserOrder(userInf);
        }
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getOrderInfo();
  }, []);
  return (
    <tr className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
      <td className="border border-gray-300 p-2">
        <div className="flex justify-start gap-2 items-center">
          <img
            src={`${userOrder?.avatarUrl || "/default-avatar.png"}`}
            alt="userAvatar"
            className="w-[40px] h-[40px] rounded-full"
          />
          <div>
            <p className="font-bold">{userOrder?.name}</p>
            <p className="font-light text-sm">{userOrder?.phone_number}</p>
          </div>
        </div>
      </td>
      <td className="border border-gray-300 p-2">{orderId}</td>
      <td className="border border-gray-300 p-2">
        {order?.products.map((product, index) => (
          <div key={index}>
            <ListOfGoods
              productId={product.product_id}
              quantity={product.quantity}
            />
          </div>
        ))}
      </td>
      <td className="border border-gray-300 p-2">{order?.payment_method}</td>
      <td className="border border-gray-300 p-2">
        <p className={`${getStatusClass(order?.status)}`}>{order?.status}</p>
      </td>
      <td className="border border-gray-300 p-2">
        <Link
          className=" bg-button-success text-center p-2 rounded-sm"
          href={`/order/${orderId}`}
        >
          Xem chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default OrderItem;

function ListOfGoods({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const [product, setProduct] = useState<IProduct>();
  const fetchProduct = async () => {
    try {
      const data = await GetOneProduct(productId);
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="flex items-center gap-4 justify-between">
      <p className=" font-light text-ellipsis truncate overflow-hidden max-w-[300px] hover:text-secondary-400">
        <Link href={`/product/${productId}`}>{product?.name}</Link>
      </p>
      <p className="font-bold">x{quantity}</p>
    </div>
  );
}
