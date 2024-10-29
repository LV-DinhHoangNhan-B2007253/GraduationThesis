"use client";

import ClassifyComment from "@/components/shop/ClassifyComment";
import SpinnerLoader from "@/components/Spinner";
import Spinner from "@/components/Spinner";
import { IAnalyzeProduct } from "@/interfaces/product.interface";
import { getAnalyzeProductData } from "@/services/product.service";
import {
  faArrowLeft,
  faComment,
  faDatabase,
  faEye,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AnalyzeProduct(props: any) {
  const productId = props.params.slug;
  const router = useRouter();

  const [product, setProduct] = useState<IAnalyzeProduct | null>(null); // Khởi tạo state với null

  const fetchAnalyzeProductInfo = async () => {
    try {
      const data = await getAnalyzeProductData(productId);
      console.log("Fetched product data:", data); // Kiểm tra dữ liệu
      setProduct(data);
    } catch (error) {
      toast.error(`Error fetching product data: ${error}`);
    }
  };

  useEffect(() => {
    fetchAnalyzeProductInfo();
  }, [productId]);

  return (
    <div className="w-full  min-h-screen p-5 ">
      {product ? (
        <>
          <button onClick={() => router.back()}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="font-light text-2xl px-2 my-3"
            />
          </button>
          {/* head */}
          <div className=" flex items-center gap-3 py-2 border-b ">
            <h1 className="text-base sm:text-3xl font-bold text-light-primary-text dark:text-dark-primary-text">
              {product.name}
            </h1>
            <span> - </span>
            <p className="text-small sm:text-base font-light font-mono tracking-wider">
              {product.sku}
            </p>
          </div>

          {/* thong ke */}
          <div className="grid grid-cols-4 gap-4 h-[100px] my-8">
            <div
              className="col-span-1 flex items-center justify-center bg-blue-100 text-blue-800 font-semibold rounded-lg p-4 shadow"
              data-aos="fade-left"
            >
              <FontAwesomeIcon icon={faTags} className="h-6 w-6 mr-2" />
              Sold Quantity
              <span className="ml-2 font-bold text-2xl">
                {product.sold_quantity}
              </span>
            </div>

            <div
              className="col-span-1 flex items-center justify-center bg-green-100 text-green-800 font-semibold rounded-lg p-4 shadow"
              data-aos="fade-down"
            >
              <FontAwesomeIcon icon={faEye} className="h-6 w-6 mr-2" />
              Total Reviews
              <span className="ml-2 font-bold text-2xl">
                {product.ratingCount}
              </span>
            </div>

            <div
              className="col-span-1 flex items-center justify-center bg-orange-100 text-orange-800 font-semibold rounded-lg p-4 shadow"
              data-aos="fade-up"
            >
              <FontAwesomeIcon icon={faComment} className="h-6 w-6 mr-2" />
              Total Ratings
              <span className="ml-2 font-bold text-2xl">
                {product.ratingCount}
              </span>
            </div>

            <div
              className="col-span-1 flex items-center justify-center bg-red-100 text-red-800 font-semibold rounded-lg p-4 shadow"
              data-aos="fade-right"
            >
              <FontAwesomeIcon icon={faDatabase} className="h-6 w-6 mr-2" />
              In Stock
              <span className="ml-2 font-bold text-2xl">{product.instock}</span>
            </div>
          </div>
          {/* lượt bình luận theo số sao */}
          <div className="my-5 py-5  border-b" data-aos="fade-left">
            <h2 className="text-xl font-semibold text-orange-800 dark:text-blue-800 tracking-widest font-serif uppercase">
              Rating Distribution:
            </h2>
            <ul className="mt-2 ">
              {Object.entries(product.ratingDistribution).map(
                ([stars, count]) => (
                  <li
                    key={stars}
                    className="grid grid-cols-6 items-center justify-center"
                  >
                    <div className="flex items-center col-span-1 col-start-3">
                      {/* Hiển thị số sao bằng biểu tượng ngôi sao */}
                      {[...Array(parseInt(stars))].map((_, index) => (
                        <span key={index} className="text-yellow-500 ">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold  col-span-1 col-start-4">
                      {count} reviews
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
          {/* bình luận được phân loại */}
          <div data-aos="fade-up">
            <ClassifyComment comments={product.comments} />
          </div>
        </>
      ) : (
        <SpinnerLoader />
      )}
    </div>
  );
}

export default AnalyzeProduct;
