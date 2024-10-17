"use client";
import OrderProductCard from "@/components/order/OrderProductCard";
import PlaceOrder from "@/components/order/PlaceOrder";
import { IOrderedProduct, IPlaceOrderInfo } from "@/interfaces/order.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { CreateOrder } from "@/services/order.service";
import { GetOneProduct } from "@/services/product.service";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faClose,
  faL,
  faLocation,
  faLocationDot,
  faPen,
  faSquarePhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CreateOrderPage = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const searchParams = useSearchParams();
  // const [orderList, setOrderList] = useState<IOrderedProduct[]>([]);
  // const [totalPrice, setTotalPrice] = useState<number>(0);
  const [address, setAddress] = useState<string | undefined>("");
  // const router = useRouter();
  const [groupedOrders, setGroupedOrders] = useState<IPlaceOrderInfo[]>([]);

  // address input state
  const [isDisableAddress, setIsDisableAddress] = useState<boolean>(true);

  useEffect(() => {
    const orderInfo = searchParams.get("orderInfo");
    if (orderInfo) {
      const parsedOrderList = orderInfo.split(",").map(async (item) => {
        const [product_id, qty] = item.split("-");
        const quantity = Number(qty);

        const productData = await GetOneProduct(product_id);
        const price_at_purchase = productData.price;
        const shop_owner_id = productData.shop_owner_id;

        return { product_id, quantity, price_at_purchase, shop_owner_id };
      });

      // nhận vào parsed orderList ở bên trên sau khi lấy đầy đủ thông tin -> nhóm các sản phẩm nằm vào cùng 1 shop theo id của shop, sau đó set vào state
      Promise.all(parsedOrderList).then((resolvedOrderList) => {
        const groupedOrders: Record<string, IOrderedProduct[]> = {};

        resolvedOrderList.forEach((order) => {
          // lấy shop_id của mỗi sản phẩm
          const { shop_owner_id } = order;
          // nếu mà nhóm với shop_id này chưa có thì sẽ tạo mới với giá trị là []
          if (!groupedOrders[shop_owner_id]) {
            groupedOrders[shop_owner_id] = [];
          }
          // push các sản phẩm có cùng shop_id vào nhóm
          groupedOrders[shop_owner_id].push({
            product_id: order.product_id,
            quantity: order.quantity,
            price_at_purchase: order.price_at_purchase,
          });
        });

        // Tạo đơn hàng cho mỗi shop
        const ordersArray: IPlaceOrderInfo[] = Object.entries(
          groupedOrders
        ).map(([shop_id, products]) => ({
          shop_id,
          products,
        }));

        setGroupedOrders(ordersArray); // Cập nhật trạng thái groupedOrders
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const add = userInfo?.addresses?.detail?.concat(
      " - " + userInfo.addresses.ward?.ward_name + "-",
      userInfo.addresses.district?.district_name + "-",
      userInfo.addresses.province?.province_name
    );
    setAddress(add);
  }, []);

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
          <div className="flex items-center py-4 gap-4 sm:gap-8">
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
            <div className="flex-1 flex items-center gap-2">
              <input
                className={`border border-light-input-border dark:border-dark-input-border w-full p-2 bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text ${
                  !isDisableAddress
                    ? "outline-blue-500 outline"
                    : "outline-none"
                } rounded`}
                type="text"
                name="shipAddress"
                id="shipAddress"
                defaultValue={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isDisableAddress ? true : false}
              />
              {isDisableAddress ? (
                <FontAwesomeIcon
                  icon={faPen}
                  className="text-sm sm:text-base cursor-pointer hover:text-blue-700 p-2  text-center"
                  onClick={() => setIsDisableAddress(!isDisableAddress)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-sm sm:text-base cursor-pointer hover:text-blue-700 p-2  text-center"
                  onClick={() => setIsDisableAddress(!isDisableAddress)}
                />
              )}
            </div>
          </div>
        </div>
        {/* list order */}
        <div>
          {groupedOrders.map((order) => (
            <div className="bg-light-modal-popup dark:bg-dark-modal-popup my-4">
              <PlaceOrder
                order={order}
                key={order.shop_id}
                userInfo={userInfo}
                address={address}
              />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateOrderPage;
