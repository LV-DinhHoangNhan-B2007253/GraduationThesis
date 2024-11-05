"use client";

import { ICategory } from "@/interfaces/category.interface";
import { GetCategoryAndProductByShopId } from "@/services/category.service";
import { get } from "http";
import { use, useEffect, useState } from "react";
import CategoryTable from "../table/CategoryTable";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SpinnerLoader from "@/components/Spinner";
import CreateCategoryForm from "../form/CreateCategoryForm";
import AddProductToCategoryForm from "../form/AddProductToCategoryForm";
import { IProduct } from "@/interfaces/product.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import ListCardSekelecton from "@/components/skelecton/ListCardSekelecton";

function CategoryManageShop() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [categories, setCategories] = useState<ICategory[]>();
  const [searchCatgories, setSearchCatgories] = useState<ICategory[]>([]);
  // mở modal tạo mới danh mục và thêm sản phẩm vào danh mục
  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);
  const [isAddForm, setIsAddForm] = useState<boolean>(false);
  // danh sách sản phẩm truyền xuống component :thêm sản phẩm vào danh mục
  const [products, setProducts] = useState<IProduct[]>();
  // search
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Tìm kiếm theo tên hoặc SKU
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (categories) {
      // Kiểm tra xem originProductList có tồn tại
      const filterCate = categories.filter((cate) =>
        cate.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchCatgories(filterCate);
    }
  };
  const getCategories = async () => {
    try {
      const data = await GetCategoryAndProductByShopId(
        userInfo?.shop_id as string
      );
      if (data) {
        setCategories(data.categories);
        setProducts(data.products);
        setSearchCatgories(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
    return () => {
      // getCategories();
    };
  }, []);

  const handleCloseCreateForm = () => {
    setIsOpenCreateForm(false);
  };
  const handleCloseAddForm = () => {
    setIsAddForm(false);
  };

  const handleOpenCreateForm = () => {
    setIsOpenCreateForm(true);
    setIsAddForm(false);
  };
  const handleOpenAddForm = () => {
    setIsAddForm(true);
    setIsOpenCreateForm(false);
  };

  return (
    <div className="relative z-20 ">
      {/* nut tao danh muc moi,them san pham vao danh muc co san, tạo danh mục cùng với các sản phẩm đã chọn, */}
      <div className="flex gap-5 items-center justify-end my-2 px-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder="tìm danh mục theo tên"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className=" outline-none shadow w-2/3 p-3 rounded-sm bg-input text-input-text"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleOpenCreateForm}
            className="p-2   text-center hover:opacity-85 rounded-sm bg-orange-600 text-white hover:rounded-xl duration-300"
          >
            Thêm danh mục mới +
          </button>
          <button
            onClick={handleOpenAddForm}
            className="p-2   text-center hover:opacity-85 rounded-sm bg-indigo-800 text-white hover:rounded-xl duration-300"
          >
            Thểm sản phẩm vào danh mục
          </button>

          <button
            onClick={() => getCategories()}
            className="p-2   text-center hover:opacity-85 rounded-sm bg-indigo-200  hover:rounded-xl duration-300"
          >
            <FontAwesomeIcon icon={faRefresh} />
          </button>
        </div>
      </div>
      {/* overlay */}
      {isOpenCreateForm && (
        <div className="overlay absolute z-30 top-10 left-0 right-0 bottom-0 backdrop-blur-sm"></div>
      )}
      {isAddForm && (
        <div className="overlay absolute z-30 top-10 left-0 right-0 bottom-0 backdrop-blur-sm"></div>
      )}
      {/* form */}
      {isOpenCreateForm && (
        <div className="absolute rounded-md p-3 top-12 bottom-36 bg-gradient-to-b from-indigo-200 to-indigo-700  right-20 left-20 z-40 shadow-xl backdrop-blur-md">
          <CreateCategoryForm
            shopCreatorId={userInfo?.shop_id as string}
            onClose={handleCloseCreateForm}
          />
        </div>
      )}
      {isAddForm && (
        <div className="absolute rounded-md p-3 top-12 bottom-10 bg-gradient-to-b from-indigo-200 to-indigo-700  right-20 left-20 z-40 shadow-xl backdrop-blur-md">
          <AddProductToCategoryForm
            onClose={handleCloseAddForm}
            categories={categories}
            products={products}
          />
        </div>
      )}
      {categories ? (
        <div className="w-full max-h-screen overflow-y-auto ">
          <CategoryTable categories={searchCatgories} />
        </div>
      ) : (
        <ListCardSekelecton />
      )}
    </div>
  );
}

export default CategoryManageShop;
