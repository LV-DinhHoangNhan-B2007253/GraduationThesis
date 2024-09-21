"use client";

import Link from "next/link";

function CategoryItemCard({
  name,
  categoryId,
}: {
  name: string;
  categoryId: string | undefined;
}) {
  return (
    <div className="flex items-center justify-center sm:h-[250px] h-[100px] mx-4 shadow-lg bg-opacity-60 backdrop-filter backdrop-blur-lg bg-light-modal-popup dark:bg-dark-modal-popup rounded-xl ">
      <Link
        href={`/category/${categoryId}`}
        className="w-5/6 font-bold text-center uppercase rounded-lg sm:py-11 text-light-primary-text dark:text-dark-primary-text sm:text-base sm:bg-slate-100 bg-none sm:dark:bg-transparent dark:drop-shadow-md text-xs sm:px-0"
      >
        {name}
      </Link>
    </div>
  );
}

export default CategoryItemCard;
