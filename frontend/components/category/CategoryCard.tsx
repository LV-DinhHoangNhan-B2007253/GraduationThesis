import { ICategory } from "@/interfaces/category.interface";
import Link from "next/link";
import React from "react";

function CategoryCard({ category }: { category: ICategory }) {
  return (
    <Link
      href={`/category/${category._id}`}
      className="border border-light-input-border dark:border-dark-input-border  p-4 rounded hover:shadow-md h-full w-full flex flex-col hover:-translate-y-1 gap-1 transition-all duration-250"
    >
      <div className=" flex justify-center items-center w-full p-1">
        <img
          loading="lazy"
          src={`${category.banner ? category.banner : "./category.png"}`}
          alt="Category image"
          className=" object-cover sm:max-w-[80px] sm:max-h-[80px] max-w-[30px] max-h-[30px] rounded-full"
        />
      </div>
      <p className="line-clamp-2 text-center text-small sm:text-base  capitalize hover:text-accent">
        {category?.name}
      </p>
    </Link>
  );
}

export default CategoryCard;
