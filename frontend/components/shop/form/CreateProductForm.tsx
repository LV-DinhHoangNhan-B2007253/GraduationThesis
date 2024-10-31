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
        Close
      </button>
      <form
        className="grid grid-cols-2 items-center gap-3"
        onSubmit={handleSubmit}
      >
        {/* create product form */}
        <div className="col-span-2 grid grid-cols-2 sm:gap-4 gap-2">
          {/* name */}
          <div className="col-span-1">
            <label htmlFor="productName" className="block">
              Product name
            </label>
            <input
              type="text"
              name="name"
              id="productName"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4 focus:border-light-active dark:focus:border-dark-active outline-none"
            />
          </div>
          {/* sku */}
          <div className="col-span-1">
            <label htmlFor="productSku" className="block">
              Sku
            </label>
            <input
              type="text"
              name="sku"
              id="productSku"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4 focus:border-light-active dark:focus:border-dark-active outline-none"
            />
          </div>
          {/* quantity */}
          <div className="col-span-1">
            <label htmlFor="productQuantity" className="block">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              name="stock_quantity"
              id="productQuantity"
              required
              onChange={handleInputChange}
              className="w-full border text-center font-bold   py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4 focus:border-light-active dark:focus:border-dark-active outline-none"
            />
          </div>
          {/* price */}
          <div className="col-span-1">
            <label htmlFor="productPrice" className="block">
              Price
            </label>
            <input
              type="text"
              name="price"
              id="productPrice"
              required
              onChange={handleInputChange}
              className="w-full border text-right  py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4 focus:border-light-active dark:focus:border-dark-active outline-none"
            />
          </div>
          {/* type */}
          <div className="col-span-1">
            <label htmlFor="productPrice" className="block">
              Type
            </label>
            <input
              type="text"
              name="type"
              id="productType"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4 focus:border-light-active dark:focus:border-dark-active outline-none"
            />
          </div>
          {/* category */}
          <div className="col-span-1">
            <label
              htmlFor="category"
              className="block p-2 text-light-primary-text dark:text-dark-primary-text text-sm sm:text-base cursor-pointer "
            >
              Select Category <span className="text-red-500">(*)</span>
            </label>
            {categories && categories.length > 0 ? (
              <select
                name="category"
                id="category"
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border text-center capitalize py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4"
              >
                {categories.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : (
              <p>Please create a category</p>
            )}
          </div>
          {/* desc */}
          <div className="col-span-2">
            <label htmlFor="productDesc" className="block">
              Description
            </label>
            <textarea
              name="description"
              id="productDesc"
              required
              onChange={handleInputChange}
              className="w-full border  py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4 focus:border-light-active dark:focus:border-dark-active outline-none"
            />
          </div>
          {/* imgs */}
          <div className="grid grid-cols-2 col-span-2 gap-2">
            <div className="col-span-2 ">
              <label htmlFor="productImages" className="block">
                Add Images
              </label>
              <input
                name="images"
                type="file"
                accept="image/*"
                id="productImages"
                required
                multiple
                onChange={handleFileChange}
                className="w-full border  py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4 focus:border-light-active dark:focus:border-dark-active outline-none"
              />
            </div>
            <div className="max-h-[300px] w-full col-span-2 flex items-center justify-start gap-2 ">
              {previewUrls.map((img, index) => (
                <div key={index}>
                  <img
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
          className="col-span-2   w-full bg-light-btn-bg dark:bg-dark-bg-btn text-light-btn-text dark:text-dark-btn-text p-2 rounded-md hover:bg-orange-500 transition-all"
          type="submit"
        >
          Create
        </button>
      </form>
    </section>
  );
}

export default CreateProductForm;
