"use client";
import OrderProductCard from "@/components/order/OrderProductCard";
import { IOrderedProduct } from "@/interfaces/order.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { CreateOrder } from "@/services/order.service";
import { GetOneProduct } from "@/services/product.service";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faLocation,
  faLocationDot,
  faSquarePhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Main } from "next/document";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CreateOrderPage = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const searchParams = useSearchParams();
  const [orderList, setOrderList] = useState<IOrderedProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [address, setAddress] = useState<string>();
  const router = useRouter();

  const handleCreateOrder = async () => {
    const orderedProduct = orderList.map((order) => ({
      product_id: order.product_id,
      quantity: order.quantity,
      price_at_purchase: order.price_at_purchase,
    }));

    const orderData = {
      user_id: userInfo?._id,
      products: orderedProduct,
      total_price: totalPrice,
      shipping_address: address,
    };

    try {
      // Gọi API để tạo đơn hàng
      const response = await CreateOrder(orderData);
      const confirm = window.confirm(`${response.message}`);
      if (confirm) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  useEffect(() => {
    // Lấy dữ liệu order từ search params
    const orderInfo = searchParams.get("orderInfo");

    // Kiểm tra và xử lý chuỗi orderInfo nếu có
    if (orderInfo) {
      const parsedOrderList = orderInfo.split(",").map(async (item) => {
        const [product_id, qty] = item.split("-");
        const quantity = Number(qty);

        // Gọi API để lấy thông tin sản phẩm và giá hiện tại
        const productData = await GetOneProduct(product_id); // Gọi hàm để lấy giá của sản phẩm
        const price_at_purchase = productData.price; // Giả sử giá của sản phẩm nằm trong `price`

        return { product_id, quantity, price_at_purchase };
      });

      Promise.all(parsedOrderList).then((resolvedOrderList) => {
        setOrderList(resolvedOrderList);
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // Tính tổng giá khi orderList thay đổi
    const total = orderList.reduce(
      (acc, order) => acc + Number(order.price_at_purchase) * order.quantity,
      0
    );
    setTotalPrice(total);
    setAddress(userInfo?.addresses.addressDetail);
  }, [orderList]);

  return (
    <MainLayout>
      <div className="px-2 sm:px-6">
        <h1 className="text-center font-bold text-base sm:text-3xl tracking-[2rem] uppercase my-3 sm:my-5 py-2 sm:py-4">
          order
        </h1>
        {/* address */}
        <div className="px-6 bg-light-modal-popup dark:bg-dark-card-bg">
          <div className="flex justify-start items-center gap-2 sm:gap-4 py-3 text-base sm:text-2xl text-orange-700 ">
            <FontAwesomeIcon icon={faLocationDot} />
            <p className="capitalize">delivery address</p>
          </div>
          <div className="flex justify-start items-center gap-4 sm:gap-8 py-4">
            <div className="font-bold text-black dark:text-dark-primary-text text-sm sm:text-base min-w-[150px]">
              <p className="capitalize my-3 ">
                <span className="mx-2 ">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                {userInfo?.name}
              </p>
              <p>
                <span className="mx-2 ">
                  <FontAwesomeIcon icon={faSquarePhone} />
                </span>
                {userInfo?.phone_number}
              </p>
            </div>
            <div className="">
              <p className="text-wrap">
                {userInfo?.addresses.addressDetail} -{" "}
                {userInfo?.addresses.region}
              </p>
            </div>
          </div>
        </div>
        {/* list */}
        <ul>
          {orderList.map((order) => (
            <li key={order.product_id}>
              <OrderProductCard
                productId={order.product_id}
                qty={order.quantity}
                key={order.product_id}
                price={Number(order.price_at_purchase)}
              />
            </li>
          ))}
        </ul>
        {/* bottom price and order button */}
        <div className="grid grid-cols-4 bg-[#fffefb] dark:bg-dark-card-bg px-2 sm:px-6 py-4 sm:py-8">
          <div className="col-span-1 col-start-4 flex justify-between items-center">
            <p className="text-sm  sm:text-base font-bold">Total Price</p>
            <p className="text-base sm:text-3xl text-orange-600 font-bold">
              {totalPrice}
              <span className="text-small sm:text-xl">$</span>
            </p>
          </div>
          <div className="col-span-4 mt-3 px-5 border-t border-gray-50">
            <div className="py-5  flex justify-between items-center">
              <p className=" flex-1">
                Clicking "Place Order" means you agree to abide by our terms
              </p>
              <button
                onClick={handleCreateOrder}
                className="text-center bg-orange-600 px-8 py-2 rounded font-bold text-white hover:bg-orange-400 hover:rounded-md"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateOrderPage;
