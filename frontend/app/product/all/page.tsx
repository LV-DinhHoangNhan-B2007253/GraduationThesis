"use client";

import ProductList from "@/components/areaDetail/ProductList";
import { IProduct } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { GetAllProducts } from "@/services/product.service";
import { useEffect, useState } from "react";

function AllProduct() {
  const [products, setProducts] = useState<IProduct[]>();

  const fetchData = async () => {
    try {
      const productList = await GetAllProducts();
      setProducts(productList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainLayout>
      {products ? (
        <div className="sm:mx-40 mx-2 sm:my-10 my-2">
          <ProductList productList={products} />
        </div>
      ) : (
        <p>loaiong</p>
      )}
    </MainLayout>
  );
}

export default AllProduct;
