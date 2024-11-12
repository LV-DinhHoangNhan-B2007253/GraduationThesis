"use client";
import ChatWindow from "@/components/chat/ChatWindow";
import OrderManagement from "@/components/management/OrderManagement";
import CategoryManageShop from "@/components/shop/dashboardScreen/CategoryManageShop";

import ProductManageShop from "@/components/shop/dashboardScreen/ProductManageShop";
import PromotionManageShop from "@/components/shop/dashboardScreen/PromotionManageShop";

import ThemeSwitch from "@/components/ThemeSwitch";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
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
        return <ProductManageShop />;
      case "order":
        // return <OrderManageShop />;
        return <OrderManagement />;
      case "promotion":
        return <PromotionManageShop />;
      case "chat":
        return <ChatWindow />;
      case "category":
        return <CategoryManageShop />;
      default:
        return;
    }
  };
  return (
    <div className="h-screen">
      <div className="flex justify-between items-center px-2  py-2 bg-[#283618] text-white">
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
      <div className="grid grid-cols-12 gap-1 max-h-[94%] overflow-y-auto">
        <nav className=" col-span-1 sm:col-span-2 px-1 h-full bg-[#606c38] min-h-screen">
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start bg-[#283618] text-white  text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("product")}
          >
            <span>
              <FontAwesomeIcon
                icon={faStore}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block"> sản phẩm</p>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start bg-[#283618] text-white  text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("order")}
          >
            <span>
              <FontAwesomeIcon
                icon={faReceipt}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block">Đơn hàng</p>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start bg-[#283618] text-white  text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("promotion")}
          >
            <span>
              <FontAwesomeIcon
                icon={faRectangleAd}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block">Quảng cáo</p>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start bg-[#283618] text-white  text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("chat")}
          >
            <span>
              <FontAwesomeIcon
                icon={faFacebookMessenger}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block">Trò chuyện</p>
          </button>

          {/* category */}
          <button
            className="flex items-center gap-2 px-3 py-2 my-2 justify-start bg-[#283618] text-white  text-sm sm:text-base rounded-md w-full hover:opacity-85 hover:scale-105 duration-200 transition-all hover:translate-x-2"
            onClick={() => setActiveTab("category")}
          >
            <span>
              <FontAwesomeIcon
                icon={faDatabase}
                className="text-sm sm:text-base w-[20px]"
              />
            </span>
            <p className="hidden sm:block">Danh mục</p>
          </button>
        </nav>
        <div className="sm:col-span-10 col-span-full bg-card-bg p-2">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default ShopDashboard;
