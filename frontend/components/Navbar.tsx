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
    <nav className="shadow-sm bg-light-navbar-bg text-light-navbar-text dark:bg-dark-navbar-bg dark:text-dark-navbar-text">
      {/* top nav */}
      <div className="flex items-center justify-between w-full gap-3 px-5 py-4 border-b border-gray-200 sm:px-20 sm:py-8 sm:gap-0">
        {/* search */}
        <div className="flex-1 sm:hidden">
          <ThemeSwitch />
        </div>
        <div className="relative flex items-center justify-between flex-1">
          <label htmlFor="search" className="absolute flex items-center ">
            <FontAwesomeIcon
              icon={faSearch}
              className="p-2 text-gray-500 cursor-pointer dark:text-gray-400 border-r-1 hover:bg-blue-600 hover:text-white"
            />
          </label>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="search anything..."
            className="px-10 py-1 border rounded-sm border-light-input-border text-light-input-text dark:text-dark-input-text dark:border-dark-input-border"
          />
        </div>
        {/* brand name */}
        <Link
          href={"/"}
          className="hidden font-mono text-3xl font-thin tracking-widest uppercase transition-all sm:block text-light-primary-text dark:text-dark-primary-text hover:text-light-active hover:dark:text-dark-active bg-gradient-to-r "
        >
          AikaStore
        </Link>
        {/* cart, wishlish, avatar */}
        <div className="flex-1">
          {isLogin ? (
            <div className="flex items-center justify-end gap-4 ">
              <div className="hidden sm:block">
                <ThemeSwitch />
              </div>
              <div className="items-center justify-between hidden gap-4 sm:flex">
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
      <div>
        <div className="relative">
          <ul className="top-0 flex-wrap items-center justify-between hidden py-4 mx-64 sm:flex">
            {area.map((i) => (
              // view area nav
              <li
                key={i._id}
                className="z-50"
                onMouseEnter={() => handleMouseEnter(i.name)}
                onMouseLeave={handleMouseOut}
              >
                <Link
                  href={`/area/${i._id}`}
                  className="p-5 text-base font-light tracking-wider uppercase transition-all text-light-navbar-text dark:text-dark-navbar-text hover:text-orange-500"
                >
                  {i.name}
                </Link>
                {hoveredCategory === i.name && (
                  // view sub nav
                  <div className="absolute left-0 right-0 flex justify-between w-full px-8 py-2 top-12 min-h-36 bg-light-modal-popup dark:bg-dark-modal-popup ">
                    <ul className="flex flex-wrap justify-start gap-10">
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
                  <Link href={`/area/${i._id}`}>
                    <p className="p-5 text-base font-light tracking-wider uppercase transition-all text-light-navbar-text dark:text-dark-navbar-text hover:text-orange-500">
                      {i.name}
                    </p>
                  </Link>
                ))}
              </Slider>
            </div>
            <div className="flex justify-end">
              <button className="block text-center sm:hidden ">
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
                    <p className="p-5 text-base font-light tracking-wider uppercase transition-all text-light-navbar-text dark:text-dark-navbar-text hover:text-orange-500">
                      {i.name}
                    </p>
                    {hoveredCategory === i.name && (
                      <div className="absolute bottom-0 w-full mt-2 rounded shadow-lg left-36 top-12 bg-light-modal-popup dark:bg-dark-modal-popup sm:w-64 lg:w-96">
                        <div className="flex flex-col justify-between px-4 py-2 sm:flex-row">
                          <ul className="flex flex-col gap-4 sm:flex-row sm:gap-10">
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
