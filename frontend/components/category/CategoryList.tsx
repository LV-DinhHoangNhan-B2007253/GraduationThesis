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
      <h1 className="py-4 uppercase font-light bg-light-modal-popup dark:bg-dark-modal-popup px-2">
        Catgories
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
          className="w-full p-3 text-center hover:underline hover:font-bold hover:tracking-widest"
          onClick={handleHidden}
        >
          hidden
        </button>
      ) : (
        <button
          className="w-full p-3 text-center hover:underline hover:font-bold hover:tracking-widest"
          onClick={handleLoadMore}
        >
          more
        </button>
      )}
    </div>
  );
}

export default CategoryList;
