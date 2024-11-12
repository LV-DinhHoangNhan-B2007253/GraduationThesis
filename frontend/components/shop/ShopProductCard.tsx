import { IProduct } from "@/interfaces/product.interface";
import { faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

function ShopProductCard({ product }: { product: IProduct }) {
  return (
    <Link
      href={`/product/${product._id}`}
      className=" h-full   w-full flex flex-col gap-1 shadow rounded hover:brightness-105 hover:-translate-y-0.5 transition-none ease-in duration-200 bg-product-card"
    >
      <div className="w-full max-h-[150px]">
        <img
          loading="lazy"
          src={
            product.images && product.images.length > 0 ? product.images[0] : ""
          }
          alt="Product Image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col  justify-between  mx-2 ">
        <div className="flex flex-col gap-2">
          <p className="text-ellipsis truncate text-sm sm:text-base text-light-primary-text dark:text-dark-primary-text">
            {product.name}
          </p>
          <p className="text-price-text font-bold text-center sm:text-end">
            {product.price.toLocaleString()}{" "}
            <span className="text-green-600 font-bold">
              <FontAwesomeIcon icon={faMoneyBill1Wave} />
            </span>
          </p>
        </div>
        <div className="text-light-primary-text dark:text-dark-primary-text text-sm sm:text-small sm:flex justify-between items-center">
          {product.averageRating === 0 ? (
            <p className="text-[8px] sm:text-[10px] font-light">
              chưa có đánh giá
            </p>
          ) : (
            <p>
              💬{" "}
              <span className="font-bold text-sm text-green-600">
                {product.comments.length}
              </span>
            </p>
          )}
          <p className="text-[8px] sm:text-[10px] font-light">
            <span className="font-bold text-sm text-green-600">
              {product.sold_quantity}
            </span>{" "}
            đã bán
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ShopProductCard;
