"use client";

import { IProduct } from "@/interfaces/product.interface";
import Link from "next/link";

function ProductCard({ product }: { product: IProduct | undefined }) {
  return (
    <div
      className="pb-5   bg-light-modal-popup dark:bg-dark-modal-popup rounded shadow-md w-full sm:h-[430px] h-[400px] "
      data-aos="fade-up"
      data-aos-anchor-placement="bottom-bottom"
    >
      <Link href={`/product/${product?._id}`}>
        <img
          src={`${product?.images[0]}`}
          alt="Product Image"
          loading="lazy"
          className="max-h-[345px] h-full w-full object-cover rounded-t hover:brightness-75 transition duration-250 cursor-pointer"
        />
      </Link>
      <div className="flex items-center justify-between px-2 py-4">
        <Link href={`/product/${product?._id}`} className="flex-1">
          <p className="capitalize text-small sm:text-base text-light-primary-text dark:text-dark-primary-text text-wrap hover:underline">
            {product?.name}
          </p>
        </Link>
        <p className="capitalize text-small sm:text-base text-light-primary-text dark:text-dark-primary-text text-wrap">
          Price: {product?.price}$
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
