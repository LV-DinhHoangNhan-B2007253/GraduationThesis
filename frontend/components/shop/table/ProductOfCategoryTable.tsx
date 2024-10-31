import { IProduct } from "@/interfaces/product.interface";
import React from "react";

function ProductOfCategoryTable({
  products,
  onSelectProduct,
}: {
  products: IProduct[];
  onSelectProduct: (productId: string) => void;
}) {
  return (
    <div className="overflow-y-auto max-h-[70vh]">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100 dark:bg-dark-modal-popup">
          <tr>
            <th className="border px-4 py-2">Select</th>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Product Code</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: IProduct, index) => (
            <tr
              key={product._id}
              className="hover:opacity-80 bg-light-input-field dark:bg-dark-input-field"
            >
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  onChange={() => onSelectProduct(product._id)} // Gọi hàm khi chọn sản phẩm
                />
              </td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.sku}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductOfCategoryTable;
