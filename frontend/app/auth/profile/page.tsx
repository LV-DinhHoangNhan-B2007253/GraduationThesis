"use client";
import MainLayout from "@/layouts/MainLayout";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultImage from "@/public/default-avatar.png";
import { Select, SelectItem, Tooltip, user } from "@nextui-org/react";
import { ListRegion } from "@/constants";
import { IUserUpdateInfo } from "@/interfaces/auth.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { UpdateUserInfo } from "@/services/user.service";
import { GetNSetUserInfo, setNullInfo } from "@/redux/slices/userInfoSlice";
import { removeLog } from "@/redux/slices/isLoginStateSlice";
import { useRouter } from "next/navigation";
import { GetDistrict, GetProvince, GetWard } from "@/services/location.service";

function Profile() {
  const { isLogin } = useSelector((state: RootState) => state.userLoginState);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const router = useRouter();

  const [userFormData, setUserFormData] = useState<IUserUpdateInfo>({
    name: userInfo?.name || "",
    phone_number: userInfo?.phone_number || "",
    addresses: {
      detail: userInfo?.addresses?.detail || "",
      district: {
        district_id: userInfo?.addresses?.district?.district_name || "",
        district_name: userInfo?.addresses?.district?.district_name || "",
      },
      province: {
        province_id: userInfo?.addresses?.province?.province_id || "",
        province_name: userInfo?.addresses?.province?.province_name || "",
      },
      ward: {
        ward_id: userInfo?.addresses?.ward?.ward_id || "",
        ward_name: userInfo?.addresses?.ward?.ward_name || "",
      },
    },
  });
  // address

  const [provinces, setProvinces] = useState<any[]>([]); // Giả sử bạn sẽ lấy danh sách tỉnh từ API
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const fetchProvinces = async () => {
    // Gọi API để lấy danh sách tỉnh
    const response = await GetProvince();
    setProvinces(response);
  };

  const fetchDistricts = async (provinceId: string) => {
    // Gọi API để lấy danh sách huyện theo tỉnh
    const data = await GetDistrict(provinceId);
    setDistricts(data);
  };

  const fetchWards = async (districtId: string) => {
    // Gọi API để lấy danh sách xã theo huyện
    const data = await GetWard(districtId);
    setWards(data);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvinceId = e.target.value;
    setUserFormData((prev) => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        province: {
          province_id: selectedProvinceId,
          province_name: e.target.options[e.target.selectedIndex].text,
        },
        district: {
          district_id: "",
          district_name: "",
        },
        ward: {
          ward_id: "",
          ward_name: "",
        },
      },
    }));
    fetchDistricts(selectedProvinceId);
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrictId = e.target.value;
    setUserFormData((prev) => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        district: {
          district_id: selectedDistrictId,
          district_name: e.target.options[e.target.selectedIndex].text,
        },
        ward: {
          ward_id: "",
          ward_name: "",
        },
      },
    }));
    fetchWards(selectedDistrictId);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWardId = e.target.value;
    setUserFormData((prev) => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        ward: {
          ward_id: selectedWardId,
          ward_name: e.target.options[e.target.selectedIndex].text,
        },
      },
    }));
  };

  const handleAddressDetailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const detail = e.target.value;
    setUserFormData((prev) => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        detail: detail,
      },
    }));
  };

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFormData((prevState) => ({
      ...prevState,
      [name]: value,
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

  const handleLogout = async () => {
    // clear token
    localStorage.removeItem("accessToken");
    // dispatch store
    dispatch(setNullInfo());
    // update login state
    dispatch(removeLog());

    router.push("/");
  };

  useEffect(() => {
    fetchProvinces();
  }, []);
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
                      onChange={handleInputOnChange}
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
                      onChange={handleInputOnChange}
                      type="text"
                      id="phone"
                      name="phone_number"
                      defaultValue={userInfo?.phone_number}
                      className={`w-full border-2 ${
                        isEdit
                          ? " border-light-input-border dark:border-dark-input-border"
                          : "border-orange-600"
                      } text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field outline-none py-2 px-4 rounded-md focus:shadow-lg focus:border-light-active dark:focus:border-dark-active`}
                      readOnly={isEdit}
                    />
                  </div>
                  {/* Address Selection */}
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="province"
                      className="block w-fit text-light-primary-text font-light text-small sm:text-base cursor-pointer dark:text-dark-primary-text"
                    >
                      Province
                    </label>
                    <select
                      id="province"
                      className={`w-full border-2 ${
                        isEdit
                          ? " border-light-input-border dark:border-dark-input-border"
                          : "border-orange-600"
                      } text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field outline-none py-2 px-4 rounded-md focus:shadow-lg focus:border-light-active dark:focus:border-dark-active`}
                      value={userFormData.addresses.province.province_id}
                      onChange={handleProvinceChange}
                      disabled={isEdit}
                    >
                      {userFormData.addresses.province.province_id &&
                      userFormData.addresses.province.province_id != "" ? (
                        <option
                          value={userFormData.addresses.province.province_id}
                        >
                          {userFormData.addresses.province.province_name}
                        </option>
                      ) : (
                        <option value="">Select Province</option>
                      )}
                      {provinces?.map((province) => (
                        <option
                          key={province.province_id}
                          value={province.province_id}
                        >
                          {province.province_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="district"
                      className="block w-fit text-light-primary-text font-light text-small sm:text-base cursor-pointer dark:text-dark-primary-text"
                    >
                      District
                    </label>
                    <select
                      id="district"
                      className={`w-full border-2 ${
                        isEdit
                          ? " border-light-input-border dark:border-dark-input-border"
                          : "border-orange-600"
                      } text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field outline-none py-2 px-4 rounded-md focus:shadow-lg focus:border-light-active dark:focus:border-dark-active`}
                      value={userFormData.addresses.district.district_id}
                      onChange={handleDistrictChange}
                      disabled={isEdit || districts.length === 0}
                    >
                      {userFormData.addresses.district.district_id &&
                      userFormData.addresses.district.district_id != "" ? (
                        <option
                          value={userFormData.addresses.district.district_id}
                        >
                          {userFormData.addresses.district.district_name}
                        </option>
                      ) : (
                        <option value="">Select District</option>
                      )}

                      {districts?.map((district) => (
                        <option
                          key={district.district_id}
                          value={district.district_id}
                        >
                          {district.district_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="ward"
                      className="block w-fit text-light-primary-text font-light text-small sm:text-base cursor-pointer dark:text-dark-primary-text"
                    >
                      Ward
                    </label>
                    <select
                      id="ward"
                      className={`w-full border-2 ${
                        isEdit
                          ? " border-light-input-border dark:border-dark-input-border"
                          : "border-orange-600"
                      } text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field outline-none py-2 px-4 rounded-md focus:shadow-lg focus:border-light-active dark:focus:border-dark-active`}
                      value={userFormData.addresses.ward.ward_id}
                      onChange={handleWardChange}
                      disabled={isEdit || wards.length === 0}
                    >
                      {userFormData.addresses.ward.ward_id &&
                      userFormData.addresses.ward.ward_id != "" ? (
                        <option value={userFormData.addresses.ward.ward_id}>
                          {userFormData.addresses.ward.ward_name}
                        </option>
                      ) : (
                        <option value="">Select Ward</option>
                      )}
                      {wards?.map((ward) => (
                        <option key={ward.ward_id} value={ward.ward_id}>
                          {ward.ward_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="detail"
                      className="block w-fit text-light-primary-text font-light text-small sm:text-base cursor-pointer dark:text-dark-primary-text"
                    >
                      Address Detail
                    </label>
                    <input
                      type="text"
                      id="detail"
                      name="detail"
                      defaultValue={userFormData.addresses.detail}
                      onChange={handleAddressDetailChange}
                      className={`w-full border-2 ${
                        isEdit
                          ? " border-light-input-border dark:border-dark-input-border"
                          : "border-orange-600"
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
                <div>
                  {userInfo?.role === "owner" ? (
                    <button
                      onClick={() => {
                        router.push("/shop/dashboard");
                      }}
                      className="underline hover:text-orange-500"
                    >
                      My Shop
                    </button>
                  ) : userInfo?.role === "admin" ? (
                    <button
                      onClick={() => {
                        router.push("/admin");
                      }}
                      className="underline hover:text-orange-500"
                    >
                      Supper Admin Page
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        router.push("/shop/create");
                      }}
                      className="underline hover:text-orange-500"
                    >
                      Start Business
                    </button>
                  )}
                  <button
                    className="float-right p-2 hover:text-orange-500"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} size="1x" />
                  </button>
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
