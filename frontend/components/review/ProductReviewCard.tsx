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
    return <div>Loading review...</div>; // Chỉ hiển thị loading khi isLoading = true
  }

  if (!review) {
    return <div>No review found.</div>; // Trường hợp không có review
  }

  // Render số sao tương ứng với điểm rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={index < rating ? "currentColor" : "none"}
        stroke="currentColor"
        className={`h-5 w-5 ${
          index < rating ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 17.27l4.15 2.18-1.04-4.56 3.49-3.03-4.62-.4L12 6.42l-1.98 4.84-4.62.4 3.49 3.03-1.04 4.56z"
        />
      </svg>
    ));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 my-4 max-w-xl mx-auto">
      <div className="flex items-start">
        {/* Avatar và thông tin người dùng */}
        <div className="flex-shrink-0">
          <img
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
              <h4 className="text-lg font-semibold">{review.user_name}</h4>
              <p className="text-sm text-gray-500">
                {review.date
                  ? new Date(review.date).toLocaleString()
                  : "No date available"}
              </p>
            </div>

            {/* Đánh giá sao */}
            <div className="flex items-center">
              {renderStars(review.rating)}
              <span className="ml-2 text-gray-600">{review.rating}/5</span>
            </div>
          </div>

          {/* Nội dung review */}
          <p className="mt-4 text-gray-700">{review.content}</p>

          {/* Hình ảnh review nếu có */}
          {review.review_img && review.review_img.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {review.review_img.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Review image ${index}`}
                  className="w-full h-24 object-cover rounded-lg"
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
