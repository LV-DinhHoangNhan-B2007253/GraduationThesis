"use client";

import { ICartItem, IProduct } from "@/interfaces/product.interface";
import {
  GetOneProduct,
  RemoveProductInCart,
  UpdateProductQuantityInCart,
} from "@/services/product.service";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
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
    <div className="flex-1">
      <div className="flex justify-between gap-2 items-center">
        <div className="flex gap-2 flex-1 items-center">
          <img
            src={`${product?.images[0]}`}
            alt="Product Image"
            className="w-[80px] h-[80px]"
          />
          <Link href={`/product/${product?._id}`}>
            <p className="text-black font-bold  dark:text-dark-primary-text hover:underline text-wrap text-small sm:text-base truncate hover:text-light-text-link-color dark:hover:text-dark-link ">
              {product?.name}
            </p>
          </Link>
        </div>
        <p className="flex-1">
          Unit price:{" "}
          <span className="text-small sm:text-base font-bold">
            {product?.price}$
          </span>
        </p>
        <div className="flex justify-around items-center gap-1 ">
          <button
            className="px-2 py-1 border border-light-input-border dark:border-dark-border"
            onClick={decreaseQuantity}
          >
            -
          </button>
          <input
            type="text"
            value={cartItem.quantity}
            disabled
            className="max-w-[80px] text-center py-1 bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text text-small sm:text-base outline-none border border-light-input-border dark:border-dark-input-border font-bold"
          />
          <button
            className="px-2 py-1 border border-light-input-border dark:border-dark-border"
            onClick={increaseQuantity}
          >
            +
          </button>
        </div>
        <div className="flex-1">
          <p className="text-small sm:text-base text-orange-600">
            {(product?.price as number) * cartItem.quantity}$
          </p>
        </div>
        <div className=" flex items-center gap-4">
          <button onClick={handleDeleteProductInCart}>
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-small sm:text-2xl hover:text-red-500 text-gray-400"
            />
          </button>
          <Link
            href={`/order/createOrder?orderInfo=${product?._id}-${cartItem.quantity}`}
            className="px-4 py-2 rounded text-white dark:text-dark-primary-text text-center hover:cursor-pointer uppercase text-small sm:text-base  bg-orange-600 hover:bg-orange-500 transition duration-400"
          >
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductInCart;
