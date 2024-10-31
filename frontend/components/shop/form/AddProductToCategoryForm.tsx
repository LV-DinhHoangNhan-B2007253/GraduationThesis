import { ICategory } from "@/interfaces/category.interface";
import { IProduct } from "@/interfaces/product.interface";
import React, { useState } from "react";
import ProductSelectTable from "../table/ProductSelectTable";
import { log } from "console";
import { AddProductsToCategory } from "@/services/category.service";
import { toast } from "react-toastify";

function AddProductToCategoryForm({
  onClose,
  categories,
  products,
}: {
  onClose: () => void;
  categories: ICategory[] | undefined;
  products: IProduct[] | undefined;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // ID của danh mục được chọn
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // ID các sản phẩm được chọn

  // Hàm để chọn hoặc bỏ chọn sản phẩm
  const handleProductSelect = (productId: string) => {
    setSelectedProducts(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId) // Bỏ chọn nếu đã chọn
          : [...prevSelected, productId] // Thêm nếu chưa chọn
    );
  };

  // Hàm gửi yêu cầu thêm sản phẩm vào danh mục
  const handleSubmit = async () => {
    if (!selectedCategory) {
      alert("Vui lòng chọn danh mục.");
      return;
    }
    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    try {
      const data = await AddProductsToCategory(
        selectedCategory,
        selectedProducts
      );
      if (data) {
        toast.success(`${data.message}`);
        setSelectedProducts([]); // Reset danh sách sản phẩm đã chọn sau khi thêm thành công
        onClose();
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào danh mục:", error);
    }
  };

  return (
    <div className="w-full h-full bg-light-modal-popup dark:bg-dark-card-bg rounded-md shadow-lg p-1">
      {/* top */}
      <div>
        <div className="flex justify-end items-center">
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-red-600 text-light-primary-text dark:text-dark-primary-text px-3"
          >
            X
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-4 text-center">
          Add products to category
        </h2>
      </div>
      <div>
        {/* Danh sách danh mục */}
        {categories ? (
          <div className="mb-4">
            <h3 className="font-medium">Select Category:</h3>
            <select
              className="w-full p-2 border rounded"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Select Category --</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>Create new ccategory pls!</p>
        )}

        {/* Danh sách sản phẩm */}
        <div className="flex flex-col justify-between">
          {products ? (
            <div className=" w-full">
              <h3 className="font-medium">Select products:</h3>
              <div className="  h-[65vh]">
                <ProductSelectTable
                  onSelectProduct={handleProductSelect}
                  products={products}
                />
              </div>
            </div>
          ) : (
            <p> Create new product pls!</p>
          )}
        </div>

        {/* Nút gửi */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 w-full text-white  rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default AddProductToCategoryForm;
