"use client";

import { IArea } from "@/interfaces/area.interface";
import { ICategory } from "@/interfaces/category.interface";
import { ICreateProduct } from "@/interfaces/product.interface";
import { RootState } from "@/redux/store";
import { GetAllArea } from "@/services/area.service";
import { GetAllCategory, GetCategoryItems } from "@/services/category.service";
import { CreateNewProduct } from "@/services/product.service";
import { image, useSelect } from "@nextui-org/react";
import { Root } from "postcss";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { toast } from "react-toastify";
function CreateProductForm({ shop_id }: { shop_id: string }) {
  let settings = {
    customPaging: function (i: number) {
      return (
        <a>
          <img
            src={`${previewUrls[0 + i]}`}
            className="h-[20px] object-contain w-[20px]"
          />
        </a>
      );
    },
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  const [area, setArea] = useState<IArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<IArea>();
  const [categoryList, setCategoryList] = useState<ICategory[]>();
  const [categoryId, setCategoryId] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<ICreateProduct>({
    name: "",
    images: [],
    description: "",
    sku: "",
    price: 0,
    stock_quantity: 0,
    shop_owner_id: "",
  });

  const handleSelectArea = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedItem = area.find((area) => area._id === selectedId);

    setSelectedArea(selectedItem);

    try {
      const res = await GetCategoryItems(selectedId);
      setCategoryList(res);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const getCategoryItemsData = async () => {
    try {
      const areas = await GetAllArea();
      setArea(areas);
      if (areas.length > 0) {
        setSelectedArea(areas[0]);
        const initialCategoryItems = await GetCategoryItems(areas[0]._id);
        setCategoryList(initialCategoryItems);
        setCategoryId(initialCategoryItems._id);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
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

    // if (userInfo?.shop_owner_id) {
    //   console.log("Appended shop_owner_id:", userInfo.shop_owner_id);
    // } else {
    //   console.error("shop_owner_id is missing.");
    // }

    // Append multiple images
    formData.images.forEach((image) => {
      productData.append("images", image);
    });

    productData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const res = await CreateNewProduct(categoryId, productData);
      if (res && res.message) {
        toast.success(`${res.message}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getCategoryItemsData();
    setFormData((prevFormData) => ({
      ...prevFormData,
      shop_owner_id: shop_id, // Cập nhật shop_owner_id
    }));
  }, [shop_id]);
  console.log(shop_id);
  

  return (
    <section>
      <form
        className="grid grid-cols-2 items-center gap-3"
        onSubmit={handleSubmit}
      >
        <div className="col-span-1">
          <label
            htmlFor="area"
            className="block p-2 text-light-primary-text dark:text-dark-primary-text text-sm sm:text-base cursor-pointer "
          >
            Select Area <span className="text-red-500">(*)</span>
          </label>
          {area.length > 0 && (
            <select
              onChange={handleSelectArea}
              name="area"
              id="area"
              className="w-full border text-center capitalize py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4"
            >
              {area.map((item) => (
                <option value={item._id} key={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="col-span-1">
          <label
            htmlFor="category"
            className="block p-2 text-light-primary-text dark:text-dark-primary-text text-sm sm:text-base cursor-pointer "
          >
            Select Category <span className="text-red-500">(*)</span>
          </label>
          {categoryList && categoryList.length > 0 ? (
            <select
              name="category"
              id="category"
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border text-center capitalize py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4"
            >
              {categoryList.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          ) : (
            <p>Please create a category</p>
          )}
        </div>
        {/* create product form */}
        <div className="col-span-2 grid grid-cols-2 sm:gap-4 gap-2">
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
          <div className="grid grid-cols-2 col-span-2 gap-2">
            <div className="col-span-2 sm:col-span-1">
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
            <Slider
              {...settings}
              className="max-h-[300px] w-full col-span-2 sm:col-span-1"
            >
              {previewUrls.map((img) => (
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
              ))}
            </Slider>
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
