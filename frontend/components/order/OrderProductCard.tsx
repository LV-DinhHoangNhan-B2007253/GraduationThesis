"use client";

import { IProduct } from "@/interfaces/product.interface";
import { GetOneProduct } from "@/services/product.service";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface OrderProductCardProps {
  productId: string;
  qty: number;
  price: number;
}

function OrderProductCard({ productId, qty, price }: OrderProductCardProps) {
  const [product, setProduct] = useState<IProduct>();
  const [productQty, setProductQty] = useState<number>(0);
  const fetchProduct = async () => {
    try {
      const data = await GetOneProduct(productId);
      setProduct(data);
      setProductQty(qty);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className=" bg-light-modal-popup dark:bg-dark-modal-popup px-4 sm:px-6 py-4 sm:py-2 font-bold text-small sm:text-base text-light-primary-text dark:text-dark-primary-text rounded-md dark:shadow-md ">
      <div className="sm:flex justify-between items-center px-2 sm:px-4 border-b border-gray-100">
        <div className="flex sm:max-w-[500px] w-full gap-2 sm:gap-4 my-1 items-center">
          <img
            src={`${product?.images[0]}`}
            alt="Product Image"
            className="w-[50px] sm:w-[100px] object-cover"
          />
          <Link
            href={`/product/${product?._id}`}
            className=" truncate text-ellipsis w-full hover:text-light-text-link-color dark:hover:text-dark-link underline"
          >
            {product?.name}
          </Link>
        </div>
        <div className="flex justify-around items-center sm:flex-1 pl-[100px] sm:pl-0">
          <p>{product?.price}$</p>
          <p>x{qty}</p>
        </div>
      </div>
      <p className="text-right  my-2">
        Total: <span className="text-orange-500">{Number(price * qty)}$</span>
      </p>
    </div>
  );
}

export default OrderProductCard;
