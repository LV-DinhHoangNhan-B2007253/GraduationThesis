"use client";

import { IProduct } from "@/interfaces/product.interface";
import {
  GetOneProduct,
  RemoveProductInWishList,
} from "@/services/product.service";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function WishlistProductCard({
  productId,
  userId,
  onDelete,
}: {
  productId: string;
  userId: string;
  onDelete: (productId: string) => void;
}) {
  const [product, setProduct] = useState<IProduct>();

  const fetchProductData = async () => {
    try {
      const productInfo = await GetOneProduct(productId);
      if (productInfo) {
        setProduct(productInfo);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleDeleteProductInWishList = async () => {
    try {
      const data = await RemoveProductInWishList(
        userId,
        product?._id as string
      );
      if (data) {
        toast.success(`${data.message}`);
        onDelete(productId);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);
  return (
    <div className="flex justify-between items-center px-5 py-4 bg-light-modal-popup dark:bg-dark-modal-popup rounded border-b border-gray-100 my-4">
      <img
        src={`${product?.images[0]}`}
        alt="Product Image"
        className="max-w-[100px] w-full rounded"
      />
      <Link
        href={`/product/${productId}`}
        className="text-small sm:text-base text-light-primary-text dark:text-dark-primary-text hover:text-light-active dark:hover:text-dark-active hover:underline"
      >
        {product?.name}
      </Link>
      <button
        className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-orange-500 text-small text-white uppercase transition duration-250"
        onClick={handleDeleteProductInWishList}
      >
        Remove
      </button>
    </div>
  );
}

export default WishlistProductCard;
