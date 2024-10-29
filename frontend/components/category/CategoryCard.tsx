import { ICategory } from "@/interfaces/category.interface";
import Link from "next/link";
import React from "react";

function CategoryCard({ category }: { category: ICategory }) {
  return (
    <Link
      href={`/category/${category._id}`}
      className="border border-light-input-border dark:border-dark-input-border  p-4 rounded hover:shadow-md h-full w-full flex flex-col hover:-translate-y-1 gap-1"
    >
      <div className=" bg-foreground-200 rounded-full h-full max-h-[80px] flex justify-center items-center p-1">
        <img
          src={`${category.banner ? category.banner : "./category.png"}`}
          alt="Category image"
          className=" object-cover w-full h-full rounded-full"
        />
      </div>
      <p className="line-clamp-2 text-center text-small sm:text-base font-bold capitalize">
        {category?.name}
      </p>
    </Link>
  );
}

export default CategoryCard;
