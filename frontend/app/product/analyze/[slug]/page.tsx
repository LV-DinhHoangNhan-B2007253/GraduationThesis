"use client";

import ClassifyComment from "@/components/shop/ClassifyComment";
import SpinnerLoader from "@/components/Spinner";
import Spinner from "@/components/Spinner";
import { IComment } from "@/interfaces/comment.interface";
import { IAnalyzeProduct, IProduct } from "@/interfaces/product.interface";
import {
  getAnalyzeProductData,
  getCommentOfProduct,
  GetOneProduct,
} from "@/services/product.service";
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
import { format } from "date-fns";
import PieComment from "@/components/chart/PieComment";
import BarComent from "@/components/chart/BarComent";
function AnalyzeProduct(props: any) {
  const productId = props.params.slug;
  const router = useRouter();

  const [product, setProduct] = useState<IProduct | null>(null); // Khởi tạo state với null
  const [comments, setComments] = useState<IComment[] | null>(null);

  const fetchAnalyzeProductInfo = async () => {
    try {
      const data = await GetOneProduct(productId);
      console.log("Fetched product data:", data); // Kiểm tra dữ liệu
      if (data) {
        setProduct(data);

        if (data.comments && data.comments.length > 0) {
          const commentsData = await Promise.all(
            data.comments.map((commentId: string) =>
              getCommentOfProduct(commentId)
            )
          );
          setComments(commentsData);
        }
      }
    } catch (error) {
      toast.error(`Error fetching product data: ${error}`);
    }
  };

  const getLabelColor = (label: number) => {
    switch (label) {
      case 1:
        return "text-red-500";
      case 2:
        return "text-orange-500"; // Bad
      case 3:
        return "text-yellow-500"; // Neutral
      case 4:
        return "text-green-500";
      case 5:
        return "text-blue-500"; // Good
      default:
        return "text-black"; // Mặc định
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
          <div className="grid grid-cols-2 gap-4 h-[130px] my-8">
            <div
              className="col-span-1 flex items-center justify-center bg-blue-100 text-blue-800 font-semibold rounded-lg shadow"
              data-aos="fade-left"
            >
              <FontAwesomeIcon icon={faTags} className="h-6 w-6 mr-2" />
              Đã Bán
              <span className="ml-2 font-bold text-2xl">
                {product.sold_quantity}
              </span>
            </div>
            <div
              className="col-span-1  flex items-center justify-center bg-red-100 text-red-800 font-semibold rounded-lg shadow"
              data-aos="fade-right"
            >
              <FontAwesomeIcon icon={faDatabase} className="h-6 w-6 mr-2" />
              Số Lượng Trong Kho
              <span className="ml-2 font-bold text-2xl">
                {product.stock_quantity}
              </span>
            </div>
          </div>
          {comments && (
            // thong ke comments
            <section>
              <h1 className="text-center text-heading uppercase font-bold tracking-wider my-3 text-2xl">
                Thống kê đánh giá
              </h1>
              <div className="grid grid-cols-2 mb-10 ">
                <div className="col-span-1  h-[600px] ">
                  <PieComment comments={comments} />
                </div>
                <div className="col-span-1 border-l border-primary-border px-2">
                  <BarComent
                    reviewCount={comments.length}
                    sold={product.sold_quantity}
                  />
                  <div>
                    <h2 className="text-center text-heading uppercase font-bold tracking-wider my-3 text-xl">
                      Số lượng đánh giá theo loại
                    </h2>
                    <div>
                      <div className="text-label font-body items-center flex justify-center gap-10 ">
                        <p className="w-[200px] capitalize text-label ">
                          {" "}
                          Tổng số lượt đánh giá:
                        </p>{" "}
                        <span>{comments.length}</span>
                      </div>
                      <div className="text-label font-body items-center flex justify-center gap-10 ">
                        <p className="w-[200px] capitalize text-label ">
                          Rất không hài lòng:{" "}
                        </p>
                        <span>
                          {comments.filter((c) => c.rating === 1).length}
                        </span>
                      </div>
                      <div className="text-label font-body items-center flex justify-center gap-10 ">
                        <p className="w-[200px] capitalize text-label ">
                          không hài lòng:{" "}
                        </p>
                        <span>
                          {comments.filter((c) => c.rating === 2).length}
                        </span>
                      </div>
                      <div className="text-label font-body items-center flex justify-center gap-10 ">
                        <p className="w-[200px] capitalize text-label ">
                          bình thường:{" "}
                        </p>
                        <span>
                          {comments.filter((c) => c.rating === 3).length}
                        </span>
                      </div>
                      <div className="text-label font-body items-center flex justify-center gap-10 ">
                        <p className="w-[200px] capitalize text-label ">
                          Khá hài lòng:
                        </p>
                        <span>
                          {comments.filter((c) => c.rating === 4).length}
                        </span>
                      </div>
                      <div className="text-label font-body items-center flex justify-center gap-10 ">
                        <p className="w-[200px] capitalize text-label ">
                          Rất hài lòng:
                        </p>
                        <span>
                          {comments.filter((c) => c.rating === 5).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-blue-100 py-2 block px-3">
                  <tr className="grid grid-cols-4">
                    <th className="col-span-1 text-left font-bold text-label uppercase">
                      Khách hàng
                    </th>
                    <th className="col-span-1 text-left font-bold text-label uppercase">
                      Nội dung
                    </th>
                    <th className="col-span-1 text-left font-bold text-label uppercase">
                      Thời gian đánh giá
                    </th>
                    <th className="col-span-1 text-left font-bold text-label uppercase">
                      Phân loại
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card-bg">
                  {comments.map((comment: IComment, index) => (
                    <tr
                      key={index}
                      className="grid grid-cols-4  px-2 py-6 border-b border-primary-border items-center
"
                    >
                      <td className="   col-span-1 flex gap-2 items-center">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={
                            comment.user_avatar &&
                            comment.user_avatar.trim() !== ""
                              ? comment.user_avatar
                              : "/default-avatar.png"
                          }
                          alt="Customer Avatar"
                        />
                        <p className="text-small">{comment.user_name}</p>
                      </td>
                      <td className="   col-span-1 text-wrap">
                        {comment.content}
                      </td>
                      <td className="   col-span-1 font-light italic text-small">
                        {format(new Date(comment.date), "dd/MM/yyyy")}
                      </td>
                      <td
                        className={`   col-span-1 font-bold ${getLabelColor(
                          comment.rating
                        )}`}
                      >
                        {comment.rating === 1
                          ? "Rất không hài lòng"
                          : comment.rating === 2
                          ? "Không hài lòng"
                          : comment.rating === 3
                          ? "Bình thường"
                          : comment.rating === 4
                          ? "Hài lòng"
                          : "Rất hài lòng"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </>
      ) : (
        <SpinnerLoader />
      )}
    </div>
  );
}

export default AnalyzeProduct;
