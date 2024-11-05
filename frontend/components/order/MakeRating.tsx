"use client";

import { ICreateReview } from "@/interfaces/comment.interface";
import { IOrder } from "@/interfaces/order.interface";
import { IProduct } from "@/interfaces/product.interface";
import { GetOneProduct } from "@/services/product.service";
import { CreateProductRating } from "@/services/rating.service";
import { faAirbnb } from "@fortawesome/free-brands-svg-icons";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

function MakeRating({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const [reviewedProduct, setReviewedProduct] = useState<IProduct | undefined>(
    undefined
  );

  const [content, setContent] = useState<string>("");

  const [reviewImg, setReviewImg] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isCheckConfirm, setIsCheckConfirm] = useState<boolean>(true);

  // Hàm để xử lý chọn file ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setReviewImg(fileArray);
      const previewArray = fileArray.map((file) => URL.createObjectURL(file)); // Tạo URL tạm thời cho mỗi file
      setPreviewImages(previewArray); // Cập nhật state với URL để hiển thị preview
    } else {
      console.log("No files selected"); // Để kiểm tra nếu không có file nào được chọn
    }
  };

  // Hàm để xóa ảnh đã chọn
  const clearImages = () => {
    setReviewImg([]);
    setPreviewImages([]);
  };

  const handleCreateReview = async () => {
    try {
      const newForm = new FormData();
      newForm.append("user_id", userId);
      newForm.append("product_id", productId);
      newForm.append("content", content);
      // newForm.append("rating", rating.toString());
      reviewImg.forEach((img) => newForm.append("review_img", img));

      console.log(newForm);

      await CreateProductRating(newForm);
      setIsCheckConfirm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductInfo = async () => {
    try {
      const data = await GetOneProduct(productId);
      setReviewedProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductInfo();
  }, []);

  useEffect(() => {
    console.log("Updated previewImages:", previewImages);
    // return () => {
    //   previewImages.forEach((img) => URL.revokeObjectURL(img));
    // };
  }, [previewImages]);
  return (
    <div>
      {reviewedProduct ? (
        <div className="px-4">
          {/* product info */}
          <div className="flex justify-start gap-4  my-2">
            <img
              src={reviewedProduct.images[0]}
              alt="Product image"
              width={100}
              height={100}
              className="object-cover"
            />
            <p>{reviewedProduct.name}</p>
          </div>
          {/* coment */}
          <div>
            <div>
              <label htmlFor="content">
                What do you think about our products?
              </label>
              <textarea
                name="content"
                id="content"
                required
                placeholder="Write your thoughts here..."
                cols={10}
                className="w-full p-4 border-gray-200 dark:border-gray-800 border rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text"
                value={content}
                onChange={(e) => setContent(e.target.value)} // Cập nhật state
              ></textarea>
            </div>
          </div>
          {/* Image Upload and Preview */}
          <div>
            {previewImages.length > 0 ? (
              <div>
                <div className="flex gap-4 overflow-x-auto my-2 flex-wrap">
                  {previewImages.map((img, index) => (
                    <div key={index} className="w-32 h-32 relative">
                      <img
                        src={img}
                        alt={`Selected-${index}`}
                        className="w-full h-full object-cover rounded-lg border-light-card-border dark:border-dark-card-border shadow"
                      />
                      <button
                        onClick={() => {
                          // Xóa ảnh tại chỉ số tương ứng
                          const updatedPreviewImages = previewImages.filter(
                            (_, i) => i !== index
                          );
                          const updatedReviewImg = reviewImg.filter(
                            (_, i) => i !== index
                          );
                          setPreviewImages(updatedPreviewImages);
                          setReviewImg(updatedReviewImg);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white  p-1"
                      >
                        &times; {/* Biểu tượng xóa */}
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={clearImages}
                  className="mt-4 bg-light-btn-bg dark:bg-dark-bg-btn text-light-btn-text dark:text-dark-btn-text p-2 rounded text-center"
                >
                  Clear all
                </button>
              </div>
            ) : (
              <div>
                <div className="flex-1">
                  <label
                    htmlFor="fileInput"
                    className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer my-2 relative"
                  >
                    <span className="text-gray-500">
                      Click to upload images
                    </span>
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="opacity-0 absolute top-0 bottom-0 left-0 right-0"
                    />
                  </label>
                </div>
              </div>
            )}
            <div>
              {isCheckConfirm ? (
                <button
                  className="p-3 rounded-lg text-center bg-gray-500 text-white font-bold duration-200 transition-all uppercase text-small sm:text-sm "
                  onClick={handleCreateReview}
                >
                  <FontAwesomeIcon icon={faAirbnb} />
                </button>
              ) : (
                <button
                  disabled={!isCheckConfirm}
                  className="p-3 rounded-lg text-center bg-green-700  text-white font-bold duration-200 transition-all uppercase text-small sm:text-sm  "
                  onClick={() => setIsCheckConfirm(false)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}

export default MakeRating;
