import { CreateNewCategory } from "@/services/category.service";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
interface ICategoryForm {
  name: string;
  banner: File | null;
  preview: string | null;
}

function CreateCategoryForm({
  onClose,
  shopCreatorId,
}: {
  onClose: () => void;
  shopCreatorId: string;
}) {
  const [formData, setFormData] = useState<ICategoryForm>({
    name: "",
    banner: null,
    preview: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      banner: file,
      preview: file ? URL.createObjectURL(file) : null,
    }));
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      banner: null,
      preview: null,
    });
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      submissionData.append("name", formData.name);
      if (formData.banner) submissionData.append("banner", formData.banner);
      submissionData.append("shop_creator_id", shopCreatorId);
      // submit
      const data = await CreateNewCategory(submissionData);
      if (data) {
        console.log(data);
        toast.success(`${data.message}`);
      }

      handleClearForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full p-4  rounded-md shadow-lg bg-card-bg">
      <h2 className="text-xl font-semibold mb-4 text-center text-heading uppercase">
        Tạo danh mục mới
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Nhập tên */}
        <div className="mb-4">
          <label className="text-label block  text-sm font-bold mb-2">
            Tên danh mục
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border bg-input text-input-text border-primary-border rounded outline-none"
            required
          />
        </div>

        {/* Chọn hình ảnh banner */}
        <div className="mb-4">
          <label className="text-label block  text-sm font-bold mb-2">
            Thêm hình ảnh
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handleBannerChange}
            className="w-full"
          />
          {formData.preview && (
            <div className="mt-2">
              <img
                src={formData.preview}
                alt="Banner preview"
                className="h-72 w-full object-cover rounded-md mb-2"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    banner: null,
                    preview: null,
                  }))
                }
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Chọn lại ảnh
              </button>
            </div>
          )}
        </div>

        {/* Nút Submit và Close */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleClearForm}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Tạo{" "}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCategoryForm;
