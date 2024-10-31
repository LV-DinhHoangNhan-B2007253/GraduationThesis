import { ICategory } from "@/interfaces/category.interface";
import React from "react";
import CategoryRow from "./CategoryRow";

function CategoryTable({ categories }: { categories: ICategory[] }) {
  return (
    <div className="max-w-full overflow-hidden ">
      <table className="min-w-full bg-light-card-bg dark:bg-dark-card-bg shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-2/3">
              Name
            </th>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Image
            </th>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            // <ProductRow key={product._id} product={product} />
            <CategoryRow category={category} key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryTable;
