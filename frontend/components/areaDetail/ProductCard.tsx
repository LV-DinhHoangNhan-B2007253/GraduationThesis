"use client";

import { IProduct } from "@/interfaces/product.interface";
import { faCoins, faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function ProductCard({ product }: { product: IProduct | undefined }) {
  return (
    <div className="pb-5 rounded shadow-md w-full  hover:cursor-pointer hover:-translate-y-1.5 transition-all duration-300 bg-product-card">
      <Link href={`/product/${product?._id}`}>
        <img
          src={`${product?.images[0]}`}
          alt="Product Image"
          loading="lazy"
          className="max-h-[345px] h-full w-full object-cover rounded-t hover:brightness-75 transition duration-250 cursor-pointer"
        />
      </Link>
      <div className="flex flex-col px-2 py-4 gap-4">
        <Link href={`/product/${product?._id}`}>
          <p className="uppercase text-sm sm:text-base text-nowrap hover:underline text-ellipsis truncate text-center font-bold overflow-hidden">
            {product?.name}
          </p>
        </Link>
        <p className="capitalize text-small sm:text-base   text-center">
          {product?.price.toLocaleString()}{" "}
          <span className="text-green-600 font-bold">
            <FontAwesomeIcon icon={faMoneyBill1Wave} />
          </span>
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
