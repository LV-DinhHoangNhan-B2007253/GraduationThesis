"use client";

import ShopProductCard from "@/components/shop/ShopProductCard";
import { IPromotionDetail } from "@/interfaces/promotion.interface";
import MainLayout from "@/layouts/MainLayout";
import { GetPromotionsDetailById } from "@/services/promotion.service";
import { useEffect, useState } from "react";

function page(props: any) {
  const promotionId = props.params.slug;
  const [promotionDetail, setPromotionDetail] = useState<IPromotionDetail>();

  const fetchPromotionDetail = async () => {
    try {
      const data = await GetPromotionsDetailById(promotionId);
      setPromotionDetail(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPromotionDetail();
  }, []);
  return (
    <MainLayout>
      <div className="sm:mx-48 mx-2">
        {promotionDetail ? (
          <div>
            <div>
              <img
                loading="lazy"
                src={`${promotionDetail.promotion_banner}`}
                alt="Promotion banner"
                className="w-full sm:h-[400px] h-[300px] object-cover my-3"
              />
              <div className="bg-light-modal-popup dark:bg-dark-modal-popup rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-10">
                <h1 className="text-center text-4xl font-bold uppercase tracking-widest text-blue-600 mb-4">
                  {promotionDetail.title}
                </h1>

                <div className="flex items-center justify-between text-lg text-gray-700 mb-6">
                  <p className="font-medium text-light-primary-text dark:text-dark-primary-text text-sm sm:text-base">
                    <span className="text-blue-500">From:</span>{" "}
                    {new Date(promotionDetail.startDate).toLocaleDateString()}
                  </p>
                  <p className="font-medium text-light-primary-text dark:text-dark-primary-text text-sm sm:text-base">
                    <span className="text-red-500">To:</span>{" "}
                    {new Date(promotionDetail.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-center text-gray-600">
                  <p className=" text-light-primary-text dark:text-dark-primary-text text-sm sm:text-base">
                    <span className="font-semibold">Note:</span>{" "}
                    {promotionDetail.description}
                  </p>
                </div>
              </div>
            </div>
            <h1 className="text-base sm:text-2xl text-light-primary-text dark:text-dark-primary-text mt-6 tracking-widest font-light">
              applicable products
            </h1>
            <div className="grid grid-cols-6 gap-1">
              {promotionDetail.products.map((pro) => (
                <div
                  className="col-span-2 sm:col-span-2 my-2"
                  data-aos="fade-up"
                >
                  <ShopProductCard product={pro} key={pro.sku} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>LoadingModuleData..</p>
        )}
      </div>
    </MainLayout>
  );
}

export default page;
