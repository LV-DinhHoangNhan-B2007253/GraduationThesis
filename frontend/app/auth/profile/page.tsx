"use client";
import MainLayout from "@/layouts/MainLayout";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultImage from "@/public/default-avatar.png";
import { Select, SelectItem, Tooltip } from "@nextui-org/react";
import { ListRegion } from "@/constants";
import { IUserUpdateInfo } from "@/interfaces/auth.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import ThemeSwitch from "@/components/ThemeSwitch";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { UpdateUserInfo } from "@/services/user.service";
import { GetNSetUserInfo } from "@/redux/slices/userInfoSlice";

function Profile() {
  const { isLogin } = useSelector((state: RootState) => state.userLoginState);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isEdit, setIsEdit] = useState<boolean>(true);

  const [userFormData, setUserFormData] = useState<IUserUpdateInfo>({
    name: userInfo?.name || "",
    phone_number: userInfo?.phone_number || "",
    addresses: {
      region: userInfo?.addresses.region || "",
      addressDetail: userInfo?.addresses.addressDetail || "",
    },
  });

  useEffect(() => {
    console.log("rerender");
  }, [userInfo]);

  const handleInputOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("addresses.")) {
      const addressField = name.split(".")[1];
      setUserFormData((prevState) => ({
        ...prevState,
        addresses: {
          ...prevState.addresses,
          [addressField]: value,
        },
      }));
    } else {
      setUserFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSelectionChange = (selectedKey: any) => {
    const selectedKeyArray = Array.isArray(selectedKey)
      ? selectedKey
      : Array.from(selectedKey);

    const firstSelectedKey = selectedKeyArray[0];

    setUserFormData((prevState) => ({
      ...prevState,
      addresses: {
        ...prevState.addresses,
        region: firstSelectedKey,
      },
    }));
  };

  const handleEditProfile = async () => {
    // nhấn edit -> gửi form edit-> backend cập nhật thông tin
    // -> trả về token, lưu lại vào localstorage -< usEffect reload lại trang -> lấy thông tin mới -> render
    setIsEdit(!isEdit);
  };
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(userFormData);
      const res = await UpdateUserInfo(userFormData);
      if (res && res.message) {
        dispatch(GetNSetUserInfo());
        toast.success("Update Success");
      }
    } catch (error: any) {
      toast("Update failed:", error);
    }
  };

  return (
    <MainLayout>
      {isLogin ? (
        <Suspense fallback={<Spinner />}>
          <div className="flex justify-center">
            <div className=" bg-light-modal-popup dark:bg-dark-modal-popup sm:max-w-[80%] max-w-[95%] w-full rounded-lg">
              <div className="w-full h-8 sm:h-16 bg-gradient-to-r  from-emerald-400 to-cyan-400 rounded-t-lg"></div>
              <div className="px-4 sm:pb-12 pb-4">
                {/* top  prpfile */}
                <div className="flex justify-between items-center py-4">
                  <div className="flex justify-between items-center gap-3">
                    <img
                      src={userInfo?.avatarUrl || DefaultImage.src}
                      alt="Avatar"
                      className="w-[95px] rounded-full shadow-md"
                    />
                    <div>
                      <p className="font-bold my-1">{userInfo?.name}</p>
                      <p className="font-light">{userInfo?.email}</p>
                    </div>
                  </div>
                  <Tooltip content="Press To Edit Information">
                    <button
                      onClick={handleEditProfile}
                      className=" text-xs bg-light-btn-bg dark:bg-dark-bg-btn px-4 py-1 border border-light-card-border dark:border-dark-border text-light-btn-text dark:text-dark-btn-text rounded-lg text-center  hover:bg-light-btn-hover dark:hover:bg-dark-bg-btn-hover"
                    >
                      {isEdit ? "EDIT" : "DONE"}
                    </button>
                  </Tooltip>
                </div>
                {/* form */}
                <form
                  action="#"
                  className="sm:grid grid-cols-2 gap-6 items-end"
                >
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="email"
                      className="block w-fit text-light-primary-text font-light text-small sm:text-base cursor-pointer dark:text-dark-primary-text"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      defaultValue={userInfo?.email}
                      className="w-full border-2 border-light-input-border dark:border-dark-input-border text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field outline-none py-2 px-4 rounded-md focus:shadow-lg focus:border-light-active dark:focus:border-dark-active"
                      readOnly={true}
                    />
                  </div>
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="name"
                      className="block w-fit text-light-primary-text font-light text-small sm:text-base cursor-pointer dark:text-dark-primary-text "
                    >
                      Name
                    </label>
                    <input
                      onChange={handleInputOnchange}
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={userInfo?.name}
                      className={`w-full border-2 ${
                        isEdit
                          ? " border-light-input-border dark:border-dark-input-border"
                          : "border-orange-600"
                      } text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field outline-none py-2 px-4 rounded-md focus:shadow-lg focus:border-light-active dark:focus:border-dark-active`}
                      readOnly={isEdit}
                    />
                  </div>
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="phone"
                      className="block w-fit text-light-primary-text font-light text-small sm:text-base cursor-pointer dark:text-dark-primary-text "
                    >
                      Phone
                    </label>
                    <input
                      onChange={handleInputOnchange}
                      type="text"
                      id="phone"
                      name="phone_number"
                      defaultValue={userInfo?.phone_number}
                      className={`w-full border-2 ${
                        isEdit
                          ? " border-light-input-border dark:border-dark-input-border"
                          : "border-purple-600"
                      } text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field outline-none py-2 px-4 rounded-md focus:shadow-lg focus:border-light-active dark:focus:border-dark-active`}
                      readOnly={isEdit}
                    />
                  </div>
                  <div className="col-span-1 my-2 sm:my-0">
                    <div
                      className={`w-full border-2 ${
                        isEdit
                          ? " border-light-input-border dark:border-dark-input-border"
                          : "border-cyan-600"
                      } text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field outline-none  rounded-md focus:shadow-lg focus:border-light-active dark:focus:border-dark-active`}
                    >
                      <Select
                        aria-label="none"
                        size="md"
                        defaultSelectedKeys={[`${userInfo?.addresses.region}`]}
                        className="w-full text-white"
                        onSelectionChange={(key) => handleSelectionChange(key)}
                      >
                        {ListRegion.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="col-span-2 my-2 sm:my-0">
                    <label
                      htmlFor="detail"
                      className="block w-fit  text-light-primary-text font-light text-small sm:text-base cursor-pointer dark:text-dark-primary-text "
                    >
                      Address Detail
                    </label>
                    <input
                      onChange={handleInputOnchange}
                      type="text"
                      id="detail"
                      name="addresses.addressDetail"
                      defaultValue={userInfo?.addresses.addressDetail}
                      className={`w-full border-2 ${
                        isEdit
                          ? " border-light-input-border dark:border-dark-input-border"
                          : "border-indigo-600"
                      } text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field outline-none py-2 px-4 rounded-md focus:shadow-lg focus:border-light-active dark:focus:border-dark-active`}
                      readOnly={isEdit}
                    />
                  </div>
                  <Tooltip content="Save profile">
                    <button
                      onClick={handleSubmitForm}
                      aria-label="submit"
                      type="submit"
                      className="sm:col-start-2 sm:col-span-1 w-[30%] sm:w-full text-center bg-light-btn-bg dark:bg-dark-bg text-light-btn-text dark:text-dark-btn-text py-2 rounded-md hover:bg-orange-400 transition-all hover:translate-x-3  cursor-pointer"
                    >
                      Save
                    </button>
                  </Tooltip>
                </form>
                <div className="flex justify-start gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-blue-500 p-3 text-xl rounded-full bg-blue-200"
                  />
                  <div>
                    <p className="text-small sm:text-base text-light-primary-text dark:text-dark-primary-text">
                      {userInfo?.email}
                    </p>
                    <p className="text-gray-500 text-xs font-light">
                      1 Month ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      ) : (
        <div>
          <Link href={"/auth/login"}>Login now</Link>
        </div>
      )}
    </MainLayout>
  );
}

export default Profile;
