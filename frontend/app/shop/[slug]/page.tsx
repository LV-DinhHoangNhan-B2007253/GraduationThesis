"use client";

import ShopProductCard from "@/components/shop/ShopProductCard";
import ShopSaleList from "@/components/shop/ShopSaleList";
import { IUser } from "@/interfaces/auth.interface";
import { IProduct } from "@/interfaces/product.interface";
import { IPromotion } from "@/interfaces/promotion.interface";
import MainLayout from "@/layouts/MainLayout";
import { GetAllProductsOfShop } from "@/services/product.service";
import { GetPromotionsOfShop } from "@/services/promotion.service";
import { GetShopInfoByUserId } from "@/services/shop.service";
import { GetUserInfoById } from "@/services/user.service";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { UserInfo } from "os";
import { useEffect, useState } from "react";

function ShopInfo(props: any) {
  const ShopId = props.params.slug;
  const [shopInfo, setShopInfo] = useState<IShop | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [recommentProducts, setRecommentProducts] = useState<IProduct[]>([]);
  const [shopOwner, setShopOwner] = useState<IUser | null>(null);
  const [promotionList, setPromotionList] = useState<IPromotion[]>([]);

  //   dữ liệu cần lấy: thông tin shop, thông tin sản phẩm của shop, thanh điều hướng gồm: nổi bật (khuyến mãi, các sản phẩm ngẫu nhiểu), mục tât cả sản phẩm.

  const getRandomProducts = (products: IProduct[], count: number) => {
    // Copy mảng gốc để tránh thay đổi mảng ban đầu
    const shuffledProducts = [...products];

    // Fisher-Yates shuffle để xáo trộn mảng
    for (let i = shuffledProducts.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledProducts[i], shuffledProducts[randomIndex]] = [
        shuffledProducts[randomIndex],
        shuffledProducts[i],
      ];
    }

    // Lấy 'count' sản phẩm đầu tiên sau khi đã xáo trộn
    return shuffledProducts.slice(0, count);
  };

  const fetchShopInfo = async (shop_id: string) => {
    try {
      // get shop info
      const data = await GetShopInfoByUserId(shop_id);
      //   get product of shop
      const products = await GetAllProductsOfShop(shop_id);
      setShopInfo(data);
      setProducts(products);
      const shuffle_products = getRandomProducts(products, 6);
      setRecommentProducts(shuffle_products);
      // promotion of shop
      const promotions = await GetPromotionsOfShop(ShopId);
      setPromotionList(promotions);
      //   shuffle products
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOwnerInfo = async () => {
    try {
      const user = await GetUserInfoById(shopInfo?.owner as string);
      setShopOwner(user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchShopInfo(ShopId);
  }, []);

  useEffect(() => {
    fetchOwnerInfo();
  }, [shopInfo]);

  return (
    <MainLayout>
      <div className="sm:mx-48 mt-5 scroll-smooth">
        {/* banner logo */}
        <section id="TopInfo" data-aos="fade-up">
          <div className="relative">
            <img
              src={shopInfo?.shopBanner}
              alt="Shop banner"
              className=" w-full h-[250px] object-cover "
            />
            <div className="absolute bottom-2 left-8 p-4 backdrop-blur-md">
              <div className="flex justify-start items-center gap-3">
                <img
                  src={shopInfo?.logoUrl}
                  alt="shop logo"
                  className="w-[100px] rounded-full"
                />
                <div className="flex-col gap-2">
                  <p className="text-white text-xl font-bold uppercase">
                    {shopInfo?.name}
                  </p>
                  <p className="text-white text-xl font-bold uppercase">
                    {shopInfo?.isActive ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <button className="w-full py-1 px-3 text-center bg-transparent border border-green-100 text-base font-bold uppercase hover:bg-green-400 duration-100">
                  Chat
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-around items-center gap-5 text-light-primary-text dark:text-dark-primary-text mt-3 px-2 py-2 bg-light-modal-popup dark:bg-dark-modal-popup backdrop-blur-md ">
          <Link className="hover:text-blue-800 hover:underline" href={"#home"}>
            Home
          </Link>
          <Link className="hover:text-blue-800 hover:underline" href={"#sale"}>
            On Sale
          </Link>
          <Link className="hover:text-blue-800 hover:underline" href={"#all"}>
            All Products
          </Link>
          <Link
            className="hover:text-blue-800 hover:underline"
            href={"#contact"}
          >
            Contact
          </Link>
        </div>
        {/* recomment products */}
        <section id="home" data-aos="fade-left" className="my-3">
          <h1 className="text-base sm:text-2xl text-light-primary-text dark:text-dark-primary-text mt-6 tracking-widest font-light">
            You may also be interested in
          </h1>
          <div className="grid grid-cols-6 gap-2">
            {recommentProducts.map((product) => (
              <div className="col-span-2 sm:col-span-1">
                <ShopProductCard product={product} key={product._id} />
              </div>
            ))}
          </div>
        </section>

        <section id="sale">
          <h1 className="text-base sm:text-2xl text-light-primary-text dark:text-dark-primary-text mt-6 tracking-widest font-light">
            Our Programs
          </h1>
          {/* promotions  */}
          {promotionList.map((promo) => (
            <Link href={`/shop/promotion/${promo._id}`}>
              <img
                src={`${promo.promotion_banner}`}
                alt="Promotion banner"
                className="w-full h-[500px] object-cover"
              />
            </Link>
          ))}
        </section>

        <section id="all">
          <h1 className="text-base sm:text-2xl text-light-primary-text dark:text-dark-primary-text mt-6 tracking-widest font-light">
            All Products
          </h1>
          <div className="grid grid-cols-6 gap-1">
            {products.map((pro) => (
              <div className="col-span-2 sm:col-span-2 my-2" data-aos="fade-up">
                <ShopProductCard product={pro} key={pro.sku} />
              </div>
            ))}
          </div>
        </section>

        {/* about shop */}
        <section
          id="contact"
          className="sm:flex justify-start gap-4 py-2 bg-light-modal-popup dark:bg-dark-modal-popup backdrop-blur-md"
        >
          <div className="sm:w-1/2 h-[300px] w-full">
            <img
              src={shopInfo?.shopBanner}
              alt="shop banner"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <div className="sm:w-1/2 w-full flex flex-col justify-around px-2 text-sm sm:text-base text-light-primary-text dark:text-dark-primary-text tracking-wider">
            <div className="flex flex-col gap-4 border-b border-gray-400">
              <div className="">
                <p>Shop Name: {shopInfo?.name}</p>
                <p>Shop Email: {shopInfo?.shopMail}</p>
              </div>
              <p>{shopInfo?.description}</p>
            </div>
            <div>
              <h3 className="uppercase text-center my-2">
                Contact Information
              </h3>
              <div>
                <p>Owner: {shopOwner?.name}</p>
                <p>Email: {shopOwner?.email}</p>
                {shopOwner?.addresses && (
                  <div>
                    <p>
                      Address: {shopOwner?.addresses?.province?.province_name},
                      {shopOwner?.addresses?.district?.district_name},
                      {shopOwner?.addresses?.province.province_name},
                      {shopOwner?.addresses?.ward.ward_name},
                      {shopOwner?.addresses?.detail}
                    </p>
                  </div>
                )}
              </div>
              <div></div>
            </div>
          </div>
        </section>
        <div className="text-right my-2">
          <Link href={"#"}>
            <FontAwesomeIcon icon={faArrowCircleUp} className="text-base" />
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

export default ShopInfo;
