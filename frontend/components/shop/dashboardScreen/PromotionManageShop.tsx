"use client";

import PromotionCard from "@/components/management/card/PromotionCard";
import ListCardSekelecton from "@/components/skelecton/ListCardSekelecton";
import { IProduct } from "@/interfaces/product.interface";
import { IPromotion } from "@/interfaces/promotion.interface";
import { RootState } from "@/redux/store";
import {
  GetAllProductsOfShop,
  GetShopProductsWithPage,
} from "@/services/product.service";
import {
  CreateNewPromotion,
  GetPromotionsOfShop,
} from "@/services/promotion.service";
import { faClose, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-date-picker";
import { format, parse } from "date-fns"; // Thêm dòng này

function PromotionManageShop() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [originProducts, setOriginProducts] = useState<IProduct[]>([]);
  const [promotionList, setPromotionList] = useState<IPromotion[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  // test formatdate
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndtDate] = useState<Date>(new Date());
  const [step, setStep] = useState<number>(1);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [promotionDetails, setPromotionDetails] = useState({
    title: "",
    description: "",
    discountType: "percentage", // default value
    promotion_banner: null as File | null,
  });
  // search
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (originProducts) {
      // Kiểm tra xem originProductList có tồn tại
      const filteredProducts = originProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.sku.toLowerCase().includes(term.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  // Fetch products and promotions
  const fetchProducts = async () => {
    try {
      const data = await GetAllProductsOfShop(userInfo?.shop_id as string);
      setProducts(data);
      setOriginProducts(data);
    } catch (error) {
      toast.error("Cannot get products");
    }
  };

  const fetchPromotion = async () => {
    try {
      const data = await GetPromotionsOfShop(userInfo?.shop_id as string);
      setPromotionList(data);
    } catch (error: any) {
      toast.error("Cannot get promotions", error);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchPromotion();
  }, []);

  const handleRefetchProduct = () => {
    fetchProducts();
    fetchPromotion();
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCloseModal = () => {
    const defaultPromotionDetails = {
      title: "",
      description: "",
      discountType: "percentage", // default value
      promotion_banner: null as File | null,
    };
    setPromotionDetails({ ...defaultPromotionDetails });
    setSelectedProducts([]);
    setStep(1);
    setIsOpenModal(false);
  };

  const handlePromotionDetailsChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPromotionDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPromotionDetails((prev) => ({
      ...prev,
      promotion_banner: file,
    }));
  };

  const handleNextStep = () => {
    if (selectedProducts.length < 2) {
      toast.warn("vui lòng chọn ít nhất 2 sản phẩm");
    } else {
      setStep(2);
    }
  };

  const handleCreatePromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newForm = new FormData();

    newForm.append("shop_id", userInfo?.shop_id as string);
    newForm.append("title", promotionDetails.title);
    newForm.append("description", promotionDetails.description);
    newForm.append("discountType", promotionDetails.discountType);

    if (promotionDetails.promotion_banner) {
      newForm.append("promotion_banner", promotionDetails.promotion_banner);
    }
    newForm.append("startDate", startDate.toISOString());
    newForm.append("endDate", endDate.toISOString());
    // Thêm từng product ID vào FormData
    selectedProducts.forEach((product) => {
      newForm.append(`products`, product);
    });

    newForm.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const data = await CreateNewPromotion(newForm);
      if (data) {
        toast.success(`${data.message}`);
      }
    } catch (error) {
      toast.error("Failed to create promotion.");
    }
  };

  return (
    <div className="max-h-full overflow-y-auto relative">
      <div className="flex items-center  gap-2 mb-2">
        <button
          className="px-1 py-2 text-center border text-sm bg-button-success hover:bg-secondary-300"
          onClick={() => setIsOpenModal(true)}
        >
          + Tạo quảng cáo mới
        </button>

        <button className="text-center px-2 py-1 border border-primary-border rounded-md bg-button-warning hover:bg-button-success ">
          <FontAwesomeIcon
            icon={faRefresh}
            className="text-base text-secondary-500"
          />
        </button>
      </div>
      {isOpenModal && (
        <div className="absolute bg-card-bg top-10 bottom-0 left-0 right-0 z-[100] shadow-md rounded-md ">
          <div className="flex justify-between shadow mb-2 gap-2  bg-secondary-200">
            <input
              type="text"
              name="search"
              placeholder="tìm theo tên hoặc mã sản phẩm"
              className="w-full max-w-[300px] px-1 py-1 border outline-none bg-input text-input-text "
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button
              onClick={() => handleCloseModal()}
              className="text-center px-2 py-1 border border-primary-border bg-button-success hover:bg-button-danger "
            >
              <FontAwesomeIcon
                icon={faClose}
                className="text-base text-secondary-500"
              />
            </button>
          </div>
          {step === 1 && (
            <div className=" h-[95%] flex flex-col ">
              <div className="flex-1 overflow-y-auto ">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="border p-2 rounded-lg w-full flex items-center justify-start gap-4 hover:cursor-pointer hover:opacity-75"
                  >
                    <div className="flex justify-start gap-2 items-center w-1/2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleProductSelect(product._id)}
                        className="mt-2"
                      />
                      <img
                        loading="lazy"
                        src={product.images[0]}
                        alt={product.name}
                        className="w-[100px] object-cover rounded"
                      />
                      <p className="text-small font-semibold">{product.name}</p>
                    </div>
                    <p className="text-small font-semibold">
                      <span className="text-sm text-label font-light italic">
                        SKU:
                      </span>{" "}
                      {product.sku}
                    </p>
                  </div>
                ))}
              </div>
              <div className="w-full py-3 bg-input text-input-text flex justify-between items-center px-4">
                <div>
                  <p className="text-sm font-light italic">{`Chọn ít nhất 2 sản phẩm`}</p>
                  <p className="text-label text-sm">
                    Đã chọn:{" "}
                    <span className="text-base font-bold text-primary-400">
                      {selectedProducts.length}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleNextStep()}
                  className="px-1 py-2 text-center border text-sm bg-button-success hover:bg-secondary-300 rounded-md"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="px-20 py-3 mt-10 rounded-s border border-primary-border">
              <form className="mt-4" onSubmit={handleCreatePromotion}>
                <div className="my-2">
                  <label htmlFor="title" className="text-label my-1 block">
                    Tên quảng cáo
                  </label>
                  <input
                    required
                    type="text"
                    name="title"
                    placeholder="kỷ niệm, mừng sinh nhật v.v..."
                    value={promotionDetails.title}
                    onChange={handlePromotionDetailsChange}
                    className="border p-2 rounded w-full bg-input text-input-text outline-none"
                  />
                </div>
                <div className="my-2">
                  <label htmlFor="title" className="text-label my-1 block">
                    Mô tả
                  </label>
                  <textarea
                    required
                    name="description"
                    placeholder="Description"
                    value={promotionDetails.description}
                    onChange={handlePromotionDetailsChange}
                    className="border p-2 rounded w-full bg-input text-input-text outline-none"
                  />
                </div>
                <div className="my-2">
                  <label htmlFor="title" className="text-label my-1 block">
                    Loại giảm giá
                  </label>
                  <select
                    name="discountType"
                    value={promotionDetails.discountType}
                    onChange={handlePromotionDetailsChange}
                    className="border p-2 rounded w-full bg-input text-input-text outline-none"
                  >
                    <option value="percentage">Phần trăm %</option>
                    <option value="fixed">Cố định</option>
                  </select>
                </div>
                <div className="my-2">
                  <label htmlFor="title" className="text-label my-1 block">
                    Chọn ảnh banner
                  </label>
                  <input
                    required
                    type="file"
                    onChange={handleFileChange}
                    className="border p-2 rounded mt-4 w-full"
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="text-label my-1 block">
                    Từ ngày
                  </label>
                  <DatePicker
                    onChange={(date) => setStartDate(date as Date)}
                    value={startDate}
                    clearIcon
                    format="dd/MM/yyyy"
                    required={true}
                    minDate={new Date()}
                    className={`border p-2 rounded mt-4 w-1/2 my-0 outline-none `}
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="text-label my-1 block">
                    Đến ngày
                  </label>
                  <DatePicker
                    onChange={(date) => setEndtDate(date as Date)}
                    value={endDate}
                    clearIcon
                    format="dd/MM/yyyy"
                    minDate={new Date()}
                    required={true}
                    className={`border p-2 rounded mt-4 w-1/2`}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-button-success hover:bg-accent text-white px-4 py-2 rounded mt-4"
                >
                  Tạo quảng cáo
                </button>
              </form>
              <div className="flex items-center justify-end gap-4">
                <button
                  className="hover:text-accent"
                  onClick={() => handleCloseModal()}
                >
                  Hủy
                </button>
                <button
                  className="hover:text-accent"
                  onClick={() => setStep(1)}
                >
                  Trở lại
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        {promotionList.length > 0 ? (
          <div className="grid grid-rows-3 overflow-y-auto gap-3">
            {promotionList.map((promo, index) => (
              <div className="row-span-1" key={index}>
                <PromotionCard promo={promo} key={promo._id} />
              </div>
            ))}
          </div>
        ) : (
          <ListCardSekelecton />
        )}
      </div>
    </div>
  );
}

export default PromotionManageShop;
