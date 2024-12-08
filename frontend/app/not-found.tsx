"use client";
import Link from "next/link";
import React from "react";

function NotFound() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-black text-white">
      <div className="flex flex-col gap-3 items-center">
        <p className="text-3xl">Opps! Hình như bạn bị lạc rồi thì phải 🥲</p>
        <Link href={"/"} className=" hover:text-secondary-400 font-bold">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
