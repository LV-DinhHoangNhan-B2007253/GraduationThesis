"use client";

import { ICartItem, IProduct } from "@/interfaces/product.interface";
import {
  GetOneProduct,
  RemoveProductInCart,
  UpdateProductQuantityInCart,
} from "@/services/product.service";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ProductInCart({
  cartItem,
  userId,
  onDelete,
}: {
  cartItem: ICartItem;
  userId: string;
  onDelete: (productId: string) => void;
}) {
  const [product, setProduct] = useState<IProduct>();

  const getProductInfo = async () => {
    try {
      const data = await GetOneProduct(cartItem.product_id);
      setProduct(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  // todo
  const handleDeleteProductInCart = async () => {
    try {
      const data = await RemoveProductInCart(userId, product?._id as string);
      if (data) {
        toast.success(`${data.message}`);
        onDelete(cartItem.product_id);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const increaseQuantity = async () => {
    cartItem.quantity += 1;
    await handleUpdateQuantity();
  };

  const decreaseQuantity = async () => {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await handleUpdateQuantity();
    } else {
      await handleDeleteProductInCart();
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      const updateBody = {
        updateQuantity: cartItem.quantity,
      };
      const data = await UpdateProductQuantityInCart(
        userId,
        product?._id as string,
        updateBody
      );
      if (data) {
        getProductInfo();
        console.log(`${data.message}`);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getProductInfo();
  }, []);

  return (
    <div className="flex-1 bg-card-bg px-2 py-1">
      <div className="flex justify-between gap-2 items-center">
        <div className="flex gap-2 flex-1 items-center">
          <img
            loading="lazy"
            src={`${product?.images[0]}`}
            alt="Product Image"
            className="w-[80px] h-[80px]"
          />
          <Link href={`/product/${product?._id}`}>
            <p className="  hover:underline text-wrap text-small sm:text-base truncate ">
              {product?.name}
            </p>
          </Link>
        </div>
        <p className="flex-1">
          Đơn giá:{" "}
          <span className="text-small sm:text-base font-bold">
            {product?.price.toLocaleString()}$
          </span>
        </p>
        <div className="flex justify-around items-center gap-1 mx-3">
          <button
            className="font-bold mx-1 text-button-success hover:text-accent"
            onClick={decreaseQuantity}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <input
            type="text"
            value={cartItem.quantity}
            disabled
            className="max-w-[80px] text-center py-1 text-sm outline-none border border-light-input-border  font-bold text-primary-400 bg-input "
          />
          <button
            className="font-bold mx-1  text-button-success hover:text-accent"
            onClick={increaseQuantity}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="flex-1">
          <p className="text-small sm:text-base text-orange-600">
            {((product?.price as number) * cartItem.quantity).toLocaleString()}$
          </p>
        </div>
        <div className=" flex items-center gap-4 ">
          <Link
            href={`/order/createOrder?orderInfo=${product?._id}-${cartItem.quantity}`}
            className="p-2 text-sm rounded text-center hover:cursor-pointer uppercase text-white  bg-button-success hover:bg-secondary-300 transition duration-400"
          >
            Mua
          </Link>
          <button onClick={handleDeleteProductInCart}>
            <FontAwesomeIcon
              icon={faXmark}
              className="text-small sm:text-xl hover:text-red-500 text-gray-400"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductInCart;
