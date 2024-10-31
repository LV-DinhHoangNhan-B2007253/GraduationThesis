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
    <nav className="shadow-sm bg-light-navbar-bg text-light-navbar-text dark:bg-dark-navbar-bg dark:text-dark-navbar-text sticky z-[3000] top-0">
      {/* home icon */}
      <div className="hidden sm:block text-center pt-2">
        <Link
          href={"/"}
          className="text-3xl py-2 font-mono font-bold uppercase tracking-widest hover:tracking-[.3em] transition-all duration-300 text-gray-600 dark:text-dark-primary-text"
        >
          Homee
        </Link>
      </div>
      {/* top nav */}
      <div className="flex items-center justify-between w-full gap-3 px-5 py-4 border-b border-gray-200 sm:px-20 sm:py-8 sm:gap-0">
        {/* toggle switch */}
        <div className="flex gap-2">
          <ThemeSwitch />
          {userInfo?.role === "owner" ? (
            <Link
              href={`/shop/${userInfo.shop_id}`}
              className="hidden sm:block text-sm text-light-text-link-color dark:text-dark-link hover:underline uppercase p-2 border border-gray-200 rounded"
            >
              My Shop
            </Link>
          ) : (
            userInfo?.role === "admin" && (
              <Link
                href={"/admin"}
                className="hidden sm:block text-sm text-light-text-link-color dark:text-dark-link hover:underline uppercase p-2 border border-gray-200 rounded"
              >
                Admin Panel
              </Link>
            )
          )}
        </div>

        {/* home icon */}
        <div className="relative flex items-center sm:justify-center sm:hidden flex-1 sm:flex-none justify-start">
          <Link
            href={"/"}
            className=" font-mono sm:hidden sm:text-3xl text-2xl font-thin tracking-widest uppercase transition-all  text-light-primary-text dark:text-dark-primary-text hover:text-light-active hover:dark:text-dark-active bg-gradient-to-r "
          >
            <FontAwesomeIcon icon={faHome} />
          </Link>
        </div>
        {/* search bar */}
        <div className="sm:block hidden">
          <div className="flex items-center gap-0">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              className=" border  w-full sm:min-w-[500px] px-3 py-2 rounded-l-md bg-light-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border dark:bg-dark-input-field "
            />
            <button
              onClick={handleSearch}
              className="border px-3 py-2 text-center font-light border-light-input-border dark:border-dark-input-border rounded-r-md "
            >
              <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            </button>
          </div>
        </div>
        {/* cart, wishlish, avatar */}
        <div className="">
          {isLogin ? (
            <div className="flex items-center justify-end gap-4 ">
              <div className="items-center justify-between  gap-4 flex">
                <Tooltip content="Cart" color="foreground">
                  <Link href={"/cart"}>
                    <FontAwesomeIcon
                      icon={faShoppingBag}
                      className="text-2xl text-pink-600 transition-all cursor-pointer hover:text-pink-800"
                    />
                  </Link>
                </Tooltip>
                <Tooltip content="Wish list" color="foreground">
                  <Link href={"/wishlist"}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      color=""
                      className="text-2xl text-pink-600 transition-all cursor-pointer hover:text-pink-800"
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
                  } z-[4000] bg-light-modal-popup dark:bg-dark-modal-popup rounded-md border border-gray-200`}
                >
                  <li className="w-fit border-b border-gray-100 my-2">
                    <Link
                      href={"/auth/profile"}
                      className="px-1 py-1 w-full hover:underline"
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="w-fit border-b border-gray-100 my-2">
                    <Link
                      href={"/order/myOrder"}
                      className="px-1 py-1 w-full hover:underline"
                    >
                      My Oder
                    </Link>
                  </li>
                </ul>
              </div>
              {/* <NotificationBell /> */}
              <Link href={"/chat"}>
                <FontAwesomeIcon icon={faBell} />
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-end ">
              <div>
                <Link
                  href={"/auth/login"}
                  className="px-3 py-1 border rounded-md bg-light-btn-bg text-light-btn-text border-light-element-border dark:border-dark-input-border hover:bg-orange-500 dark:text-dark-btn-text dark:bg-dark-bg-btn"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* bottom nav */}
      <div className="flex sm:hidden justify-center items-center bg-light-navbar-bg dark:bg-dark-navbar-bg py-3">
        <div className="flex items-center gap-1">
          <input
            type="text"
            className=" border  w-3/4 sm:min-w-[500px] px-3 py-2 rounded-l-md bg-light-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border dark:bg-dark-input-field "
          />
          <button
            onClick={handleSearch}
            className="border px-3 py-2 text-center font-light border-light-input-border dark:border-dark-input-border rounded-r-md "
          >
            <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
          </button>
        </div>
      </div>
      {/* place holder */}
    </nav>
  );
}

export default Navbar;
