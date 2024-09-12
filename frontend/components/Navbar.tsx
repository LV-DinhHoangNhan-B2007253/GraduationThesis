"use client";

import { RootState } from "@/redux/store";
import { faSearch, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import DefaultAvatar from "@/public/default-avatar.png";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Avatar, Tooltip } from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";

function Navbar() {
  const { isLogin } = useSelector((state: RootState) => state.userLoginState);
  const { userInfo } = useSelector((state: RootState) => state.user);

  return (
    <nav className="  bg-light-navbar-bg text-light-navbar-text dark:bg-dark-navbar-bg dark:text-dark-navbar-text shadow-sm  ">
      {/* top nav */}
      <div className=" flex justify-between items-center w-full sm:px-20 px-5 py-4 sm:py-8 gap-3 sm:gap-0">
        {/* search */}
        <div className="sm:hidden flex-1">
          <ThemeSwitch />
        </div>
        <div className="flex justify-between items-center  relative flex-1">
          <label htmlFor="search" className="absolute flex items-center  ">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-500 dark:text-gray-400 border-r-1  p-2 cursor-pointer hover:bg-blue-600 hover:text-white"
            />
          </label>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="search anything..."
            className="border  border-light-input-border text-light-input-text px-10 py-1 dark:text-dark-input-text dark:border-dark-input-border rounded-sm"
          />
        </div>
        {/* brand name */}
        <Link
          href={"/"}
          className="sm:block hidden text-light-primary-text text-2xl dark:text-dark-primary-text font-bold
          hover:text-light-active hover:dark:text-dark-active transition-all bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-transparent
          "
        >
          AikaStore
        </Link>
        {/* cart, wishlish, avatar */}
        <div className="flex-1">
          {isLogin ? (
            <div className="flex justify-end items-center gap-4 ">
              <div className="hidden sm:block">
                <ThemeSwitch />
              </div>
              <div className="sm:flex justify-between items-center  gap-4 hidden">
                <Tooltip content="Cart" color="foreground">
                  <Link href={"/cart"}>
                    <FontAwesomeIcon
                      icon={faShoppingBag}
                      className="text-pink-600 hover:text-pink-800 transition-all cursor-pointer text-2xl"
                    />
                  </Link>
                </Tooltip>
                <Tooltip content="Wish list" color="foreground">
                  <Link href={"/wishlist"}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      color=""
                      className="text-pink-600 hover:text-pink-800 transition-all cursor-pointer text-2xl"
                    />
                  </Link>
                </Tooltip>
              </div>
              <div>
                <Tooltip content="Profile" color="foreground">
                  <Link href={"/auth/profile"}>
                    <Avatar
                      src={userInfo?.avatarUrl || DefaultAvatar.src}
                      alt="profile avatar"
                      size="sm"
                    />
                  </Link>
                </Tooltip>
              </div>
            </div>
          ) : (
            <div className="flex justify-end items-center ">
              <div>
                <Link
                  href={"/auth/login"}
                  className=" border bg-light-btn-bg text-light-btn-text border-light-element-border dark:border-dark-input-border px-3 py-1 hover:bg-orange-500 dark:text-dark-btn-text dark:bg-dark-bg-btn rounded-md"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* bottom nav */}

      {/* place holder */}
    </nav>
  );
}

export default Navbar;
