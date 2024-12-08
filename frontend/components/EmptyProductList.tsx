"use client";

import Link from "next/link";

function EmptyProductList() {
  return (
    <div className="flex justify-center items-center w-full flex-col gap-10 h-screen">
      <p className="text-light-primary-text dark:text-dark-primary-text text-base sm:text-4xl tracking-widest uppercase">
        Oops! Sao trống trải vậy ta 🤔.
      </p>
      <Link
        href={"/"}
        className="p-2  uppercase font-bold text-center bg-button-primary"
      >
        Mua sắm ngay
      </Link>
    </div>
  );
}

export default EmptyProductList;
