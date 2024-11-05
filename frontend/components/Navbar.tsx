"use client";

import { RootState } from "@/redux/store";
import {
  faBell,
  faHome,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DefaultAvatar from "@/public/default-avatar.png";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Avatar, Tooltip } from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";
import NotificationBell from "./NotiBell";
import { useRouter } from "next/navigation";
import { UserInfo } from "os";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";

function Navbar() {
  const { isLogin } = useSelector((state: RootState) => state.userLoginState);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  // hover avatar
  const [toggleAvtNav, setToggleAvtNav] = useState<boolean>(false);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      console.log("search null");
      return;
    }
    router.push(`search?q=${searchQuery}`);
  };

  useEffect(() => {}, []);

  return (
    <nav className="bg-navbar sticky z-[3000] top-0 ">
      <div className="border-borderb border-b">
        {/* home icon */}

        {/* top nav */}
        <div className="flex items-center justify-between w-full  sm:px-20 py-2 sm:gap-0">
          {/* toggle switch */}
          <div className="flex gap-2">
            <div className="flex items-center">
              <ThemeSwitch />
              <Link href={"/"} className=" hidden sm:block ">
                <img src="/icon.png" alt="Home icon" className="w-10" />
              </Link>
            </div>
          </div>

          {/* home icon */}
          <div className="relative flex items-center sm:justify-center sm:hidden flex-1 sm:flex-none justify-start">
            <Link href={"/"} className=" ">
              <img src="/icon.png" alt="Home icon" className="w-10" />
            </Link>
          </div>
          {/* search bar */}
          <div className="sm:block hidden">
            <div className="relative w-full ">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="tìm tên sản phẩm hoặc tên cửa hàng...."
                className="pl-10 pr-4 py-1  border bg-input  rounded-md outline-none mx-1 text-input-text sm:min-w-[400px]"
              />
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  className="hover:text-secondary"
                />
              </button>
            </div>
          </div>
          {/* cart, wishlish, avatar */}
          <div>
            {isLogin ? (
              <div className="flex items-center justify-end gap-4 ">
                <div className="items-center justify-between  gap-4 flex">
                  <Tooltip content="Cart" color="foreground">
                    <Link href={"/cart"}>
                      <FontAwesomeIcon
                        icon={faShoppingBag}
                        className="text-xl text-primary-500 transition-all cursor-pointer hover:text-pink-800"
                      />
                    </Link>
                  </Tooltip>
                  <Tooltip content="Wish list" color="foreground">
                    <Link href={"/wishlist"}>
                      <FontAwesomeIcon
                        icon={faHeart}
                        color=""
                        className="text-xl text-primary-500 transition-all cursor-pointer hover:text-pink-800"
                      />
                    </Link>
                  </Tooltip>
                </div>
                <div className="relative">
                  <Avatar
                    src={userInfo?.avatarUrl || DefaultAvatar.src}
                    alt="profile avatar"
                    size="sm"
                    onClick={() => setToggleAvtNav(!toggleAvtNav)}
                    className="hover:cursor-pointer"
                  />
                  <ul
                    className={`absolute min-w-[150px] top-10 right-0 px-3 py-2 ${
                      toggleAvtNav ? "block" : "hidden"
                    } z-[4000]  rounded-md border border-borderb backdrop-blur-md`}
                  >
                    <li className="w-full border-b border-gray-100 my-2 hover:text-accent">
                      <Link
                        href={"/auth/profile"}
                        className="px-1 py-1 w-full hover:underline"
                      >
                        Thông tin
                      </Link>
                    </li>
                    <li className="w-full border-b border-gray-100 my-2 hover:text-accent">
                      <Link
                        href={"/chat"}
                        className="px-1 py-1 w-full hover:underline"
                      >
                        Hội Thoại
                      </Link>
                    </li>
                    <li className="w-full border-b border-gray-100 my-2 hover:text-accent">
                      <Link
                        href={"/order/myOrder"}
                        className="px-1 py-1 w-full hover:underline"
                      >
                        Đơn Hàng
                      </Link>
                    </li>
                    {userInfo?.role === "owner" ? (
                      <li className="w-full border-b border-gray-100 my-2 hover:text-accent">
                        <Link
                          href={`/shop/${userInfo.shop_id}`}
                          className="px-1 py-1 w-full hover:underline"
                        >
                          Cửa Hàng
                        </Link>
                      </li>
                    ) : (
                      userInfo?.role === "admin" && (
                        <li className="w-full border-b border-gray-100 my-2 hover:text-accent">
                          <Link
                            href={`/admin`}
                            className="px-1 py-1 w-full hover:underline"
                          >
                            Cửa Sổ Quản Lí
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end ">
                <div>
                  <Link
                    href={"/auth/login"}
                    className="px-3 py-1 border rounded-md bg-primary-400    hover:bg-accent"
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center  sm:hidden">
          <div className="relative w-fit ">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="tìm tên sản phẩm hoặc tên cửa hàng...."
              className="pr-10 pl-4 py-1  border  rounded-md bg-input text-input-text outline-none mx-1 "
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="hover:text-secondary font-light"
              />
            </button>
          </div>
        </div>
      </div>
      {/* place holder */}
      {/* botom nav */}
      <div className="flex items-center justify-center gap-32 py-1 border-borderb border-b">
        <Link
          className="text-sm uppercase hover:text-accent text-secondary-400"
          href={"#outstanding"}
        >
          Nổi bật
        </Link>
        <Link
          className="text-sm uppercase hover:text-accent text-secondary-400"
          href={"#all-product"}
        >
          Sản phẩm
        </Link>
        <Link
          className="text-sm uppercase hover:text-accent text-secondary-400"
          href={"#categories"}
        >
          Danh mục
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
