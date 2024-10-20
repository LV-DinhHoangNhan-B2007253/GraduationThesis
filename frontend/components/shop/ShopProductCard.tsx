import { IProduct } from "@/interfaces/product.interface";
import Link from "next/link";
import React from "react";

function ShopProductCard({ product }: { product: IProduct }) {
  return (
    <Link
      href={`/product/${product._id}`}
      className=" h-[300px]  w-full bg-light-modal-popup dark:bg-dark-modal-popup flex flex-col gap-1"
    >
      <div className="w-full h-[150px]">
        <img
          src={product.images[0]}
          alt="Product Image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col  justify-between h-[150px] mx-2 ">
        <div className="flex flex-col gap-2">
          <p className="text-ellipsis truncate text-sm sm:text-base text-light-primary-text dark:text-dark-primary-text">
            {product.name}
          </p>
          <p className="text-price-text font-bold">
            {product.price}{" "}
            <span className="text-sm font-light text-price-text">$</span>
          </p>
        </div>
        <div className="text-light-primary-text dark:text-dark-primary-text text-small sm:text-sm flex justify-between items-center">
          {product.averageRating === 0 ? (
            <p>No review</p>
          ) : (
            <p>⭐{product.averageRating.toString()}</p>
          )}
          <p>{product.sold_quantity} sold</p>
        </div>
      </div>
    </Link>
  );
}

export default ShopProductCard;
