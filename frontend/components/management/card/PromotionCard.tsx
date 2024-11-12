import { IPromotion } from "@/interfaces/promotion.interface";
import { deletePromotion, UpdatePromotion } from "@/services/promotion.service";
import React, { useState } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-date-picker";

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
  // Hàm để cập nhật ngày
  const handleDateChange = (name: "startDate" | "endDate", date: Date) => {
    const isoDate = date.toISOString(); // Chuyển ngày thành ISO string
    setEditPromo((prev) => ({
      ...prev,
      [name]: isoDate, // Cập nhật giá trị ngày dưới dạng ISO string
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
      console.log(editPromo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePromotion = async () => {
    const confirmDelete = window.confirm(
      "Bạn chắc chắc muốn xóa quảng cáo này chứ?"
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
      className="w-full border border-primary-border h-full p-1 bg-card-bg  shadow rounded-md "
    >
      <div className="flex gap-2">
        <div className="">
          <div className="relative max-h-[200px]">
            {/* Hiển thị banner và cho phép thay đổi */}
            <img
              loading="lazy"
              src={
                typeof editPromo.promotion_banner === "string"
                  ? editPromo.promotion_banner
                  : URL.createObjectURL(editPromo.promotion_banner)
              }
              alt="Promotion banner"
              className="w-[250px] h-[200px]  border border-primary-border object-cover"
            />
            {/* chọn ảnh */}
            <div>
              <input
                type="file"
                name="promotion_banner"
                onChange={handleFileChange}
                className="w-full h-full  absolute top-0 bottom-0 left-0 right-0   hover:cursor-pointer  opacity-0 bg-gray-800 hover:opacity-5"
              />
              <label
                htmlFor="promotion_banner"
                className="text-label capitalize text-sm"
              ></label>
            </div>
          </div>
          <div className="flex justify-around py-2 gap-1">
            <button
              type="submit"
              className="bg-button-success text-white  rounded hover:bg-accent p-1 text-sm w-1/2"
            >
              Lưu thay đổi
            </button>
            <button
              type="button" // Thay vì type="submit" để không gửi form
              onClick={handleDeletePromotion} // Gọi hàm xóa
              className="bg-button-danger text-white rounded hover:bg-accent p-1 text-sm w-1/2"
            >
              Xóa quảng cáo
            </button>
          </div>
        </div>

        <div className=" flex-1">
          {/* Chỉnh sửa thông tin title */}
          <div className="flex gap-1">
            <div className="flex-1">
              <label
                htmlFor="title"
                className="text-label capitalize text-sm font-bold tracking-widest block my-1"
              >
                Tên chiến dịch quảng cáo:
              </label>
              <input
                type="text"
                name="title"
                value={editPromo.title}
                onChange={handleChange}
                className="w-full p-3 outline-none rounded bg-input text-input-text border border-primary-border"
                required
              />
            </div>
            {/* Chỉnh sửa discountType */}
            <div className="">
              <label
                htmlFor="discountType"
                className="text-label capitalize text-sm font-bold tracking-widest block my-1"
              >
                Loại giảm giá:
              </label>

              <select
                name="discountType"
                value={editPromo.discountType}
                onChange={handleChange}
                className="w-full p-3 outline-none rounded bg-input text-input-text border border-primary-border"
              >
                <option value="percentage">Giảm theo phần trăm %</option>
                <option value="fixed">Giảm theo giá cố định</option>
              </select>
            </div>
          </div>

          {/* Chỉnh sửa thông tin description */}
          <div className="">
            <label
              htmlFor="description"
              className="text-label capitalize text-sm font-bold tracking-widest block my-1"
            >
              Mô tả:
            </label>
            <textarea
              name="description"
              value={editPromo.description}
              onChange={handleChange}
              className="w-full p-4 italic outline-none rounded bg-input text-input-text border border-primary-border"
              required
            />
          </div>
          <div className="w-full flex justify-center items-center sm:gap-10">
            {/* Chỉnh sửa ngày bắt đầu */}
            <div className="w-full">
              <label
                htmlFor="startDate"
                className="text-label capitalize text-sm font-bold tracking-widest block my-1"
              >
                Ngày bắt đầu:
              </label>
              <DatePicker
                name="startDate"
                clearIcon
                format="dd/MM/yyyy"
                value={editPromo.startDate} // Giá trị ngày là dạng chuỗi
                onChange={(date) => handleDateChange("startDate", date as Date)}
                required
                className={`w-1/2 h-10 `}
              />
            </div>

            {/* Chỉnh sửa ngày kết thúc */}
            <div className="w-full">
              <label
                htmlFor="endDate"
                className="text-label capitalize text-sm font-bold tracking-widest block my-1"
              >
                Ngày kết thúc:
              </label>
              <DatePicker
                name="endDate"
                clearIcon
                format="dd/MM/yyyy"
                value={editPromo.endDate} // Giá trị ngày là dạng chuỗi
                onChange={(date) => handleDateChange("endDate", date as Date)}
                required
                className={`w-1/2 h-10 `}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PromotionCard;
