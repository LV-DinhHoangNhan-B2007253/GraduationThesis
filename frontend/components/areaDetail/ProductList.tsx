"use client";

import { IProduct } from "@/interfaces/product.interface";
import ProductCard from "./ProductCard";
import { ChangeEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { SearchProduct } from "@/services/product.service";
import { toast } from "react-toastify";
import ShopProductCard from "../shop/ShopProductCard";

function ProductList({ productList }: { productList: IProduct[] | undefined }) {
  const [currentProduct, setCurrentProducts] = useState<IProduct[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("all");
  const productPerPage = 24;
  const [originalProductList, setOriginalProductList] = useState<IProduct[]>(
    []
  );
  let [currentPage, setCurrentPage] = useState<number>(1);
  let totalPage = Math.ceil(currentProduct.length / productPerPage);
  let indexOfLastProduct: number = currentPage * productPerPage;
  let indexOfFirstProduct: number = indexOfLastProduct - productPerPage;

  useEffect(() => {
    if (productList) {
      setOriginalProductList(productList);
      setCurrentProducts(productList);
    }
  }, [productList]);

  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await SearchProduct(query);
      setCurrentProducts(result);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const select = e.target.value;
    setFilterOption(select);
    filterProduct(select);
  };

  const filterProduct = (filterOptions: any) => {
    let updatedProduct = [...currentProduct];

    switch (filterOptions) {
      case "az":
        updatedProduct = updatedProduct.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case "za":
        updatedProduct = updatedProduct.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;
      case "all":
        updatedProduct = [...originalProductList];
        break;
      default:
        updatedProduct = [...currentProduct];
        break;
    }
    setCurrentProducts(updatedProduct);
  };
  return (
    <div>
      <div className="grid grid-cols-6">
        <div className="flex items-center justify-between col-span-4 mb-2 sm:col-span-4 sm:col-start-1">
          <input
            type="text"
            name="search"
            className="w-full px-1 py-2 border rounded bg-light-input-field text-light-input-text border-light-input-border dark:text-dark-input-text dark:bg-dark-input-field dark:border-dark-input-border"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            onClick={handleSearch}
            className="p-3 text-center transition-all border rounded cursor-pointer border-light-input-border dark:border-dark-border hover:bg-dark-bg-btn-hover hover:text-white"
          />
        </div>
        <div className="col-span-1 col-start-6">
          <select
            name="filter"
            id="filter"
            value={filterOption}
            className="w-full px-1 py-2 text-center capitalize border rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border"
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="az">a-z</option>
            <option value="za">z-a</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 my-4 sm:grid-cols-6 sm:gap-6">
        {/* product list */}
        {currentProduct
          ?.slice(indexOfFirstProduct, indexOfLastProduct)
          .map((product, index) => (
            <div className="col-span-1 " key={index}>
              <ShopProductCard product={product} key={index} />
            </div>
          ))}
      </div>
      {/* page */}
      <div className="flex items-center justify-center gap-5 py-4 ">
        <FontAwesomeIcon
          onClick={handleBack}
          icon={faAngleLeft}
          className="text-2xl cursor-pointer text-light-primary-text dark:text-dark-primary-text hover:text-light-active dark:hover:text-dark-active"
        />
        <p>
          Page: {currentPage} / {totalPage}
        </p>
        <FontAwesomeIcon
          onClick={handleNext}
          icon={faAngleRight}
          className="text-2xl cursor-pointer text-light-primary-text dark:text-dark-primary-text hover:text-light-active dark:hover:text-dark-active"
        />
      </div>
    </div>
  );
}

export default ProductList;
