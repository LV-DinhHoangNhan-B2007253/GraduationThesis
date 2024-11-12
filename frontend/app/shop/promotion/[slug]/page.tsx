"use client";

import ShopProductCard from "@/components/shop/ShopProductCard";
import { IPromotionDetail } from "@/interfaces/promotion.interface";
import MainLayout from "@/layouts/MainLayout";
import { GetPromotionsDetailById } from "@/services/promotion.service";
import { useEffect, useState } from "react";
import { format, parse } from "date-fns"; // Thêm dòng này
import ListCardSekelecton from "@/components/skelecton/ListCardSekelecton";

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
              <div className="">
                <h1 className="text-heading uppercase text-center text-balance sm:text-3xl my-3 tracking-widest font-bold">
                  {promotionDetail.title}
                </h1>

                <div className="flex items-center justify-between text-lg text-gray-700 mb-6">
                  <p className="font-medium text-sm sm:text-base">
                    <span className="text-button-success">Từ ngày:</span>{" "}
                    <span className="text-label font-bold italic">
                      {format(
                        new Date(
                          promotionDetail.startDate
                        ).toLocaleDateString(),
                        "dd/MM/yyyy"
                      )}
                    </span>
                  </p>
                  <p className="font-medium  text-sm sm:text-base">
                    <span className="text-button-warning">Đến ngày:</span>{" "}
                    <span className="text-label font-bold italic">
                      {format(
                        new Date(promotionDetail.endDate).toLocaleDateString(),
                        "dd/MM/yyyy"
                      )}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">{`(*)`}</span>
                  <p className="text-sm font-light italic text-wrap">
                    Lưu ý: {promotionDetail.description}
                  </p>
                </div>
              </div>
            </div>
            <h1 className="text-base sm:text-2xl  mt-6 tracking-widest font-light text-heading">
              Các sản phẩm được áp dụng trong chương trình
            </h1>
            <div className="grid grid-cols-6 gap-1">
              {promotionDetail.products.map((pro) => (
                <div className="col-span-2 sm:col-span-2 my-2">
                  <ShopProductCard product={pro} key={pro.sku} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ListCardSekelecton />
        )}
      </div>
    </MainLayout>
  );
}

export default page;
