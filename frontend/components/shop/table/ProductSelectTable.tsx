import { IProduct } from "@/interfaces/product.interface";
import React from "react";

function ProductSelectTable({
  products,
  onSelectProduct,
}: {
  products: IProduct[];
  onSelectProduct: (productId: string) => void;
}) {
  return (
    <div className="overflow-y-auto h-full ">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-transparent">
          <tr>
            <th className="border px-4 py-2">Đã chọn</th>
            <th className="border px-4 py-2">Tên sản phẩm</th>
            <th className="border px-4 py-2">Mã sản phẩm</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: IProduct, index) => (
            <tr
              key={product._id}
              className="bg-transparent hover:opacity-80 hover:cursor-pointer"
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

export default ProductSelectTable;
