"use client";

import { IProduct } from "@/interfaces/product.interface";
import ProductRow from "./ProductRow";

function ProductTable({ products }: { products: IProduct[] }) {
  return (
    <div className="max-w-full overflow-hidden">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-secondary-200 text-left text-xs font-semibold text-label uppercase tracking-wider">
              Hình ảnh
            </th>
            <th className="px-4 py-2 bg-secondary-200 text-left text-xs font-semibold text-label uppercase tracking-wider">
              Tên sản phẩm
            </th>
            <th className="px-4 py-2 bg-secondary-200 text-left text-xs font-semibold text-label uppercase tracking-wider">
              Mã sản phẩm
            </th>
            <th className="px-4 py-2 bg-secondary-200 text-left text-xs font-semibold text-label uppercase tracking-wider">
              Số lượng trong kho
            </th>
            <th className="px-4 py-2 bg-secondary-200 text-left text-xs font-semibold text-label uppercase tracking-wider">
              Đơn giá
            </th>
            <th className="px-4 py-2 bg-secondary-200 text-left text-xs font-semibold text-label uppercase tracking-wider">
              Mô tả
            </th>
            <th className="px-4 py-2 bg-secondary-200 text-left text-xs font-semibold text-label uppercase tracking-wider">
              Thao tác
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
