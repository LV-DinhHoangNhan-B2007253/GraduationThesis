"use client";

import ProductList from "@/components/areaDetail/ProductList";
import { IProduct } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import {
  GetAllProducts,
  GetOutStandingProducts,
} from "@/services/product.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function OutStandingPage() {
  const [products, setProducts] = useState<IProduct[]>();

  const fetchData = async () => {
    try {
      const data = await GetOutStandingProducts();
      if (data) {
        setProducts(data);
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
      <div className="px-4">
        <p className="py-4 text-2xl tracking-widest uppercase sm:text-6xl text-light-primary-text dark:text-dark-primary-text ">
          New Arrivals
        </p>
        {products && products.length > 0 ? (
          <section className="min-h-screen">
            <ProductList productList={products} />
          </section>
        ) : (
          <></>
        )}
      </div>
    </MainLayout>
  );
}

export default OutStandingPage;
