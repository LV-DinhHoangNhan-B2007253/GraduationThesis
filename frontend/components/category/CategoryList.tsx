import { ICategory } from "@/interfaces/category.interface";
import React, { useState } from "react";
import CategoryCard from "./CategoryCard";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { button } from "@nextui-org/react";

function CategoryList({ categories }: { categories: ICategory[] }) {
  const [loadMore, setLoadmore] = useState<boolean>(false);
  const [temptList, setTemptList] = useState<ICategory[]>(
    categories.slice(0, 15)
  );

  const handleLoadMore = () => {
    setLoadmore(true);
    setTemptList(categories);
  };

  const handleHidden = (): void => {
    setLoadmore(false);
    setTemptList(categories.slice(0, 15) as ICategory[]);
  };

  return (
    <div>
      <h1 className="tracking-widest my-5 uppercase font-bold text-base sm:text-2xl text-heading">
        Danh Mục
      </h1>
      <div className="grid grid-cols-10   bg-light-modal-popup dark:bg-dark-modal-popup ">
        {temptList.map((category) => (
          <div key={category._id} className="col-span-2  ">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
      {loadMore ? (
        <button
          className="w-full p-3 text-center  hover:font-bold hover:tracking-widest text-secondary-500 hover:text-accent transition-all duration-250"
          onClick={handleHidden}
        >
          Ẩn Bớt
        </button>
      ) : (
        <button
          className="w-full p-3 text-center  hover:font-bold hover:tracking-widest text-secondary-500 hover:text-accent transition-all duration-250"
          onClick={handleLoadMore}
        >
          Xem Tất Cả
        </button>
      )}
    </div>
  );
}

export default CategoryList;
