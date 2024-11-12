"use client";

import EmptyProductList from "@/components/EmptyProductList";
import WishlistProductCard from "@/components/wishlist/WishlistProductCard";
import { IProduct } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import {
  GetProductInCart,
  GetProductInWishList,
} from "@/services/product.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function WishList() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [productIdList, setProductIdList] = useState<string[]>();

  const fetchProductData = async () => {
    try {
      const res = await GetProductInWishList(userInfo?._id as string);
      if (res) {
        setProductIdList(res);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const updateCart = (productId: string) => {
    setProductIdList((prevCart) =>
      prevCart?.filter((item) => item.toString() !== productId)
    );
    // window.location.reload();
  };

  useEffect(() => {
    fetchProductData();
  }, []);
  return (
    <MainLayout>
      {productIdList && productIdList.length > 0 ? (
        <div className="min-h-[80vh]  mx-20">
          {productIdList.map((id) => (
            <WishlistProductCard
              productId={id}
              userId={userInfo?._id as string}
              onDelete={updateCart}
              key={id}
            />
          ))}
        </div>
      ) : (
        <EmptyProductList />
      )}
    </MainLayout>
  );
}

export default WishList;
