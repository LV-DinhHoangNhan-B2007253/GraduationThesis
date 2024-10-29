"use client";

import { IProduct } from "@/interfaces/product.interface";
import ProductRow from "./ProductRow";

function ProductTable({ products }: { products: IProduct[] }) {
  return (
    <div className="max-w-full overflow-hidden">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Image
            </th>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              In Stock
            </th>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-2 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product._id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
