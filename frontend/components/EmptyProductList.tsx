"use client";

import Link from "next/link";

function EmptyProductList() {
  return (
    <div className="flex justify-center items-center w-full h-4/5 flex-col gap-10">
      <p className="text-light-primary-text dark:text-dark-primary-text text-base sm:text-4xl tracking-widest uppercase">
        Giỏ của bạn hiện tại đang trống!.
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
