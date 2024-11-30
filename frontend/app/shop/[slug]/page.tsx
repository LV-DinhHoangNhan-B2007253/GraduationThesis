"use client";

import CategoryCard from "@/components/category/CategoryCard";
import ChatBox from "@/components/chat/ChatBox";
import ShopProductCard from "@/components/shop/ShopProductCard";
import ShopSaleList from "@/components/shop/ShopSaleList";
import { IUser } from "@/interfaces/auth.interface";
import { ICategory } from "@/interfaces/category.interface";
import { IProduct } from "@/interfaces/product.interface";
import { IPromotion } from "@/interfaces/promotion.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { GetCategoryAndProductByShopId } from "@/services/category.service";
import { GetAllProductsOfShop } from "@/services/product.service";
import { GetPromotionsOfShop } from "@/services/promotion.service";
import { GetShopInfoByUserId } from "@/services/shop.service";
import { GetUserInfoById } from "@/services/user.service";
import { faArrowCircleUp, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ShopInfo(props: any) {
  const ShopId = props.params.slug;
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [shopInfo, setShopInfo] = useState<IShop | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [recommentProducts, setRecommentProducts] = useState<IProduct[]>([]);
  const [shopOwner, setShopOwner] = useState<IUser | null>(null);
  const [promotionList, setPromotionList] = useState<IPromotion[]>([]);
  const [categories, setCategories] = useState<ICategory[]>();
  const [isChatbox, setIsChatBox] = useState<boolean>(false);

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
      setShopInfo(data);
      //   get product of shop
      const products = await GetAllProductsOfShop(shop_id);
      setProducts(products);
      // categories
      const categoryList = await GetCategoryAndProductByShopId(ShopId);
      if (categoryList) {
        setCategories(categoryList.categories);
      }
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
      <div className="sm:mx-48 mt-5 scroll-smooth relative">
        {/* chat */}
        {isChatbox ? (
          <div className="fixed bottom-0 right-1 z-[500]  p-2 shadow-violet-500 shadow-2xl border border-primary-border backdrop-blur-2xl rounded">
            <button
              className="  px-2 py-1 text-center border border-primary-border rounded-sm bg-button-success hover:bg-button-warning text-white hover:text-red-50"
              onClick={() => setIsChatBox(false)}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
            <ChatBox senderId={userInfo?._id} receiverId={shopInfo?.owner} />
          </div>
        ) : (
          <></>
        )}
        {/* banner logo */}
        <section id="TopInfo" data-aos="fade-up">
          <div className="relative">
            <img
              loading="lazy"
              src={shopInfo?.shopBanner}
              alt="Shop banner"
              className=" w-full h-[250px] object-cover "
            />
            <div className="absolute bottom-2 left-8 p-4 backdrop-blur-md">
              <div className="flex justify-start items-center gap-3">
                <img
                  loading="lazy"
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
                <button
                  onClick={() => setIsChatBox(true)}
                  className="w-full py-1 px-3 text-center bg-transparent border border-green-100 text-base font-bold uppercase hover:bg-green-400 duration-100"
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* nav */}
        <div className="flex justify-around items-center gap-5 text-light-primary-text dark:text-dark-primary-text mt-3 px-2 py-2 bg-light-modal-popup dark:bg-dark-modal-popup backdrop-blur-md ">
          <Link className="hover:text-blue-800 hover:underline" href={"#home"}>
            Trang chủ
          </Link>
          <Link className="hover:text-blue-800 hover:underline" href={"#sale"}>
            Đang trong chương trình
          </Link>
          <Link className="hover:text-blue-800 hover:underline" href={"#all"}>
            Tất cả sản phẩm
          </Link>
          <Link
            className="hover:text-blue-800 hover:underline"
            href={"#contact"}
          >
            Thông tin liên hệ
          </Link>
        </div>
        {/* recomment products */}
        <section id="home" data-aos="fade-left" className="my-3">
          <h1 className="text-base sm:text-2xl text-heading mt-6 tracking-widest font-light">
            Có thể bạn sẽ thích
          </h1>
          <div className="grid grid-cols-6 gap-2">
            {recommentProducts.map((product, index) => (
              <div className="col-span-2 sm:col-span-1" key={index}>
                <ShopProductCard product={product} key={product._id} />
              </div>
            ))}
          </div>
        </section>
        <>
          {categories && (
            <section>
              <h1 className="text-base sm:text-2xl text-heading mt-6 tracking-widest font-light ">
                Danh mục
              </h1>
              <div className="grid grid-cols-8 my-3">
                {categories.map((cate, index) => (
                  <div key={index} className="col-span-1">
                    <CategoryCard category={cate} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
        <section id="sale">
          <h1 className="text-base sm:text-2xl text-heading mt-6 tracking-widest font-light">
            Chương trình
          </h1>
          {/* promotions  */}
          {promotionList.map((promo, index) => (
            <div key={promo._id} className="my-2">
              <Link href={`/shop/promotion/${promo._id}`}>
                <img
                  loading="lazy"
                  src={`${promo.promotion_banner}`}
                  alt="Promotion banner"
                  className="w-full h-[500px] object-cover"
                />
              </Link>
            </div>
          ))}
        </section>

        <section id="all">
          <h1 className="text-base sm:text-2xl text-heading mt-6 tracking-widest font-light">
            Tất cả sản phẩm
          </h1>
          <div className="grid grid-cols-4 gap-1">
            {products.map((pro, index) => (
              <div
                className="col-span-1 sm:col-span-1 my-2"
                key={pro._id.toString()}
              >
                <ShopProductCard product={pro} key={pro.sku} />
              </div>
            ))}
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
