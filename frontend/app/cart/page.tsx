"use client";

import ProductInCart from "@/components/Cart/ProductInCart";
import EmptyProductList from "@/components/EmptyProductList";
import { IOrderedProduct } from "@/interfaces/order.interface";
import { ICartItem } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { GetProductInCart } from "@/services/product.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Cart() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [cart, setCart] = useState<ICartItem[]>();
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

  const handleCreateOrder = () => {
    const productInfo = selectedProducts
      .map((item) => `${item.product_id}-${item.quantity}`)
      .join(",");

    if (selectedProducts.length === 0) {
      toast.warn("Please select product to order");
    } else {
      router.push(`/order/createOrder?orderInfo=${productInfo}`);
    }
  };

  const fetchProductData = async () => {
    try {
      const res = await GetProductInCart(userInfo?._id as string);
      setCart(res);
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
      {cart && cart.length > 0 ? (
        <div className="min-h-[80%] ">
          {cart.map((item) => (
            <div className="flex items-center gap-3 px-4 py-6 bg-light-modal-popup dark:bg-dark-modal-popup border-y border-gray-200">
              <div>
                <input
                  type="checkbox"
                  name="select"
                  id="select"
                  onChange={() => handleSelect(item.product_id, item.quantity)}
                  checked={selectedProducts.some(
                    (product) => product.product_id === item.product_id
                  )}
                />
              </div>
              <ProductInCart
                cartItem={item}
                userId={userInfo?._id as string}
                onDelete={updateCart}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyProductList />
      )}
      <div className="sticky bottom-0 flex justify-start gap-10 sm:gap-20 px-3 sm:px-6 py-4 sm:py-8 bg-light-modal-popup dark:bg-dark-modal-popup items-center">
        <p>({selectedProducts.length} Products)</p>
        <button
          onClick={handleCreateOrder}
          className="py-2 px-10 bg-orange-600 text-white uppercase text-center font-bold rounded hover:bg-orange-700"
        >
          Oder
        </button>
      </div>
    </MainLayout>
  );
}

export default Cart;
