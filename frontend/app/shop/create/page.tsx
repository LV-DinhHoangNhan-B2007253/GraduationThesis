"use client";

import MainLayout from "@/layouts/MainLayout";
import { GetNSetUserInfo } from "@/redux/slices/userInfoSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { CreateShop } from "@/services/shop.service";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { stat } from "fs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function CreateNewShop() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [createShopForm, setCreateShopForm] = useState<ICreateShopForm>({
    name: "",
    description: "",
    logoUrl: undefined,
    shopBanner: undefined,
    shopLocation: "",
    shopMail: "",
    shopPhone: "",
  });

  const router = useRouter();

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Xử lý khi chọn ảnh
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "banner") {
        setCreateShopForm((prev) => ({ ...prev, shopBanner: file }));
        setBannerPreview(imageUrl); // Cập nhật ảnh preview cho banner
      } else if (type === "logo") {
        setCreateShopForm((prev) => ({ ...prev, logoUrl: file }));
        setLogoPreview(imageUrl); // Cập nhật ảnh preview cho logo
      }
    }
  };

  // Hàm cập nhật state
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateShopForm({
      ...createShopForm,
      [name]: value,
    });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = userInfo?._id as string;

      const formData = new FormData();
      formData.append("name", createShopForm.name);
      formData.append("shopMail", createShopForm.shopMail);
      formData.append("shopPhone", createShopForm.shopPhone);
      formData.append("description", createShopForm.description);
      formData.append("shopLocation", createShopForm.shopLocation);

      if (createShopForm.logoUrl) {
        formData.append("logoUrl", createShopForm.logoUrl); // Use 'files' for multer
      } else {
        console.warn("No logoUrl selected.");
      }

      if (createShopForm.shopBanner) {
        formData.append("shopBanner", createShopForm.shopBanner); // Use 'files' for multer
      } else {
        console.warn("No shopBanner selected.");
      }

      console.log(formData);

      const response = await CreateShop(userId, formData);
      if (response) {
        toast.success(`${response.message}`);
        // Redirect or clear form after success
        dispatch(GetNSetUserInfo()).unwrap();
      }
    } catch (error: any) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <div className="bg-CreateShopBg  min-h-screen flex justify-center items-center">
      <div className=" mx-48   w-full mt-10">
        <div className="bg-light-modal-popup w-full rounded-md  ">
          <div className="px-4 py-2 rounded-md ">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="hover:cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            />
          </div>
          {/* form */}
          <form className="rounded-md" onSubmit={handleSubmitForm}>
            {/* Khung hiển thị banner */}
            <div className="relative w-full h-[400px] hover:brightness-95 duration-200 mb-12">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner"
                  className="w-full h-full object-cover "
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <FontAwesomeIcon icon={faImage} color="white" size="3x" />c
                </div>
              )}
              {/* Input để chọn ảnh banner */}
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleImageChange(e, "banner")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* Khung hiển thị logo */}
              <div className="absolute -bottom-[40] left-[120] transform -translate-x-1/2 w-[150px] h-[150px] rounded-full border border-black">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center rounded-full border border-gray-300">
                    <FontAwesomeIcon icon={faImage} color="white" size="2x" />c
                  </div>
                )}
                {/* Input để chọn ảnh logo */}
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "logo")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 mx-2">
              <div className="col-span-1 mx-2">
                <label
                  htmlFor="name"
                  className="block text-light-primary-text text-small sm:text-base font-light tracking-widest"
                >
                  Brand Name
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  id="name"
                  tabIndex={1}
                  onChange={handleInputChange}
                  className="w-full px-2 py-4 my-2 border-light-input-border text-light-input-text text-sm sm:text-base border rounded-md"
                />
              </div>
              <div className="col-span-1 mx-2">
                <label
                  htmlFor="shopMail"
                  className="block text-light-primary-text text-small sm:text-base font-light tracking-widest"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="shopMail"
                  required
                  tabIndex={2}
                  id="shopMail"
                  onChange={handleInputChange}
                  className="w-full px-2 py-4 my-2 border-light-input-border text-light-input-text text-sm sm:text-base border rounded-md"
                />
              </div>
              <div className="col-span-1 mx-2">
                <label
                  htmlFor="shopPhone"
                  className="block text-light-primary-text text-small sm:text-base font-light tracking-widest"
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="shopPhone"
                  id="shopPhone"
                  required
                  tabIndex={3}
                  onChange={handleInputChange}
                  className="w-full px-2 py-4 my-2 border-light-input-border text-light-input-text text-sm sm:text-base border rounded-md"
                />
              </div>
              <div className="col-span-2 mx-2">
                <label
                  htmlFor="shopLocation"
                  className="block text-light-primary-text text-small sm:text-base font-light tracking-widest"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="shopLocation"
                  id="shopLocation"
                  required
                  tabIndex={4}
                  onChange={handleInputChange}
                  className="w-full px-2 py-4 my-2 border-light-input-border text-light-input-text text-sm sm:text-base border rounded-md"
                />
              </div>
              <div className="col-span-3 mx-2">
                <label
                  htmlFor="shopLocation"
                  className="block text-light-primary-text text-small sm:text-base font-light tracking-widest"
                >
                  Desription
                </label>
                <textarea
                  name="description"
                  required
                  tabIndex={5}
                  id="description"
                  onChange={handleInputChange}
                  className="w-full px-2 py-4 my-2 border-light-input-border text-light-input-text text-sm sm:text-base border rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-center bg-dark-bg-btn text-dark-btn-text py-2 uppercase font-bold mt-20 rounded-b-md"
            >
              create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateNewShop;