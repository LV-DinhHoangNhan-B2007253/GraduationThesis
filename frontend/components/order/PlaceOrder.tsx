import { IPlaceOrderInfo } from "@/interfaces/order.interface";
import OrderProductCard from "./OrderProductCard";
import { useEffect, useState } from "react";
import { GetShopInfoByUserId } from "@/services/shop.service";
import { IUser } from "@/interfaces/auth.interface";
import Link from "next/link";
import { CreateOrder } from "@/services/order.service";
import { toast } from "react-toastify";

function PlaceOrder({
  order,
  userInfo,
  address,
}: {
  order: IPlaceOrderInfo;
  userInfo: IUser | null;
  address: string | undefined;
}) {
  const { shop_id, products } = order;
  const [shopInfo, setShopInfo] = useState<IShop>();
  const [selectedMethod, setSelectedMethod] = useState<string>("cash");
  // Tính tổng giá trị đơn hàng
  const totalPrice = products.reduce((total, product) => {
    return (
      total +
      (product.price_at_purchase
        ? product.price_at_purchase * product.quantity
        : 0)
    );
  }, 0);

  const getShopInfo = async () => {
    try {
      const data = await GetShopInfoByUserId(shop_id);
      setShopInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMethod(e.target.value);
  };
  //   place order
  const handleCreateOrder = async () => {
    try {
      const form = {
        user_id: userInfo?._id,
        products: products,
        total_price: totalPrice,
        payment_method: selectedMethod,
        shop_id: shop_id,
        shipping_address: address,
      };
      const data = await CreateOrder(form);
      if (data) {
        toast(`${data.message}`);
      }
      console.log(form);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  useEffect(() => {
    getShopInfo();
  }, []);

  return (
    <div>
      <div>
        {shopInfo ? (
          <div className="my-2 flex items-center justify-between">
            <p className="px-4 text-light-primary-text dark:text-dark-primary-text font-bold text-base sm:text-2xl tracking-widest">
              {shopInfo.name}
            </p>
            <Link
              href={`/shop/${shop_id}`}
              className="text-light-primary-text dark:text-dark-primary-text text-center p-1 border border-orange-300 text-sm sm:text-base"
            >
              View Shop
            </Link>
          </div>
        ) : (
          <p>loading..</p>
        )}
      </div>
      {/* products list */}
      <ul>
        {products.map((product) => (
          <li key={product.product_id}>
            <OrderProductCard
              productId={product.product_id}
              qty={product.quantity}
              key={product.product_id}
              price={Number(product.price_at_purchase)}
            />
          </li>
        ))}
      </ul>
      {/* payment options */}
      <div className="flex flex-col gap-2 justify-between">
        <h3 className="text-lg font-medium mb-2">Choose payment method</h3>
        <ul className="list-none grid grid-cols-4 gap-4 items-center">
          <li className="border border-black col-span-1 flex items-center h-[100px] pl-2 rounded">
            <div className="w-1/3 flex justify-around items-center gap-4">
              <label className="hover:cursor-pointer font-bold flex items-center gap-2">
                <input
                  type="radio"
                  //   name="paymentMethod"
                  value="cash"
                  checked={selectedMethod === "cash"}
                  onChange={handlePaymentChange}
                />
                Cash
              </label>
            </div>
            <img
              loading="lazy"
              src="/cash.png"
              alt="cash"
              className="w-full h-full object-contain "
            />
          </li>
          <li className="border border-black col-span-1 flex items-center h-[100px] pl-2 rounded">
            <div className="w-1/3 flex justify-around items-center gap-4">
              <label className="hover:cursor-pointer font-bold flex items-center gap-2">
                <input
                  disabled
                  type="radio"
                  //   name="paymentMethod"
                  value="vnpay"
                  checked={selectedMethod === "vnpay"}
                  onChange={handlePaymentChange}
                />
                VNPay
              </label>
            </div>
            <img
              loading="lazy"
              src="/vnpay.png"
              alt="cash"
              className="w-full h-full object-contain "
            />
          </li>
          <li className="border border-black col-span-1 flex items-center h-[100px] pl-2 rounded">
            <div className="w-1/3 flex justify-around items-center gap-4">
              <label className="hover:cursor-pointer font-bold flex items-center gap-2">
                <input
                  type="radio"
                  disabled
                  //   name="paymentMethod"
                  value="momo"
                  checked={selectedMethod === "momo"}
                  onChange={handlePaymentChange}
                />
                MoMo
              </label>
            </div>
            <img
              loading="lazy"
              src="/momo.png"
              alt="cash"
              className="w-full h-full object-contain "
            />
          </li>
          <li className="border border-black col-span-1 flex items-center h-[100px] pl-2 rounded">
            <div className="w-1/3 flex justify-around items-center gap-4">
              <label className="hover:cursor-pointer font-bold flex items-center gap-2">
                <input
                  disabled
                  type="radio"
                  //   name="paymentMethod"
                  value="zalopay"
                  checked={selectedMethod === "zalopay"}
                  onChange={handlePaymentChange}
                />
                ZaloPay
              </label>
            </div>
            <img
              loading="lazy"
              src="/zalo.png"
              alt="cash"
              className="w-full h-full object-contain "
            />
          </li>
        </ul>
        <p className="mt-2">
          Selected payment method:{" "}
          <strong>{selectedMethod || "Not selected yet"}</strong>
        </p>
      </div>
      {/* order price and info */}
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
            <p className=" col-span-1">
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
  );
}

export default PlaceOrder;
