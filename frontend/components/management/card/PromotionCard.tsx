import { IPromotion } from "@/interfaces/promotion.interface";
import { deletePromotion, UpdatePromotion } from "@/services/promotion.service";
import React, { useState } from "react";
import { toast } from "react-toastify";

function PromotionCard({ promo }: { promo: IPromotion }) {
  // State để quản lý dữ liệu khi chỉnh sửa
  const [editPromo, setEditPromo] = useState<IPromotion>({
    ...promo,
    promotion_banner: promo.promotion_banner,
  });

  // Hàm để cập nhật thông tin từ input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditPromo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm để cập nhật file ảnh banner
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setEditPromo((prev) => ({
        ...prev,
        promotion_banner: file,
      }));
    }
  };

  // Hàm submit form (khi cần thiết)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await UpdatePromotion(editPromo, promo._id);
      if (data) {
        toast.success(`${data.message}`);
      }
    } catch (error) {}
  };

  const handleDeletePromotion = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this promotion?"
    );
    if (confirmDelete) {
      try {
        const response = await deletePromotion(promo._id);
        if (response) {
          toast.success(`${response.message}`);
        }
      } catch (error) {
        console.error("Error deleting promotion:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-light-modal-popup dark:bg-dark-modal-popup p-2"
    >
      <div className="flex">
        <div>
          {/* Hiển thị banner và cho phép thay đổi */}
          <img
            src={
              typeof editPromo.promotion_banner === "string"
                ? editPromo.promotion_banner
                : URL.createObjectURL(editPromo.promotion_banner)
            }
            alt="Promotion banner"
            className="w-full h-[300px] object-cover rounded-t-md"
          />
          <input
            type="file"
            name="promotion_banner"
            onChange={handleFileChange}
            className="my-2"
          />
        </div>

        <div className="grid grid-cols-2 flex-1 grid-rows-3 overflow-y-auto">
          {/* Chỉnh sửa thông tin title */}
          <div className="flex flex-col gap-2 px-2 col-span-1  row-span-1">
            <label htmlFor="title" className="font-bold">
              Title:
            </label>
            <input
              type="text"
              name="title"
              value={editPromo.title}
              onChange={handleChange}
              className="border p-2 rounded w-full h-full"
              required
            />
          </div>

          {/* Chỉnh sửa thông tin description */}
          <div className="flex flex-col gap-2 px-2 col-span-1  row-span-1">
            <label htmlFor="description" className="font-bold">
              Description:
            </label>
            <textarea
              name="description"
              value={editPromo.description}
              onChange={handleChange}
              className="border p-2 rounded w-full h-full "
              required
            />
          </div>

          {/* Chỉnh sửa ngày bắt đầu */}
          <div className="flex flex-col gap-2 px-2 col-span-1  row-span-1">
            <label htmlFor="startDate" className="font-bold">
              Start Date:
            </label>
            <input
              type="text"
              name="startDate"
              value={editPromo.startDate.split("-").reverse().join("/")} // Giá trị ngày là dạng chuỗi
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Chỉnh sửa ngày kết thúc */}
          <div className="flex flex-col gap-2 px-2 col-span-1  row-span-1">
            <label htmlFor="endDate" className="font-bold">
              End Date:
            </label>
            <input
              type="text"
              name="endDate"
              value={editPromo.endDate.split("-").reverse().join("/")} // Giá trị ngày là dạng chuỗi
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          {/* Chỉnh sửa discountType */}
          <div className="flex flex-col gap-2 px-2 col-span-1  row-span-1">
            <label htmlFor="discountType" className="font-bold">
              Discount Type:
            </label>

            <select
              name="discountType"
              value={editPromo.discountType}
              onChange={handleChange}
              className="border p-2 rounded mt-4 w-full"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 px-2 col-span-1  row-span-1">
            <div className="flex justify-end px-2 mt-4 items-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button" // Thay vì type="submit" để không gửi form
                onClick={handleDeletePromotion} // Gọi hàm xóa
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
              >
                Delete Promotion
              </button>
            </div>
          </div>
          {/* Nút submit */}
        </div>
      </div>
    </form>
  );
}

export default PromotionCard;