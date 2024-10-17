"use client";

import ProductInCart from "@/components/Cart/ProductInCart";
import EmptyProductList from "@/components/EmptyProductList";
import { IOrderedProduct } from "@/interfaces/order.interface";
import { ICartItem, IShopGroup } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { GetProductInCart } from "@/services/product.service";
import { GetShopInfoByUserId } from "@/services/shop.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Cart() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [cart, setCart] = useState<ICartItem[]>();
  const [groupedCart, setGroupedCart] = useState<Record<string, ICartItem[]>>(
    {}
  );
  const [shopDetails, setShopDetails] = useState<Record<string, IShop>>({});
  const [selectedProducts, setSelectedProducts] = useState<IOrderedProduct[]>(
    []
  );

  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn sản phẩm
  const handleSelect = (product_id: string, quantity: number) => {
    setSelectedProducts((prevSelected) => {
      // Kiểm tra nếu sản phẩm đã được chọn thì loại bỏ nó
      if (prevSelected.some((item) => item.product_id === product_id)) {
        return prevSelected.filter((item) => item.product_id !== product_id);
      }
      // Nếu sản phẩm chưa được chọn thì thêm nó vào
      return [...prevSelected, { product_id, quantity }];
    });
  };

  const handleNavigateOrderpage = () => {
    const productInfo = selectedProducts
      .map((item) => `${item.product_id}-${item.quantity}`)
      .join(",");

    if (selectedProducts.length === 0) {
      toast.warn("Please select product to order");
    } else {
      router.push(`/order/createOrder?orderInfo=${productInfo}`);
    }
  };

  // const groupByShop = (cartItems: ICartItem[]): IShopGroup[] => {
  //   const grouped = cartItems.reduce<Record<string, IShopGroup>>(
  //     (acc, item) => {
  //       if (!acc[item.shop_owner_id]) {
  //         // Nếu chưa có shop này, khởi tạo với thông tin shop và sản phẩm đầu tiên
  //         acc[item.shop_owner_id] = {
  //           shop_owner_id: item.shop_owner_id,
  //           products: [],
  //         };
  //       }
  //       // Thêm sản phẩm vào danh sách sản phẩm của shop đó
  //       acc[item.shop_owner_id].products.push(item);
  //       return acc;
  //     },
  //     {}
  //   );

  //   // Trả về dưới dạng một mảng các đối tượng ShopGroup
  //   return Object.values(grouped);
  // };
  // Hàm nhóm các sản phẩm theo shop_owner_id

  const groupByShop = (cartItems: ICartItem[]) => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.shop_owner_id]) {
        acc[item.shop_owner_id] = [];
      }
      acc[item.shop_owner_id].push(item);
      return acc;
    }, {} as Record<string, ICartItem[]>);
  };

  const fetchProductData = async () => {
    try {
      const res = await GetProductInCart(userInfo?._id as string);
      setCart(res);

      // Nhóm sản phẩm theo shop
      const grouped = groupByShop(res);
      setGroupedCart(grouped);

      // Fetch thông tin shop theo từng shop_owner_id
      const shopInfoPromises = Object.keys(grouped).map(
        async (shop_owner_id) => {
          const shopInfo = await GetShopInfoByUserId(shop_owner_id);
          return { [shop_owner_id]: shopInfo };
        }
      );

      const allShopInfo = await Promise.all(shopInfoPromises);
      const shopInfoObj = allShopInfo.reduce((acc, shopInfo) => {
        return { ...acc, ...shopInfo };
      }, {});

      setShopDetails(shopInfoObj); // Lưu trữ thông tin shop vào state
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const updateCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart?.filter((item) => item.product_id !== productId)
    );
    window.location.reload();
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <MainLayout>
      {Object.keys(groupedCart).length > 0 ? (
        <div className="min-h-[80%] ">
          {Object.entries(groupedCart).map(([shop_owner_id, items]) => (
            <div key={shop_owner_id} className="shop-group">
              {/* Hiển thị thông tin chi tiết của shop */}
              <div className=" px-4 py-2 bg-slate-200 flex items-center gap-4">
                <h3 className="text-black font-bold text-base sm:text-2xl">
                  {shopDetails[shop_owner_id]?.name || "Loading shop name..."}
                </h3>
                <p className="text-black font-light text-sm sm:text-base">
                  {shopDetails[shop_owner_id]?.shopLocation ||
                    "Loading address..."}
                </p>
              </div>

              {/* Hiển thị sản phẩm thuộc shop */}
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-3 px-4 py-6 bg-light-modal-popup dark:bg-dark-modal-popup border-y border-gray-200"
                >
                  <div>
                    <input
                      type="checkbox"
                      name="select"
                      id="select"
                      onChange={() =>
                        handleSelect(item.product_id, item.quantity)
                      }
                      checked={selectedProducts.some(
                        (product) => product.product_id === item.product_id
                      )}
                    />
                  </div>
                  <ProductInCart
                    cartItem={item}
                    userId={userInfo?._id as string}
                    onDelete={() => updateCart(item.product_id)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <EmptyProductList />
      )}
      <div className="sticky bottom-0 flex justify-start gap-10 sm:gap-20 px-3 sm:px-6 py-4 sm:py-8 bg-light-modal-popup dark:bg-dark-modal-popup items-center">
        <p>({selectedProducts.length} Products)</p>
        <button
          onClick={handleNavigateOrderpage}
          className="py-2 px-10 bg-orange-600 text-white uppercase text-center font-bold rounded hover:bg-orange-700"
        >
          Order
        </button>
      </div>
    </MainLayout>
  );
}

export default Cart;
