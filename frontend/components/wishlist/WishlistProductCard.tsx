"use client";

import { IProduct } from "@/interfaces/product.interface";
import {
  GetOneProduct,
  RemoveProductInWishList,
} from "@/services/product.service";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div className="flex justify-between items-center px-5 py-4 rounded border-b border-primary-border bg-card-bg my-4">
      <img
        loading="lazy"
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
        className="px-4 py-2 rounded-md  text-small transition duration-250 hover:text-button-danger"
        onClick={handleDeleteProductInWishList}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}

export default WishlistProductCard;
