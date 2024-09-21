"use client";

import ProductInCart from "@/components/Cart/ProductInCart";
import EmptyProductList from "@/components/EmptyProductList";
import { ICartItem, IProduct } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { GetProductInCart } from "@/services/product.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Cart() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [cart, setCart] = useState<ICartItem[]>();

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
        <div className="min-h-[80%]">
          {cart.map((item) => (
            <div className="flex items-center gap-3 px-4 py-6 bg-light-modal-popup dark:bg-dark-modal-popup border-y border-gray-200">
              <div>
                <input type="checkbox" name="select" id="select" className="" />
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
    </MainLayout>
  );
}

export default Cart;
