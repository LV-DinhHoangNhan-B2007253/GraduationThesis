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
        <section className="min-h-screen">
          <ProductList productList={products} />
        </section>
      </div>
    </MainLayout>
  );
}

export default ProductsByCategory;
