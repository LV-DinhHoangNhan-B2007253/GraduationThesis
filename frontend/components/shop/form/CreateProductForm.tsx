"use client";

import { ICategory } from "@/interfaces/category.interface";
import { ICreateProduct } from "@/interfaces/product.interface";
import { GetCategoryAndProductByShopId } from "@/services/category.service";
import { CreateNewProduct } from "@/services/product.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
function CreateProductForm({
  shop_id,
  closeForm,
}: {
  shop_id: string;
  closeForm: () => void;
}) {
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<ICategory[]>();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isResetForm, setIsResetForm] = useState<boolean>(false);

  const [formData, setFormData] = useState<ICreateProduct>({
    name: "",
    images: [],
    description: "",
    sku: "",
    price: 0,
    stock_quantity: 0,
    shop_owner_id: "",
    type: "",
  });

  const fetchShopCategories = async () => {
    try {
      const response = await GetCategoryAndProductByShopId(shop_id);
      if (response) {
        setCategories(response.categories);
      }
      console.log(categories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData({ ...formData, images: fileArray });

      // Tạo URL xem trước cho từng file ảnh
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(previewArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = new FormData();

    productData.append("name", formData.name);
    productData.append("sku", formData.sku);
    productData.append("price", formData.price.toString());
    productData.append("description", formData.description);
    productData.append("stock_quantity", formData.stock_quantity.toString());
    productData.append("shop_owner_id", formData.shop_owner_id);
    productData.append("type", formData.type);

    // if (userInfo?.shop_owner_id) {
    //   console.log("Appended shop_owner_id:", userInfo.shop_owner_id);
    // } else {
    //   console.error("shop_owner_id is missing.");
    // }

    // Append multiple images
    formData.images.forEach((image) => {
      productData.append("images", image);
    });

    // productData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });
    // console.log("category Id", categoryId);

    try {
      const res = await CreateNewProduct(categoryId, productData);
      if (res && res.message) {
        toast.success(`${res.message}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  // Hàm reset form
  const resetForm = () => {
    setFormData({
      name: "",
      images: [],
      description: "",
      sku: "",
      price: 0,
      stock_quantity: 0,
      shop_owner_id: "",
      type: "",
    });
    setCategoryId(""); // Reset category selection
    setPreviewUrls([]); // Clear image previews
    setIsResetForm(!isResetForm);
  };

  // Hàm gọi khi nhấn nút Close
  const handleClose = () => {
    resetForm(); // Reset form trước
    console.log(formData);

    closeForm(); // Sau đó đóng form
  };

  useEffect(() => {
    fetchShopCategories();
    setFormData((prevFormData) => ({
      ...prevFormData,
      shop_owner_id: shop_id, // Cập nhật shop_owner_id
    }));
  }, [shop_id, isResetForm]);

  return (
    <section>
      <button
        onClick={handleClose}
        className="text-red-500 py-4 text-right w-full"
      >
        Hủy
      </button>
      <form
        className="grid grid-cols-2 items-center gap-3"
        onSubmit={handleSubmit}
      >
        {/* create product form */}
        <div className="col-span-2 grid grid-cols-2 sm:gap-4 gap-2">
          {/* name */}
          <div className="col-span-1">
            <label htmlFor="productName" className="block text-label">
              Tên sản phẩm
              <span className="text-red-500">(*)</span>{" "}
            </label>
            <input
              type="text"
              name="name"
              id="productName"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md  px-4  outline-none bg-input text-input-text mt-1"
            />
          </div>
          {/* sku */}
          <div className="col-span-1">
            <label htmlFor="productSku" className="block text-label">
              Mã sản phẩm
              <span className="text-red-500">(*)</span>
              {"  "}
            </label>
            <input
              type="text"
              name="sku"
              id="productSku"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md  px-4  outline-none bg-input text-input-text mt-1"
            />
          </div>
          {/* quantity */}
          <div className="col-span-1">
            <label htmlFor="productQuantity" className="block text-label">
              Số lượng
              <span className="text-red-500">(*)</span>{" "}
            </label>
            <input
              type="number"
              min={1}
              name="stock_quantity"
              id="productQuantity"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md  px-4  outline-none bg-input text-input-text mt-1"
            />
          </div>
          {/* price */}
          <div className="col-span-1">
            <label htmlFor="productPrice" className="block text-label">
              Đơn giá
              <span className="text-red-500">(*)</span>{" "}
            </label>
            <input
              type="text"
              name="price"
              id="productPrice"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md  px-4  outline-none bg-input text-input-text mt-1"
            />
          </div>
          {/* type */}
          <div className="col-span-1">
            <label htmlFor="productPrice" className="block text-label">
              Loại
              <span className="text-red-500">(*)</span>{" "}
            </label>
            <input
              type="text"
              name="type"
              id="productType"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md  px-4  outline-none bg-input text-input-text mt-1"
            />
          </div>
          {/* category */}
          <div className="col-span-1">
            <label
              htmlFor="category"
              className=" p-2  cursor-pointer text-label"
            >
              Chọn danh mục<span className="text-red-500">(*)</span>
            </label>
            {categories && categories.length > 0 ? (
              <select
                name="category"
                id="category"
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border  py-2 rounded-md  px-4  outline-none bg-input text-input-text mt-1"
              >
                {categories.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : (
              <p>Vui lòng chọn 1 danh mục</p>
            )}
          </div>
          {/* desc */}
          <div className="col-span-2">
            <label htmlFor="productDesc" className="block text-label">
              Mô tả sản ph ẩm
              <span className="text-red-500">(*)</span>{" "}
            </label>
            <textarea
              name="description"
              id="productDesc"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md  px-4  outline-none bg-input text-input-text mt-1"
            />
          </div>
          {/* imgs */}
          <div className="grid grid-cols-2 col-span-2 gap-2">
            <div className="col-span-2 ">
              <label htmlFor="productImages" className="block text-label">
                Thêm hình ản h<span className="text-red-500">(*)</span>{" "}
              </label>
              <input
                name="images"
                type="file"
                accept="image/*"
                id="productImages"
                required
                multiple
                onChange={handleFileChange}
                className="w-full border  py-2 rounded-md  px-4  outline-none bg-input text-input-text mt-1"
              />
            </div>
            <div className="max-h-[300px] w-full col-span-2 flex items-center justify-start gap-2 ">
              {previewUrls.map((img, index) => (
                <div key={index}>
                  <img
                    loading="lazy"
                    src={img}
                    alt={`${img.toString()}`}
                    className="w-[40px] h-[40px] object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          className="col-span-2   w-full p-2 rounded-md transition-all bg-button-primary hover:bg-button-success"
          type="submit"
        >
          Tạo
        </button>
      </form>
    </section>
  );
}

export default CreateProductForm;
