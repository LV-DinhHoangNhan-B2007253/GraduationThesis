"use client";

import { RootState } from "@/redux/store";
import {
  faBars,
  faBurger,
  faClose,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DefaultAvatar from "@/public/default-avatar.png";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Accordion, AccordionItem, Avatar, Tooltip } from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";
import { GetAreaAndCategoryLabel } from "@/services/area.service";
import SlidingPanel from "react-sliding-side-panel";
import Slider from "react-slick";
interface INavbarCategory {
  _id: string;
  name: string;
}

interface INavbarArea {
  _id: string;
  name: string;
  categoryItem: INavbarCategory[];
  banner: string;
}

function Navbar() {
  const { isLogin } = useSelector((state: RootState) => state.userLoginState);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [area, setArea] = useState<INavbarArea[]>([]);
  const [category, setCategory] = useState<INavbarCategory[]>([]);
  const [subNav, setSubNav] = useState<boolean>(false);
  const [hoveredCategory, setHoveredCategory] = useState<string>("");
  const [openPanel, setOpenPanel] = useState<boolean>(false);

  const handleMouseEnter = (categoryName: string) => {
    setHoveredCategory(categoryName);
    setSubNav(true);
  };
  const handleMouseOut = () => {
    setHoveredCategory("");
    setSubNav(false);
  };
  const fetchData = async () => {
    try {
      const data = await GetAreaAndCategoryLabel();
      setArea(data);
      // setCategory(data[0].categoryItem);
    } catch (error) {
      console.log("Navbar call api error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <nav className="  bg-light-navbar-bg text-light-navbar-text dark:bg-dark-navbar-bg dark:text-dark-navbar-text shadow-sm  ">
      {/* top nav */}
      <div className=" border-b border-gray-200 flex justify-between items-center w-full sm:px-20 px-5 py-4 sm:py-8 gap-3 sm:gap-0">
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
          className="sm:block hidden text-light-primary-text text-3xl font-mono font-thin uppercase tracking-widest dark:text-dark-primary-text
          hover:text-light-active hover:dark:text-dark-active transition-all bg-gradient-to-r 
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
      <div>
        <div className="relative">
          <ul className="mx-64  justify-between items-center flex-wrap  py-4 top-0 hidden sm:flex">
            {area.map((i) => (
              // view area nav
              <li
                key={i._id}
                onMouseEnter={() => handleMouseEnter(i.name)}
                onMouseLeave={handleMouseOut}
              >
                <Link
                  href={`/area/${i._id}`}
                  className="p-5 uppercase text-light-navbar-text dark:text-dark-navbar-text hover:text-orange-500 transition-all text-base font-light tracking-wider"
                >
                  {i.name}
                </Link>
                {hoveredCategory === i.name && (
                  // view sub nav
                  <div className="flex justify-between px-8 py-2  absolute  top-12 left-0 right-0 min-h-36 bg-light-modal-popup dark:bg-dark-modal-popup w-full">
                    <ul className="flex justify-start gap-10 flex-wrap">
                      {i.categoryItem.map((c) => (
                        <li key={c._id} className="">
                          <Link
                            href={`/category/${c._id}`}
                            className="capitalize text-small hover:text-light-active dark:hover:text-dark-active hover:underline"
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="">
                      <img
                        src={`${i.banner}`}
                        alt="Banner"
                        className="object-cover transform hover:scale-x-105 transition duration-400  max-w-[400px] min-w-36 rounded"
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className={`sm:hidden block`}>
            <div className="w-full h-fit">
              <Slider {...settings}>
                {area.map((i) => (
                  <p className="p-5 uppercase text-light-navbar-text dark:text-dark-navbar-text hover:text-orange-500 transition-all text-base font-light tracking-wider">
                    {i.name}
                  </p>
                ))}
              </Slider>
            </div>
            <div className="flex justify-end">
              <button className="block sm:hidden text-center ">
                {!openPanel ? (
                  <FontAwesomeIcon
                    icon={faBars}
                    size="1x"
                    className="p-2"
                    onClick={() => setOpenPanel(true)}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faClose}
                    size="1x"
                    className="p-2"
                    onClick={() => setOpenPanel(false)}
                  />
                )}
              </button>
            </div>
          </div>
          <div
            className={`bg-light-modal-popup dark:bg-dark-modal-popup rounded shadow ${
              openPanel ? "block" : "hidden"
            }`}
          >
            <div>
              <ul>
                {area.map((i) => (
                  <li
                    key={i._id}
                    onMouseEnter={() => handleMouseEnter(i.name)}
                    onMouseLeave={handleMouseOut}
                  >
                    <p className="p-5 uppercase text-light-navbar-text dark:text-dark-navbar-text hover:text-orange-500 transition-all text-base font-light tracking-wider">
                      {i.name}
                    </p>
                    {hoveredCategory === i.name && (
                      <div className="absolute left-36 top-12 bottom-0 mt-2 bg-light-modal-popup dark:bg-dark-modal-popup w-full sm:w-64 lg:w-96 rounded shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between px-4 py-2">
                          <ul className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                            {i.categoryItem.map((c) => (
                              <li key={c._id} className="">
                                <Link
                                  href={`/category/${c._id}`}
                                  className="capitalize text-small hover:text-light-active dark:hover:text-dark-active hover:underline"
                                >
                                  {c.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* place holder */}
    </nav>
  );
}

export default Navbar;
