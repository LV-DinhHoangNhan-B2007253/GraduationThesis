import { ICategory } from "@/interfaces/category.interface";
import { IProduct } from "@/interfaces/product.interface";
import { GetProductByCategory } from "@/services/product.service";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProductTable from "./ProductTable";
import ProductSelectTable from "./ProductSelectTable";
import ProductOfCategoryTable from "./ProductOfCategoryTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  DeleteOneCategoryById,
  GetCategoryAndProductByShopId,
  RemoveProductFromCategory,
  UpdateCategoryInfo,
} from "@/services/category.service";
import { toast } from "react-toastify";

function CategoryRow({ category }: { category: ICategory }) {
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [editData, setEditData] = useState<ICategory>(category);
  const [categoryName, setCategoryName] = useState<string>(category.name);
  // chon san pham
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // ID các sản phẩm được chọn
  const handleProductSelect = (productId: string) => {
    setSelectedProducts(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId) // Bỏ chọn nếu đã chọn
          : [...prevSelected, productId] // Thêm nếu chưa chọn
    );
  };
  const getProductsByCategory = async () => {
    try {
      const productsList = await GetProductByCategory(category._id);
      setProducts(productsList.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductsByCategory();
  }, [category._id]);

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Bật/tắt chế độ chỉnh sửa
    if (isEditing === false) {
      setSelectedProducts([]);
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Thoát chế độ chỉnh sửa
    setCategoryName(category.name);
  };

  const handleSubmit = async () => {
    try {
      const FormData = {
        name: categoryName,
      };
      const data = await UpdateCategoryInfo(category._id, FormData);
      if (data) {
        console.log(data);

        toast.success(` ${data.message}`);
      }
    } catch (error: any) {
      toast.error`${error.error}`;
    }
  };

  // lọc các sản phẩm còn lại
  const filterRemainingProducts = (
    products: IProduct[],
    selectedProducts: string[]
  ): string[] => {
    return products
      .filter(
        (product) =>
          !selectedProducts.some((selected) => selected === product._id)
      )
      .map((product) => product._id); // Lấy danh sách id dưới dạng string[]
  };

  const handleRemoveProducts = async () => {
    try {
      console.log(FormData);
      const data = await RemoveProductFromCategory(
        category._id,
        selectedProducts
      );
      if (data) {
        toast.success(`${data.message}`);
        getProductsByCategory();
      }
    } catch (error: any) {
      toast.error(`${error.error}`);
    }
  };

  // delete this category

  const handleDeleteCategory = async () => {
    try {
      const isConfirm = window.confirm(
        `Are you sure you want to delete this ${category.name} category?`
      );
      if (isConfirm) {
        const data = await DeleteOneCategoryById(category._id);
        if (data) {
          toast.success(`${data.message}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <tr className="bg-light-card-bg dark:bg-dark-card-bg border-b hover:cursor-pointer ">
        <td className="px-4 py-2  font-bold capitalize max-w-full truncate text-ellipsis text-nowrap text-light-primary-text dark:text-dark-primary-text text-base hover:text-indigo-800 dark:hover:text-orange-800">
          {category.name}
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          <img
            loading="lazy"
            src={category.banner}
            alt={category.banner}
            className="h-12 w-12 object-cover rounded-md"
          />
        </td>

        <td className="px-4 py-2 text-sm font-medium flex gap-10 items-center">
          <button
            onClick={handleEditClick}
            className="text-green-500  hover:text-indigo-900 "
          >
            {isEditing ? (
              <FontAwesomeIcon
                icon={faClose}
                size="1x"
                className="p-2 drop-shadow-md"
              />
            ) : (
              <FontAwesomeIcon
                icon={faPen}
                size="1x"
                className="p-2 drop-shadow-md"
              />
            )}
          </button>

          <button
            onClick={handleDeleteCategory}
            className="text-red-600 hover:text-indigo-900"
          >
            <FontAwesomeIcon
              icon={faTrash}
              size="1x"
              className="p-2 drop-shadow-md"
            />
          </button>
        </td>
      </tr>

      {/* edit */}
      {isEditing && (
        <tr
          className={`transition-transform duration-700 ${
            isEditing ? "translate-y-0" : "-translate-y-20"
          }`}
        >
          <td colSpan={7} className="p-4 bg-gray-50">
            <div className="flex items-center justify-between my-3">
              {/* category info */}
              <div className="">
                <div className="flex items-center gap-3 ">
                  <label className="text-sm font-semibold text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full mt-1 p-2 border rounded bg-light-input-field dark:bg-dark-input-field outline-none"
                  />
                </div>
              </div>
              {/* action button */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={handleSubmit}
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
            </div>
            {/* action with product selected */}

            {/* product table of category */}
            {products && (
              <ProductOfCategoryTable
                products={products}
                onSelectProduct={handleProductSelect}
              />
            )}
            {selectedProducts.length > 0 && (
              <div className="w-full flex justify-between items-end my-2">
                <p className="font-bold uppercase text-light-primary-text dark:text-dark-primary-text">
                  Selected:{" "}
                  <span className="text-green-600">
                    {selectedProducts.length}
                  </span>
                </p>
                <button
                  onClick={handleRemoveProducts}
                  className="px-3 py-1 rounded text-clip bg-yellow-800 text-white font-bold hover:bg-yellow-500"
                >
                  Remove
                </button>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default CategoryRow;
