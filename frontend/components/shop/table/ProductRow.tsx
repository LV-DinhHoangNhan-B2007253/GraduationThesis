"use client";

import { IProduct } from "@/interfaces/product.interface";
import {
  DeleteOneProduct,
  UpdateProductInfo,
} from "@/services/product.service";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

function ProductRow({ product }: { product: IProduct }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<IProduct>(product);

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Bật/tắt chế độ chỉnh sửa
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const form = {
        name: editData.name,
        price: editData.price,
        description: editData.description,
        stock_quantity: editData.stock_quantity,
        sku: editData.sku,
      };
      console.log(form);
      const response = await UpdateProductInfo(product._id, form);
      setIsEditing(false); // Thoát chế độ chỉnh sửa sau khi lưu thành công
      // Kiểm tra xem phản hồi có chứa sản phẩm không
      if (response && response.product) {
        // Cập nhật thông tin sản phẩm trong state
        setEditData((prevProduct) => ({
          ...prevProduct,
          ...response.product, // Cập nhật thông tin mới từ phản hồi
        }));

        toast.success(`Update Product ${response.product.sku} Success!`);
      } else {
        toast.success("Update Product Success!");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const deleteProduct = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (isConfirmed) {
      try {
        const res = await DeleteOneProduct(product._id);
        if (res) {
          toast.success("Product deleted successfully!");
        }
      } catch (error: any) {
        toast.error(`Failed to delete product: ${error.message}`);
      }
    }
  };

  const handleCancel = () => {
    setEditData(product); // Khôi phục dữ liệu gốc
    setIsEditing(false); // Thoát chế độ chỉnh sửa
  };

  return (
    <>
      <tr className="hover:bg-gray-100">
        <td className="px-4 py-2 whitespace-nowrap">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-12 w-12 object-cover rounded-md"
          />
        </td>
        <td className="px-4 py-2 text-sm font-medium text-gray-900 max-w-[100px] truncate">
          {product.name}
        </td>
        <td className="px-4 py-2 text-sm text-gray-500 max-w-[70px] truncate">
          {product.sku}
        </td>
        <td className="px-4 py-2 text-sm text-gray-500 text-center">
          {product.stock_quantity}
        </td>
        <td className="px-4 py-2 text-sm text-gray-500">
          ${product.price.toFixed(2)}
        </td>
        <td className="px-4 py-2 text-sm text-gray-500 max-w-[150px] truncate">
          {product.description}
        </td>
        <td className="px-4 py-2 text-sm font-medium flex gap-4">
          <button
            onClick={handleEditClick}
            className="text-indigo-600 hover:text-indigo-900"
          >
            {isEditing ? "Close" : "Edit"}
          </button>

          <button
            onClick={deleteProduct}
            className="text-red-600 hover:text-indigo-900"
          >
            Delete
          </button>
          <Link href={`/product/analyze/${product._id}`}>
            <button className="text-green-600 hover:text-indigo-900">
              Analyze
            </button>
          </Link>
        </td>
      </tr>

      {isEditing && (
        <tr
          className={`transition-transform duration-700 ${
            isEditing ? "translate-y-0" : "-translate-y-20"
          }`}
        >
          <td colSpan={7} className="p-4 bg-gray-50">
            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={editData.sku}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  In Stock
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={editData.stock_quantity}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={editData.price}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-600">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 py-1 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default ProductRow;