import { IComment } from "@/interfaces/comment.interface";
import { getCommentOfProduct } from "@/services/product.service";
import React, { useEffect, useState } from "react";

function ProductReviewCard({ reviewId }: { reviewId: string }) {
  const [review, setReview] = useState<IComment | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  const fetchReviewData = async () => {
    try {
      const data = await getCommentOfProduct(reviewId);
      setReview(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Ngừng loading sau khi dữ liệu đã được tải
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, [reviewId]);

  if (isLoading) {
    return <div className="text-center p-4">Loading review...</div>; // Chỉ hiển thị loading khi isLoading = true
  }

  if (!review) {
    return <div className="text-center p-4">No review found.</div>; // Trường hợp không có review
  }

  // Render cảm xúc tương ứng với điểm rating
  const renderEmotion = (rating: number) => {
    // Mảng biểu tượng cảm xúc từ 1 đến 5 sao
    const emotions = ["😡", "😟", "😊", "😘", "😍"];

    // Chọn biểu tượng cảm xúc phù hợp với điểm rating
    return (
      <span className="text-2xl">
        {emotions[rating - 1] || emotions[0]}{" "}
        {/* Đảm bảo không vượt ngoài mảng */}
      </span>
    );
  };

  return (
    <div className=" rounded-lg p-4 my-1 w-full border border-primary-border bg-card-bg ">
      <div className="flex items-start">
        {/* Avatar và thông tin người dùng */}
        <div className="flex-shrink-0">
          <img
            loading="lazy"
            className="w-16 h-16 rounded-full object-cover"
            src={
              review.user_avatar && review.user_avatar.trim() !== ""
                ? review.user_avatar
                : "/default-avatar.png"
            }
            alt={`${review.user_name}'s avatar`}
          />
        </div>

        <div className="ml-4 flex-1">
          {/* Tên và ngày */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold text-light-primary-text dark:text-dark-primary-text ">
                {review.user_name}
              </h4>
              <p className="text-sm  text-light-primary-text dark:text-dark-primary-text ">
                {review.date
                  ? new Date(review.date).toLocaleString()
                  : "No date available"}
              </p>
            </div>

            {/* Đánh giá sao */}
            <div className="flex items-center">
              <div>{renderEmotion(review.rating)}</div>
              {/* <span className="ml-2  text-light-primary-text dark:text-dark-primary-text ">
                {review.rating}/5w
              </span> */}
            </div>
          </div>

          {/* Nội dung review */}
          <p className="mt-4 text-light-primary-text dark:text-dark-primary-text ">
            {review.content}
          </p>

          {/* Hình ảnh review nếu có */}
          {review.review_img && review.review_img.length > 0 && (
            <div className="mt-4 grid grid-cols-10 items-center gap-1">
              {review.review_img.map((img, index) => (
                <img
                  loading="lazy"
                  key={index}
                  src={img}
                  alt={`Review image ${index}`}
                  className="col-span-2 sm:col-span-1  w-full object-cover rounded-lg h-full "
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductReviewCard;
