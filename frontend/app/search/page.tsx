"use client";

import ProductCard from "@/components/areaDetail/ProductCard";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { IProduct } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { searchProductAndShop } from "@/services/category.service";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function SearhPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [shop, setShop] = useState<IShop | null>();
  const [products, setProduct] = useState<IProduct[]>();

  const fetchSearcResult = async () => {
    if (query) {
      try {
        const data = await searchProductAndShop(query);
        setProduct(data.products);
        setShop(data.shopInfo);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setProduct([]); // Reset sản phẩm khi không có query
      setShop(null); // Reset cửa hàng khi không có query
    }
  };

  useEffect(() => {
    fetchSearcResult();
  }, [query]);

  return (
    <MainLayout>
      {shop || (products && products?.length > 0) ? (
        <div className=" sm:mx-48 mx-2">
          {/* shop */}
          {shop && (
            <section className=" sm:mt-10 my-4 py-4 px-6 bg-light-modal-popup dark:bg-dark-modal-popup shadow rounded flex justify-between items-center">
              <div className=" flex justify-start gap-3 items-center">
                <img
                  src={`${shop.logoUrl}`}
                  alt="Shop logo"
                  className="w-[100px] h-[100px] rounded-full"
                />
                <div>
                  <p className="uppercase text-base sm:text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                    {shop.name}
                  </p>
                </div>
              </div>
              <div>
                <Link href={`/shop/${shop?._id}`}>
                  <button className="capitalize p-2 border border-gray-300 bg-light-btn-bg dark:bg-dark-bg-btn dark:text-dark-btn-text text-light-btn-text">
                    View Shop
                  </button>
                </Link>
              </div>
            </section>
          )}
          {/* products */}
          {products && (
            <div className="grid grid-cols-6 gap-2 sm:mt-20">
              {products.map((product) => (
                <div key={product._id} className="col-span-1">
                  <ShopProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <img src="/emptycart.png" alt="" />
        </div>
      )}
    </MainLayout>
  );
}

export default SearhPage;
