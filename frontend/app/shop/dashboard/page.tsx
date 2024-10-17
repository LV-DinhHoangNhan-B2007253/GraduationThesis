"use client";
import OrderManagement from "@/components/management/OrderManagement";
import ProductManagement from "@/components/management/ProductManagement";
import NotificationManageShop from "@/components/shop/NotificationManageShop";
import OrderManageShop from "@/components/shop/OrderManageShop";
import ProductManageShop from "@/components/shop/ProductManageShop";
import PromotionManageShop from "@/components/shop/PromotionManageShop";
import StorageManagementShop from "@/components/shop/StorageManagementShop";
import ThemeSwitch from "@/components/ThemeSwitch";
import MainLayout from "@/layouts/MainLayout";
import {
  faArrowAltCircleLeft,
  faBell,
  faDatabase,
  faHome,
  faReceipt,
  faRectangleAd,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function ShopDashboard() {
  const [activeTab, setActiveTab] = useState("product");
  const router = useRouter();

  const renderComponent = () => {
    switch (activeTab) {
      case "product":
        // return <ProductManageShop />;
        return <ProductManagement />;
      case "order":
        // return <OrderManageShop />;
        return <OrderManagement />;
      case "promotion":
        return <PromotionManageShop />;
      case "notification":
        return <NotificationManageShop />;
      case "storage":
        return <StorageManagementShop />;
      default:
        return;
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center px-2 my-4 py-2 ">
        <div className="flex justify-start items-center gap-6">
          <p
            className="hover:font-bold hover:underline cursor-pointer"
            onClick={() => {
              router.back();
            }}
          >
            <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          </p>
          <Link href={"/"} className="hover:font-bold hover:underline">
            <FontAwesomeIcon icon={faHome} />
          </Link>
        </div>
        <ThemeSwitch />
      </div>
      <div className="grid grid-cols-12 gap-1">
        <nav className=" col-span-1 sm:col-span-2 bg-light-card-bg dark:bg-dark-card-bg min-h-screen px-1">
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start  bg-light-sidebar-btn text-light-sidebar-btn-text dark:bg-dark-sidebar-btn dark:text-dark-sidebar-btn-text text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("product")}
          >
            <span>
              <FontAwesomeIcon
                icon={faStore}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block">Products</p>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start  bg-light-sidebar-btn text-light-sidebar-btn-text dark:bg-dark-sidebar-btn dark:text-dark-sidebar-btn-text text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("order")}
          >
            <span>
              <FontAwesomeIcon
                icon={faReceipt}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block">Orders</p>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start  bg-light-sidebar-btn text-light-sidebar-btn-text dark:bg-dark-sidebar-btn dark:text-dark-sidebar-btn-text text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("promotion")}
          >
            <span>
              <FontAwesomeIcon
                icon={faRectangleAd}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block">Promotions</p>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start  bg-light-sidebar-btn text-light-sidebar-btn-text dark:bg-dark-sidebar-btn dark:text-dark-sidebar-btn-text text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("notification")}
          >
            <span>
              <FontAwesomeIcon
                icon={faBell}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block">Notification</p>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start  bg-light-sidebar-btn text-light-sidebar-btn-text dark:bg-dark-sidebar-btn dark:text-dark-sidebar-btn-text text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("storage")}
          >
            <span>
              <FontAwesomeIcon
                icon={faDatabase}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block">Storage</p>
          </button>
        </nav>
        <div className="sm:col-span-10 col-span-full">{renderComponent()}</div>
      </div>
    </div>
  );
}

export default ShopDashboard;
