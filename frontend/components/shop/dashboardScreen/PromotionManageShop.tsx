"use client";

import PromotionCard from "@/components/management/card/PromotionCard";
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
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setFlagsFromString } from "v8";

function PromotionManageShop() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [promotionList, setPromotionList] = useState<IPromotion[]>([]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [step, setStep] = useState(1);
  const [promotionDetails, setPromotionDetails] = useState({
    title: "",
    description: "",
    discountType: "percentage", // default value
    promotion_banner: null as File | null,
    startDate: "", // Initialize with the current date
    endDate: "", // Initialize with the current date
  });
  // Fetch products and promotions
  const fetchProducts = async () => {
    try {
      const data = await GetAllProductsOfShop(userInfo?.shop_id as string);
      setProducts(data);
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
    onOpenChange();
    setSelectedProducts([]);
    setStep(1);
  };

  // const handlePromotionDetailsChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setPromotionDetails((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const formatDateToDDMMYYYY = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  const handlePromotionDetailsChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPromotionDetails((prev) => ({
      ...prev,
      [name]:
        name === "startDate" || name === "endDate"
          ? formatDateToDDMMYYYY(value)
          : value,
      // [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPromotionDetails((prev) => ({
      ...prev,
      promotion_banner: file,
    }));
  };

  // validate date

  const validateDates = () => {
    const { startDate, endDate } = promotionDetails;
    const start = new Date(startDate.split("/").reverse().join("-"));
    const end = new Date(endDate.split("/").reverse().join("-"));
    const today = new Date();

    if (start < today) {
      toast.error("Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại.");
      return false;
    }
    if (end < start) {
      toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
      return false;
    }
    return true;
  };

  const handleCreatePromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Kiểm tra ngày bắt đầu và kết thúc
    if (!validateDates()) {
      return;
    }
    const newForm = new FormData();
    newForm.append("shop_id", userInfo?.shop_id as string);
    newForm.append("title", promotionDetails.title);
    newForm.append("description", promotionDetails.description);
    newForm.append("discountType", promotionDetails.discountType);

    if (promotionDetails.promotion_banner) {
      newForm.append("promotion_banner", promotionDetails.promotion_banner);
    }
    newForm.append("startDate", promotionDetails.startDate);
    newForm.append("endDate", promotionDetails.endDate);
    // Thêm từng product ID vào FormData
    selectedProducts.forEach((product) => {
      newForm.append(`products`, product);
    });

    // newForm.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });

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
    <div className="max-h-full overflow-y-auto">
      <div className="flex items-center justify-between gap-2">
        <Button
          onPress={onOpen}
          className="px-1 py-2 text-center border rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border"
        >
          + New
        </Button>

        <Button
          onClick={handleRefetchProduct}
          className="px-1 py-2 text-center border rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border"
        >
          <FontAwesomeIcon icon={faRefresh} />
        </Button>
      </div>
      <div>
        {promotionList.length > 0 ? (
          <div className="grid grid-cols-3 grid-rows-1   gap-2 mt-10">
            {promotionList.map((promo, index) => (
              <div
                className="col-span-3 row-span-1 shadow-md rounded-sm"
                key={index}
              >
                <PromotionCard promo={promo} key={promo._id} />
              </div>
            ))}
          </div>
        ) : (
          <>w</>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        size="5xl"
        className="mt-10"
        scrollBehavior="inside"
      >
        <ModalHeader>
          <h2>{step === 1 ? "Select Products" : "Create Promotion"}</h2>
        </ModalHeader>
        <ModalContent>
          {step === 1 && (
            <ModalBody className="relative">
              <div>
                <div className="flex flex-col gap-2">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="border p-2 rounded-lg w-full h-[60px] flex items-center gap-3 justify-start"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleProductSelect(product._id)}
                        className="mt-2"
                      />
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-[100px] h-full object-cover rounded"
                      />
                      <h3 className="mt-2 font-semibold">{product.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
              <ModalFooter className="bottom-0 sticky bg-white flex items-center">
                <p>Selected: {selectedProducts.length}</p>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}
                  onClick={() => setStep(1)}
                >
                  Close
                </Button>
                <Button color="primary" onPress={() => setStep(2)}>
                  Next
                </Button>
              </ModalFooter>
            </ModalBody>
          )}

          {step === 2 && (
            <ModalBody>
              <form className="mt-4" onSubmit={handleCreatePromotion}>
                <input
                  required
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={promotionDetails.title}
                  onChange={handlePromotionDetailsChange}
                  className="border p-2 rounded mt-4 w-full"
                />
                <textarea
                  required
                  name="description"
                  placeholder="Description"
                  value={promotionDetails.description}
                  onChange={handlePromotionDetailsChange}
                  className="border p-2 rounded mt-4 w-full"
                />
                <select
                  name="discountType"
                  value={promotionDetails.discountType}
                  onChange={handlePromotionDetailsChange}
                  className="border p-2 rounded mt-4 w-full"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
                <input
                  required
                  type="file"
                  onChange={handleFileChange}
                  className="border p-2 rounded mt-4 w-full"
                />
                <input
                  required
                  type="date"
                  name="startDate"
                  // value={promotionDetails.startDate} // Format the date to string
                  value={promotionDetails.startDate
                    .split("/")
                    .reverse()
                    .join("-")}
                  onChange={handlePromotionDetailsChange}
                  className="border p-2 rounded mt-4 w-full"
                />
                <input
                  required
                  type="date"
                  name="endDate"
                  // value={promotionDetails.endDate} // Format the date to string
                  value={promotionDetails.endDate
                    .split("/")
                    .reverse()
                    .join("-")}
                  onChange={handlePromotionDetailsChange}
                  className="border p-2 rounded mt-4 w-full"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                  Create Promotion
                </button>
              </form>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}
                  onClick={() => setStep(1)}
                >
                  Close
                </Button>
                <Button color="primary" onPress={() => setStep(1)}>
                  Back
                </Button>
              </ModalFooter>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default PromotionManageShop;

// "use client";

// import PromotionCard from "@/components/management/card/PromotionCard";
// import { IProduct } from "@/interfaces/product.interface";
// import { IPromotion } from "@/interfaces/promotion.interface";
// import { RootState } from "@/redux/store";
// import {
//   GetAllProductsOfShop,
//   GetShopProductsWithPage,
// } from "@/services/product.service";
// import {
//   CreateNewPromotion,
//   GetPromotionsOfShop,
// } from "@/services/promotion.service";
// import { faRefresh } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   Button,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   useDisclosure,
// } from "@nextui-org/react";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";

// function PromotionManageShop() {
//   const { userInfo } = useSelector((state: RootState) => state.user);
//   const [products, setProducts] = useState<IProduct[]>([]);
//   const [promotionList, setPromotionList] = useState<IPromotion[]>([]);

//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
//   const [step, setStep] = useState(1);
//   const [promotionDetails, setPromotionDetails] = useState({
//     title: "",
//     description: "",
//     discountType: "percentage",
//     promotion_banner: null as File | null,
//     startDate: "",
//     endDate: "",
//   });

//   // Fetch products and promotions
//   const fetchProducts = async () => {
//     try {
//       const data = await GetAllProductsOfShop(userInfo?.shop_id as string);
//       setProducts(data);
//     } catch (error) {
//       toast.error("Cannot get products");
//     }
//   };

//   const fetchPromotion = async () => {
//     try {
//       const data = await GetPromotionsOfShop(userInfo?.shop_id as string);
//       setPromotionList(data);
//     } catch (error: any) {
//       toast.error("Cannot get promotions", error);
//     }
//   };
//   useEffect(() => {
//     fetchProducts();
//     fetchPromotion();
//   }, []);

//   const handleRefetchProduct = () => {
//     fetchProducts();
//     fetchPromotion();
//   };

//   const handleProductSelect = (productId: string) => {
//     setSelectedProducts((prev) =>
//       prev.includes(productId)
//         ? prev.filter((id) => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   const handleCloseModal = () => {
//     onOpenChange();
//     setSelectedProducts([]);
//     setStep(1);
//   };

//   const handlePromotionDetailsChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setPromotionDetails((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setPromotionDetails((prev) => ({
//       ...prev,
//       promotion_banner: file,
//     }));
//   };

//   const validateDates = () => {
//     const { startDate, endDate } = promotionDetails;
//     const start = new Date(startDate.split("/").reverse().join("-"));
//     const end = new Date(endDate.split("/").reverse().join("-"));
//     const today = new Date();

//     if (start < today) {
//       toast.error("Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại.");
//       return false;
//     }
//     if (end < start) {
//       toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
//       return false;
//     }
//     return true;
//   };

//   const handleCreatePromotion = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Kiểm tra ngày bắt đầu và kết thúc
//     if (!validateDates()) {
//       return;
//     }

//     const newForm = new FormData();
//     newForm.append("shop_id", userInfo?.shop_id as string);
//     newForm.append("title", promotionDetails.title);
//     newForm.append("description", promotionDetails.description);
//     newForm.append("discountType", promotionDetails.discountType);

//     if (promotionDetails.promotion_banner) {
//       newForm.append("promotion_banner", promotionDetails.promotion_banner);
//     }
//     newForm.append("startDate", promotionDetails.startDate);
//     newForm.append("endDate", promotionDetails.endDate);

//     selectedProducts.forEach((product) => {
//       newForm.append(`products`, product);
//     });

//     try {
//       const data = await CreateNewPromotion(newForm);
//       if (data) {
//         toast.success(`${data.message}`);
//       }
//     } catch (error) {
//       toast.error("Failed to create promotion.");
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between gap-2">
//         <Button onPress={onOpen} className="...">
//           + New
//         </Button>

//         <Button onClick={handleRefetchProduct} className="...">
//           <FontAwesomeIcon icon={faRefresh} />
//         </Button>
//       </div>
//       <div>
//         {promotionList.length > 0 ? (
//           <div className="grid grid-cols-3 gap-2 mt-10">
//             {promotionList.map((promo) => (
//               <div className="col-span-1 shadow-md rounded-sm">
//                 <PromotionCard promo={promo} key={promo._id} />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>chua co</p>
//         )}
//       </div>

//       <Modal
//         isOpen={isOpen}
//         onOpenChange={handleCloseModal}
//         size="5xl"
//         className="mt-10"
//       >
//         <ModalHeader>
//           <h2>{step === 1 ? "Select Products" : "Create Promotion"}</h2>
//         </ModalHeader>
//         <ModalContent>
//           {step === 1 && (
//             <ModalBody className="relative">
//               {/* Product selection logic */}
//               <ModalFooter className="bottom-0 sticky bg-white flex items-center">
//                 <p>Selected: {selectedProducts.length}</p>
//                 <Button
//                   color="danger"
//                   variant="light"
//                   onPress={handleCloseModal}
//                   onClick={() => setStep(1)}
//                 >
//                   Close
//                 </Button>
//                 <Button color="primary" onPress={() => setStep(2)}>
//                   Next
//                 </Button>
//               </ModalFooter>
//             </ModalBody>
//           )}

//           {step === 2 && (
//             <ModalBody>
//               <form className="mt-4" onSubmit={handleCreatePromotion}>
//                 <input
//                   required
//                   type="text"
//                   name="title"
//                   placeholder="Title"
//                   value={promotionDetails.title}
//                   onChange={handlePromotionDetailsChange}
//                   className="border p-2 rounded mt-4 w-full"
//                 />
//                 <textarea
//                   required
//                   name="description"
//                   placeholder="Description"
//                   value={promotionDetails.description}
//                   onChange={handlePromotionDetailsChange}
//                   className="border p-2 rounded mt-4 w-full"
//                 />
//                 <select
//                   name="discountType"
//                   value={promotionDetails.discountType}
//                   onChange={handlePromotionDetailsChange}
//                   className="border p-2 rounded mt-4 w-full"
//                 >
//                   <option value="percentage">Percentage</option>
//                   <option value="fixed">Fixed</option>
//                 </select>
//                 <input
//                   required
//                   type="file"
//                   onChange={handleFileChange}
//                   className="border p-2 rounded mt-4 w-full"
//                 />
//                 <input
//                   required
//                   type="text"
//                   name="startDate"
//                   placeholder="dd/mm/yyyy"
//                   value={promotionDetails.startDate}
//                   onChange={handlePromotionDetailsChange}
//                   className="border p-2 rounded mt-4 w-full"
//                 />
//                 <input
//                   required
//                   type="text"
//                   name="endDate"
//                   placeholder="dd/mm/yyyy"
//                   value={promotionDetails.endDate}
//                   onChange={handlePromotionDetailsChange}
//                   className="border p-2 rounded mt-4 w-full"
//                 />
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
//                 >
//                   Create Promotion
//                 </button>
//               </form>
//               <ModalFooter>
//                 <Button
//                   color="danger"
//                   variant="light"
//                   onPress={handleCloseModal}
//                   onClick={() => setStep(1)}
//                 >
//                   Close
//                 </Button>
//                 <Button color="primary" onPress={() => setStep(1)}>
//                   Back
//                 </Button>
//               </ModalFooter>
//             </ModalBody>
//           )}
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// export default PromotionManageShop;
