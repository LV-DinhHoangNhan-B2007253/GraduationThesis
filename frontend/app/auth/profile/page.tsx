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
import SpinnerLoader from "@/components/Spinner";

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
        <Suspense fallback={<SpinnerLoader />}>
          <div className="flex justify-center mt-1">
            <div className="  sm:max-w-[80%] max-w-[95%] w-full rounded-lg">
              <div className="w-full h-8 sm:h-16 bg-gradient-to-r  from-gray-600 to-gray-950 rounded-t-lg"></div>
              <div className="px-4 sm:pb-12 pb-4">
                {/* top  prpfile */}
                <div className="flex justify-between items-center py-4">
                  <div className="flex justify-between items-center gap-3">
                    <img
                      loading="lazy"
                      src={userInfo?.avatarUrl || DefaultImage.src}
                      alt="Avatar"
                      className="w-[95px] rounded-full shadow-md"
                    />
                    <div>
                      <p className="font-bold my-1">{userInfo?.name}</p>
                      <p className="font-light">{userInfo?.email}</p>
                    </div>
                  </div>
                  <Tooltip content="Nhấn để thay đổi thông tin ">
                    <button
                      onClick={handleEditProfile}
                      className=" text-xs uppercase  px-4 py-1 rounded-lg text-center  bg-button-primary hover:bg-secondary-300 transition-all duration-200"
                    >
                      {isEdit ? "Chỉnh sửa" : "Xong"}
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
                      className="block w-fit  text-sm sm:text-base cursor-pointer text-label font-light italic"
                    >
                      Địa chỉ email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      defaultValue={userInfo?.email}
                      className="w-full outline-none py-3 px-4 rounded-md focus:shadow-lg bg-input text-input-text"
                      readOnly={true}
                    />
                  </div>
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="name"
                      className="block w-fit  text-sm sm:text-base cursor-pointer text-label font-light italic "
                    >
                      Tên
                    </label>
                    <input
                      onChange={handleInputOnChange}
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={userInfo?.name}
                      className={`w-full ${
                        isEdit ? "border-none" : "border border-borderb"
                      }  outline-none py-3 px-4 rounded-md focus:shadow-lg bg-input text-input-text`}
                      readOnly={isEdit}
                    />
                  </div>
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="phone"
                      className="block w-fit  text-sm sm:text-base cursor-pointer text-label font-light italic "
                    >
                      Số điện thoại
                    </label>
                    <input
                      onChange={handleInputOnChange}
                      type="text"
                      id="phone"
                      name="phone_number"
                      defaultValue={userInfo?.phone_number}
                      className={`w-full ${
                        isEdit ? "border-none" : "border border-borderb"
                      }  outline-none py-3 px-4 rounded-md focus:shadow-lg bg-input text-input-text`}
                      readOnly={isEdit}
                    />
                  </div>
                  {/* Address Selection */}
                  <div className="col-span-1 my-2 sm:my-0">
                    <label
                      htmlFor="province"
                      className="block w-fit  text-sm sm:text-base cursor-pointer text-label font-light italic"
                    >
                      Tỉnh/Thành phố
                    </label>
                    <select
                      id="province"
                      className={`w-full ${
                        isEdit ? "border-none" : "border border-borderb"
                      }  outline-none py-3 px-4 rounded-md focus:shadow-lg bg-input text-input-text`}
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
                        <option value="">Chọn Tỉnh/Thành phố</option>
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
                      className="block w-fit  text-sm sm:text-base cursor-pointer text-label font-light italic"
                    >
                      Huyện
                    </label>
                    <select
                      id="district"
                      className={`w-full ${
                        isEdit ? "border-none" : "border border-borderb"
                      }  outline-none py-3 px-4 rounded-md focus:shadow-lg bg-input text-input-text`}
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
                        <option value="">Chọn Huyện</option>
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
                      className="block w-fit  text-sm sm:text-base cursor-pointer text-label font-light italic"
                    >
                      Xã
                    </label>
                    <select
                      id="ward"
                      className={`w-full ${
                        isEdit ? "border-none" : "border border-borderb"
                      }  outline-none py-3 px-4 rounded-md focus:shadow-lg bg-input text-input-text`}
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
                        <option value="">Chọn Xã</option>
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
                      className="block w-fit  text-sm sm:text-base cursor-pointer text-label font-light italic"
                    >
                      Địa chỉ cụ thể
                    </label>
                    <input
                      type="text"
                      id="detail"
                      name="detail"
                      defaultValue={userFormData.addresses.detail}
                      onChange={handleAddressDetailChange}
                      className={`w-full ${
                        isEdit ? "border-none" : "border border-borderb"
                      }  outline-none py-3 px-4 rounded-md focus:shadow-lg bg-input text-input-text`}
                      readOnly={isEdit}
                    />
                  </div>

                  <Tooltip content="Save profile">
                    <button
                      onClick={handleSubmitForm}
                      aria-label="submit"
                      type="submit"
                      className="sm:col-start-2 sm:col-span-1 w-[30%] sm:w-full text-center  py-2 rounded-md hover:bg-secondary-500 transition-all hover:translate-x-3  cursor-pointer bg-button-primary"
                    >
                      Lưu
                    </button>
                  </Tooltip>
                </form>
                <div className="flex justify-start gap-3 items-center sm:mt-10 mt-2">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-blue-500 p-3 text-xl rounded-full bg-blue-200"
                  />
                  <div>
                    <p className="text-small sm:text-base text-light-primary-text dark:text-dark-primary-text">
                      {userInfo?.email}
                    </p>
                  </div>
                </div>
                <div>
                  {userInfo?.role === "owner" ? (
                    <button
                      onClick={() => {
                        router.push("/shop/dashboard");
                      }}
                      className="underline hover:text-accent uppercase text-primary-400"
                    >
                      Quản lí cửa hàng
                    </button>
                  ) : userInfo?.role === "admin" ? (
                    <button
                      onClick={() => {
                        router.push("/admin");
                      }}
                      className="underline hover:text-accent uppercase text-primary-400"
                    >
                      Trang của quản trị viên
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        router.push("/shop/create");
                      }}
                      className="underline hover:text-accent uppercase text-primary-400"
                    >
                      Start Business
                    </button>
                  )}
                  <button
                    className="float-right p-2 hover:text-accent"
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
