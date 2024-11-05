"use client";

import ChatBox from "@/components/chat/ChatBox";
import ProductReviewCard from "@/components/review/ProductReviewCard";
import ListCardSekelecton from "@/components/skelecton/ListCardSekelecton";
import SingleCardSekelecton from "@/components/skelecton/SingleCardSekelecton";
import SpinnerLoader from "@/components/Spinner";
import Spinner from "@/components/Spinner";
import { IProduct, IUpdateProductForm } from "@/interfaces/product.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import {
  AddToCart,
  AddToWishList,
  GetOneProduct,
  GetRelatedProducts,
  UpdateProductInfo,
} from "@/services/product.service";
import { GetShopInfoByUserId } from "@/services/shop.service";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faCircle, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const productId = props.params.slug;
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [relatedProduct, setRelatedProduct] = useState<IProduct[]>();
  const [product, setProduct] = useState<IProduct>();
  const [shopInfo, setShopInfo] = useState<IShop | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  // toggle chat
  const [isChatbox, setIsChatBox] = useState<boolean>(false);

  const [updateProductForm, setUpdateProductForm] =
    useState<IUpdateProductForm>({
      name: "",
      price: 0,
      description: "",
      sku: "",
      stock_quantity: 0,
      isOutStanding: false,
    });

  const fetchProductData = async () => {
    try {
      const res = await GetOneProduct(productId);
      const related = await GetRelatedProducts(productId);

      setProduct(res);
      setRelatedProduct(related);

      if (res) {
        setUpdateProductForm({
          name: res.name,
          price: res.price,
          description: res.description,
          sku: res.sku,
          stock_quantity: res.stock_quantity,
          isOutStanding: res.isOutStanding,
        });
        fetchShopInfo(res.shop_owner_id);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const fetchShopInfo = async (shop_id: string) => {
    try {
      const data = await GetShopInfoByUserId(shop_id);
      setShopInfo(data);
    } catch (error) {}
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateProductForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCreateOrder = () => {
    if (orderQuantity > Number(product?.stock_quantity)) {
      toast.warn(
        "The quantity purchased has exceeded the quantity of available products"
      );
    } else if (orderQuantity === 0) {
      toast.warn("Please select purchase quantity");
    } else {
      router.push(`/order/createOrder?orderInfo=${productId}-${orderQuantity}`);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <MainLayout>
      <section className="w-full px-4 sm:min-h-screen ">
        {product ? (
          <div className="w-full">
            {/* product info */}
            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:h-3/4 ">
              <div className="sm:col-span-7 ">
                <Slider {...settings} className="h-[300px] sm:h-full">
                  {product.images.map((img, index) => (
                    <img
                      loading="lazy"
                      key={index}
                      src={`${img}`}
                      alt="Product Image"
                      className="w-full sm:h-[500px] h-[400px]  object-cover rounded-md cursor-pointer"
                    />
                  ))}
                </Slider>
              </div>
              <div className="px-5 rounded shadow sm:col-span-5 bg-light-modal-popup dark:bg-dark-modal-popup sm:h-full">
                <div className="border-b border-light-element-border dark:border-dark-card-border ">
                  <h1 className="capitalize text-light-primary-text dark:text-dark-primary-text text-[32px] my-3">
                    {product.name}
                  </h1>
                  <p className="my-3  text-light-primary-text dark:text-dark-primary-text text-[24px]">
                    ${product.price}
                  </p>
                  <p className="text-[10px] text-light-primary-text dark:text-dark-primary-text font-light uppercase my-3">
                    Mã: {product.sku}
                  </p>
                </div>
                <div className="border-b border-light-element-border dark:border-dark-card-border">
                  <div className="flex items-center justify-between">
                    <p>Số lượng trong kho: {product.stock_quantity}</p>
                    {product.stock_quantity >= 1 ? (
                      <p>Trạng thái: Còn hàng</p>
                    ) : (
                      <p>Trạng thái: Hết hàng</p>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={handleAddToCart}
                      className="w-full p-1 my-3 text-center uppercase transition-all bg-button-primary hover:bg-accent"
                    >
                      Thêm vào giỏ hàng
                    </button>
                    <button
                      onClick={handleAddToWishList}
                      className="flex items-center justify-center w-full gap-3"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="hover:text-pink-700"
                      />
                      <p className="p-1 hover:underline hover:text-accent">
                        Thêm vào danh sách yêu thích
                      </p>
                    </button>
                  </div>
                </div>
                <div>
                  <Accordion className="block w-full h-fit ">
                    <AccordionItem
                      key="1"
                      aria-label="Description"
                      title="Về sản phẩm"
                      className="py-2 border-b border-light-element-border dark:border-dark-card-border "
                    >
                      <p className="text-sm text-light-primary-text dark:text-dark-primary-text">
                        {product.description}
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="2"
                      aria-label="Story"
                      title="Câu chuyện"
                      className="py-2 border-b border-light-element-border dark:border-dark-card-border"
                    >
                      <p className="text-sm text-light-primary-text dark:text-dark-primary-text">
                        Handcrafted from rare, petrified wood cut from lengths
                        of fossilized trees, the tabletops of our Clayhill
                        Occasional Collection are truly organic masterpieces.
                        Artisans hand-select wood from the grounds of volcanic
                        central Philippines, then arrange veneers into an inlaid
                        mosaic. Naturally varying colors and patterns create
                        unique details in every tabletop, while the bases are
                        sculpted from resin and detailed to mimic natural tree
                        trunks to finish the look.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="3"
                      aria-label="Warranty"
                      title="Chính sách"
                      className="py-2 border-b border-light-element-border dark:border-dark-card-border"
                    >
                      <p className="text-sm text-light-primary-text dark:text-dark-primary-text">
                        We are committed to the quality, beauty, and resilience
                        of every Arhaus piece you bring into your home, and
                        warrant our collections to be free of defects in
                        material and craftsmanship
                      </p>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="flex justify-end w-full">
                  <Button
                    onPress={onOpen}
                    className="flex-1 px-2 py-1 my-3 text-center uppercase transition-all rounded-sm bg-button-primary hover:bg-accent"
                  >
                    Mua ngay
                  </Button>
                  <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    placement="center"
                  >
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            Chọn số lượng sản phẩm
                          </ModalHeader>
                          <ModalBody>
                            <input
                              type="number"
                              value={orderQuantity}
                              onChange={(e) =>
                                setOrderQuantity(Number(e.target.value))
                              }
                              className="text-center p-3 border border-light-input-border dark:border-dark-input-border text-light-input-text dark:text-dark-input-text bg-light-input-field dark:bg-dark-input-field rounded-md"
                            />
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              color="danger"
                              variant="light"
                              onPress={onClose}
                            >
                              Hủy
                            </Button>
                            <Button
                              color="primary"
                              onPress={onClose}
                              onClick={handleCreateOrder}
                            >
                              Thanh toán
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </div>
              </div>
            </div>
            {/* shop info + comment wrapper */}
            <div className="sm:mx-20">
              {/* shop info */}
              <div className="mt-16 flex justify-start gap-4  p-6 text-sm sm:text-base border border-primary-border rounded bg-card-bg">
                <div className="w-[100px] ">
                  <img
                    loading="lazy"
                    src={shopInfo?.logoUrl}
                    alt="Shop Logo"
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-around gap-2">
                  <p className=" font-bold">{shopInfo?.name}</p>
                  <p className="font-light">
                    {shopInfo?.isActive ? "Đang hoạt động" : "Tạm đóng"}
                    <span className="mx-2">
                      <FontAwesomeIcon
                        icon={faCircle}
                        color={shopInfo?.isActive ? "green" : "red"}
                      />
                    </span>
                  </p>
                  <div className="flex justify-start gap-4">
                    <button
                      className="capitalize p-2  bg-orange-100 text-orange-600 hover:bg-accent"
                      onClick={() => setIsChatBox(true)}
                    >
                      Chat với shop
                    </button>
                    <Link href={`/shop/${shopInfo?._id}`}>
                      <button className="capitalize p-2 bg-light-btn-bg hover:bg-accent bg-button-primary">
                        Xem shop
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              {/* review */}
              <div>
                {product.comments.map((reviewId, index) => (
                  <ProductReviewCard reviewId={reviewId} key={index} />
                ))}
              </div>
            </div>
            {/* related product */}
            <div className="mt-[100px]">
              <h2 className="py-10 text-2xl sm:text-2xl text-heading">
                Sản phẩm liên quan
              </h2>
              <div className="flex justify-around gap-4 overflow-x-auto">
                {relatedProduct?.map((r, index) => (
                  <div
                    className="flex flex-col justify-between w-1/3 gap-2 sm:w-1/4 shrink-0"
                    key={index}
                  >
                    <Link href={`/product/${r._id}`}>
                      <img
                        loading="lazy"
                        src={`${r.images[0]}`}
                        alt="Related product image"
                        className="w-full h-[200px] object-cover"
                      />
                    </Link>
                    <Link href={`/product/${r._id}`}>
                      <p>{r.name}</p>
                    </Link>
                    <p>{r.price}$</p>
                  </div>
                ))}
              </div>
            </div>

            {/* chat */}
            {isChatbox ? (
              <div className="fixed bottom-0 right-1 z-[500]  p-2 shadow-violet-500 shadow-2xl border border-primary-border backdrop-blur-2xl rounded">
                <button
                  className="  hover:text-red-500 border border-borderb text-secondary-500 p-2 shadow-lg shadow-teal-400 rounded-full"
                  onClick={() => setIsChatBox(false)}
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
                <ChatBox
                  senderId={userInfo?._id}
                  receiverId={shopInfo?.owner}
                />
              </div>
            ) : (
              <></>
            )}
            {/* edit product by admin */}
            {userInfo?.role == "owner" &&
              userInfo.shop_id === product.shop_owner_id && (
                <div className="mt-8">
                  <div className="w-full">
                    <Link
                      href={`/product/analyze/${productId}`}
                      className="px-4 py-2 text-center rounded-md bg-cyan-800 hover:bg-green-600 transition duration-300 text-white my-4 w-full block"
                    >
                      Analyze
                    </Link>
                  </div>
                </div>
              )}
          </div>
        ) : (
          <SingleCardSekelecton />
        )}
      </section>
    </MainLayout>
  );
}

export default ProductDetail;
