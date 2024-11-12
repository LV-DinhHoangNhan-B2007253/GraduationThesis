"use client";

import { IUser } from "@/interfaces/auth.interface";
import { IProduct } from "@/interfaces/product.interface";
import { RootState } from "@/redux/store";
import {
  GetAllProducts,
  GetAllProductsOfShop,
} from "@/services/product.service";
import { useSelect } from "@nextui-org/react";
import { stat } from "fs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductTable from "../table/ProductTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import CreateProductForm from "../form/CreateProductForm";
import ListCardSekelecton from "@/components/skelecton/ListCardSekelecton";

function ProductManageShop() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [originProductList, setOriginProductList] = useState<IProduct[]>();
  const [products, setProducts] = useState<IProduct[]>();

  // điều kiện tìm kiếm
  const [searchTerm, setSearchTerm] = useState<string>("");
  // sort
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  // toggle create productForm
  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);

  // get products
  const fetchAllProduct = async () => {
    try {
      const data = await GetAllProductsOfShop(userInfo?.shop_id as string);
      setOriginProductList(data);
      setProducts(data);
    } catch (error) {
      console.log("fetch product at productManageShop Component error", error);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  //
  // Tìm kiếm theo tên hoặc SKU
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (originProductList) {
      // Kiểm tra xem originProductList có tồn tại
      const filteredProducts = originProductList.filter(
        (product) =>
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.sku.toLowerCase().includes(term.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  // Sắp xếp theo tên sản phẩm từ A-Z hoặc Z-A
  const handleSort = (order: "asc" | "desc") => {
    setSortOrder(order);
    if (products) {
      const sortedProducts = [...products].sort((a, b) => {
        if (order === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
      setProducts(sortedProducts);
    }
  };

  // Xóa sắp xếp, quay lại danh sách ban đầu
  const resetSortAndSearch = () => {
    setSearchTerm("");
    setSortOrder(null);
    setProducts(originProductList);
  };

  // close create product form
  const closeForm = () => setIsOpenCreateForm(false);

  return (
    <div className="max-h-full overflow-y-auto">
      {products ? (
        // search and filter
        <div className="relative z-10">
          <div>
            <div className="flex justify-between items-center mb-5 mt-1">
              {/* search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm theo tên hoặc mã"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className=" shadow w-2/3 p-3 rounded-sm bg-input text-input-text outline-none"
                />
              </div>
              {/* filter */}
              <div>
                <div className="flex justify-around items-center gap-4 px-2">
                  <button
                    className="text-sm font-light text-label hover:text-accent"
                    onClick={() => handleSort("asc")}
                  >
                    sắp xếp theo {`(A-Z)`}
                  </button>
                  <button
                    className="text-sm font-light text-label hover:text-accent"
                    onClick={() => handleSort("desc")}
                  >
                    sắp xếp theo {`(Z-A)`}
                  </button>
                  <button
                    className="text-sm font-light text-label hover:text-accent"
                    onClick={resetSortAndSearch}
                  >
                    mặc định
                  </button>
                </div>
              </div>
            </div>
            {/* create and refresh btn */}
            <div className="flex items-center justify-between mx-2 my-3">
              <button
                className="text-center p-2 text-sm hover:rounded-md bg-button-success hover:bg-accent min-w-[50px] shadow"
                onClick={() => fetchAllProduct()}
              >
                Làm mới
                <span className="mx-1">
                  <FontAwesomeIcon icon={faRefresh} />
                </span>
              </button>
              <button
                onClick={() => setIsOpenCreateForm(true)}
                className="text-center p-2 text-sm hover:rounded-md bg-button-success hover:bg-accent min-w-[50px] shadow"
              >
                Thêm +
              </button>
            </div>
            {/* create produc form */}
            <div
              className={`${
                isOpenCreateForm
                  ? "block absolute left-10 right-2 bottom-10 bg-card-bg shadow-lg rounded z-[200] top-10 px-5 max-h-[100vh]"
                  : "hidden"
              }  `}
            >
              <CreateProductForm
                shop_id={userInfo?.shop_id as string}
                closeForm={closeForm}
              />
            </div>
          </div>
          {/* product table */}
          <div className="w-full max-h-screen overflow-y-auto ">
            <ProductTable products={products} />
          </div>
        </div>
      ) : (
        <ListCardSekelecton />
      )}
    </div>
  );
}

export default ProductManageShop;
