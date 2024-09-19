"use client";

import CategoryItemSlider from "@/components/areaDetail/CategoryItemSlider";
import ProductList from "@/components/areaDetail/ProductList";
import { IArea } from "@/interfaces/area.interface";
import { ICategory } from "@/interfaces/category.interface";
import { IProduct } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { GetOneAreaAndCategoryLabel } from "@/services/area.service";
import { useEffect, useState } from "react";

function ProductsByArea(props: any) {
  const areaId = props.params.slug;
  const [areaInfo, setAreaInfo] = useState<IArea>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [products, setProducts] = useState<IProduct[]>();

  const fetchData = async () => {
    try {
      const data = await GetOneAreaAndCategoryLabel(areaId);
      setAreaInfo(data);

      setCategories(data.categoryItem);

      const product: IProduct[] = data.categoryItem.flatMap(
        (category: ICategory) => category.products
      );
      setProducts(product);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [areaId]);
  return (
    <MainLayout>
      {areaInfo ? (
        <div className="px-4 sm:px-10">
          <h1 className="py-4 text-2xl tracking-widest uppercase sm:text-6xl text-light-primary-text dark:text-dark-primary-text ">
            {areaInfo.name} Furniture
          </h1>
          <section className="px-2 pt-3 pb-10 my-6 border-gray-200 marker:border-b">
            <CategoryItemSlider categoryList={categories} />
          </section>
          <section className="min-h-screen">
            <ProductList productList={products} />
          </section>
        </div>
      ) : (
        <></>
      )}
    </MainLayout>
  );
}

export default ProductsByArea;
