"use client";

import ProductList from "@/components/areaDetail/ProductList";
import { ICategory } from "@/interfaces/category.interface";
import { IProduct } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { GetProductByCategory } from "@/services/product.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ProductsByCategory(props: any) {
  const categoryId = props.params.slug;
  const [categoryProducts, setCategoryProduct] = useState<ICategory>();
  const [products, setProducts] = useState<IProduct[]>();

  const fetchData = async () => {
    try {
      const data = await GetProductByCategory(categoryId);
      if (data) {
        setCategoryProduct(data);
        setProducts(data.products);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <MainLayout>
      <div className="px-4 sm:px-8">
        <h1 className="py-4 text-2xl tracking-widest uppercase sm:text-6xl text-light-primary-text dark:text-dark-primary-text ">
          {categoryProducts?.name} Furniture
        </h1>
        {products?.length !== 0 ? (
          <section className="min-h-screen">
            <ProductList productList={products} />
          </section>
        ) : (
          <div className="flex justify-center items-center flex-col gap-3 p-4 w-full h-screen bg-light-modal-popup dark:bg-dark-modal-popup my-2">
            <p className="font-bold text-3xl">Oops!</p>
            <p className="font-mono">Nothing here</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ProductsByCategory;
