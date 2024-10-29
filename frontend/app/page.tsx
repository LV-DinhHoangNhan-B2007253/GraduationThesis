"use client";

import ProductCard from "@/components/areaDetail/ProductCard";
import CategoryList from "@/components/category/CategoryList";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { ICategory } from "@/interfaces/category.interface";
import { IProduct } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { GetAllCategory } from "@/services/category.service";
import {
  GetAllProducts,
  getRecommendedProducts,
} from "@/services/product.service";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

export default function Home() {
  // const { userInfo } = useSelector((state: RootState) => state.user);
  const [recommentedProducts, setRecommentedProduct] = useState<IProduct[]>();
  const [products, setProducts] = useState<IProduct[]>();
  const [categories, setCategories] = useState<ICategory[]>();

  const fetchData = async () => {
    try {
      const recommentProducts = await getRecommendedProducts();
      setRecommentedProduct(recommentProducts);
      const productList = await GetAllProducts();
      setProducts(productList);
      const categoryList = await GetAllCategory();
      setCategories(categoryList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // slider setting

  return (
    <MainLayout>
      <div className="sm:mx-40 py-2 mx-1">
        {/* recomment */}
        {recommentedProducts && (
          <section className="sm:mb-14 mb-4">
            <h1 className="tracking-widest my-5 uppercase font-bold text-base sm:text-2xl">
              Top Products
            </h1>
            <div className=" grid sm:grid-cols-4 grid-cols-2  gap-2 ">
              {recommentedProducts.map((product) => (
                <div key={product._id} className="col-span-1">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}
        {/* categories */}
        {categories && (
          <div>
            <CategoryList categories={categories} />
          </div>
        )}
        {/* all product */}
        {products && (
          <section>
            <h1 className="tracking-widest my-5 uppercase font-bold text-base sm:text-2xl text-center py-4 bg-light-modal-popup dark:bg-dark-modal-popup text-orange-600 border-b-4 border-orange-700">
              daily discover
            </h1>
            <div className="grid sm:grid-cols-6 grid-cols-4 gap-2">
              {products.slice(0, 24).map((pro) => (
                <div key={pro.sku} className="col-span-1  my-2  max-h-[400px]">
                  <ShopProductCard product={pro} />
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center">
              <Link
                href={"/product/all"}
                className="w-1/3 mt-4 block text-center font-light tracking-widest hover:underline transition-all duration-200 py-3 bg-light-modal-popup dark:bg-dark-modal-popup"
              >
                View all
              </Link>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
