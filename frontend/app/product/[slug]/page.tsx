"use client";

import Spinner from "@/components/Spinner";
import { IProduct } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import {
  AddToCart,
  AddToWishList,
  GetOneProduct,
} from "@/services/product.service";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, AccordionItem, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { toast } from "react-toastify";

function ProductDetail(props: any) {
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  const productId = props.params.slug;
  const [product, setProduct] = useState<IProduct>();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const fetchProductData = async () => {
    try {
      const res = await GetOneProduct(productId);
      setProduct(res);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleAddToCart = async () => {
    try {
      const res = await AddToCart(userInfo?._id as string, productId);
      toast.success(`${res.message}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const handleAddToWishList = async () => {
    try {
      const res = await AddToWishList(userInfo?._id as string, productId);
      toast.success(`${res.message}`);
    } catch (error) {
      toast.warning(`${error}`);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <MainLayout>
      <section className="w-full sm:h-screen px-4">
        {product ? (
          <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:h-3/4 ">
            <div className="sm:col-span-7 ">
              <Slider {...settings} className="h-[300px] sm:h-full">
                {product.images.map((img) => (
                  <Tooltip content="slide to see more" size="sm">
                    <img
                      src={`${img}`}
                      alt="Product Image"
                      className="w-full sm:h-full h-[400px]  object-cover rounded-md cursor-pointer"
                    />
                  </Tooltip>
                ))}
              </Slider>
            </div>
            <div className="sm:col-span-5 px-5 bg-light-modal-popup dark:bg-dark-modal-popup rounded shadow  sm:h-full">
              <div className="border-b border-light-element-border dark:border-dark-card-border ">
                <h1 className="capitalize text-light-primary-text dark:text-dark-primary-text text-[32px] my-3">
                  {product.name}
                </h1>
                <p className="my-3  text-light-primary-text dark:text-dark-primary-text text-[24px]">
                  ${product.price}
                </p>
                <p className="text-[10px] text-light-primary-text dark:text-dark-primary-text font-light uppercase my-3">
                  SKU: {product.sku}
                </p>
              </div>
              <div className="border-b border-light-element-border dark:border-dark-card-border">
                <div className="flex justify-between items-center">
                  <p>QTY: {product.stock_quantity}</p>
                  <p>In stock</p>
                </div>
                <div>
                  <button
                    onClick={handleAddToCart}
                    className="uppercase w-full text-center p-1 bg-light-btn-bg dark:bg-dark-bg-btn text-light-btn-text dark:text-dark-btn-text hover:bg-green-800 transition-all my-3"
                  >
                    Add to bag
                  </button>
                  <button
                    onClick={handleAddToWishList}
                    className="flex justify-center items-center gap-3 w-full"
                  >
                    <FontAwesomeIcon icon={faHeart} />
                    <p className="hover:text-light-text-link-color dark:hover:text-dark-link hover:underline p-1">
                      Add to wishlist
                    </p>
                  </button>
                </div>
              </div>
              <div>
                <Accordion className="h-fit w-full block  ">
                  <AccordionItem
                    key="1"
                    aria-label="Description"
                    title="Description"
                    className="border-b border-light-element-border dark:border-dark-card-border py-2 "
                  >
                    <p className="text-sm text-light-primary-text dark:text-dark-primary-text">
                      {product.description}
                    </p>
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label="Story"
                    title="Story"
                    className="border-b border-light-element-border dark:border-dark-card-border py-2"
                  >
                    <p className="text-sm text-light-primary-text dark:text-dark-primary-text">
                      Handcrafted from rare, petrified wood cut from lengths of
                      fossilized trees, the tabletops of our Clayhill Occasional
                      Collection are truly organic masterpieces. Artisans
                      hand-select wood from the grounds of volcanic central
                      Philippines, then arrange veneers into an inlaid mosaic.
                      Naturally varying colors and patterns create unique
                      details in every tabletop, while the bases are sculpted
                      from resin and detailed to mimic natural tree trunks to
                      finish the look.
                    </p>
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    aria-label="Warranty"
                    title="Warranty"
                    className="border-b border-light-element-border dark:border-dark-card-border py-2"
                  >
                    <p className="text-sm text-light-primary-text dark:text-dark-primary-text">
                      We are committed to the quality, beauty, and resilience of
                      every Arhaus piece you bring into your home, and warrant
                      our collections to be free of defects in material and
                      craftsmanship
                    </p>
                  </AccordionItem>
                </Accordion>
              </div>
              <div className="flex justify-end w-full">
                <Link href={"#"}>
                  <button className="uppercase flex-1 text-center p-1 bg-green-900 dark:bg-dark-bg-btn text-light-btn-text dark:text-dark-btn-text hover:bg-green-800 transition-all my-3">
                    Buy Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </section>
    </MainLayout>
  );
}

export default ProductDetail;
