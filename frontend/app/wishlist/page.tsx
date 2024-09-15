"use client";

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
  const [products, setProducts] = useState<IProduct[]>();

  const fetchProductData = async () => {
    try {
      const res = await GetProductInWishList(userInfo?._id as string);
      setProducts(res);
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [userInfo?._id]);
  return (
    <MainLayout>
      {products ? (
        <div>
          {products.map((item) => (
            <div>
              <p>{item.name}</p>
              <p>{item.stock_quantity}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>empty</p>
      )}
    </MainLayout>
  );
}

export default WishList;
