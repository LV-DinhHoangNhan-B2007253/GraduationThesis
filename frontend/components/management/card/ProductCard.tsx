"use client";
import { IProduct } from "@/interfaces/product.interface";
import { DeleteOneProduct } from "@/services/product.service";
import { faDollar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect } from "react";
import Slider from "react-slick";
import { toast } from "react-toastify";

function ProductCard({
  product,
  onProductDeleted,
}: {
  product: IProduct;
  onProductDeleted: () => void;
}) {
  const handleDeleteProduct = async () => {
    try {
      // Call the API to delete the product by ID
      const res = await DeleteOneProduct(product._id);
      toast.success(`${res.message}`);
      // Notify the parent to re-fetch the product list
      onProductDeleted();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  useEffect(() => {}, [product]);

  return (
    <div className="grid grid-cols-8 gap-2 items-start bg-light-modal-popup dark:bg-dark-modal-popup rounded shadow px-2 py-1">
      <div className="col-span-1">
        <Slider {...settings}>
          {product.images.map((img, index) => (
            <img
              src={`${img}`}
              alt={`image-${index}`}
              key={index}
              className="w-full rounded  cursor-pointer object-cover h-full max-h-[100px] sm:max-h-[150px]"
            />
          ))}
        </Slider>
      </div>
      <div className="col-span-5 px-2">
        <p className="text-light-primary-text my-1 tracking-wider dark:text-dark-primary-text font-bold text-base capitalize">
          {product.name}
        </p>
        <p className="text-light-primary-text my-1 tracking-wider dark:text-dark-primary-text text-base">
          SKU: <span className="uppercase text-base">{product.sku}</span>
        </p>
        <p className="text-light-primary-text my-1 tracking-wider dark:text-dark-primary-text text-small">
          {product.description}
        </p>
      </div>
      <div className="col-span-2">
        <div className="flex  items-center gap-2">
          <p className="text-base text-light-primary-text my-1 tracking-wider dark:text-dark-primary-text">
            Price: {product.price}
          </p>
          <FontAwesomeIcon icon={faDollar} />
        </div>
        <p>In Stock: {product.stock_quantity}</p>
        <div className="flex justify-between items-center gap-3">
          <Link
            href={`/product/${product._id}`}
            className="flex-1 p-1 rounded bg-light-btn-bg text-center text-light-btn-text hover:bg-light-btn-hover dark:bg-dark-bg-btn dark:text-dark-btn-text dark:hover:bg-dark-bg-btn-hover"
          >
            <button>Detail</button>
          </Link>
          <button onClick={handleDeleteProduct}>
            <FontAwesomeIcon
              icon={faTrash}
              className="p-2 rounded bg-red-500 text-white text-center hover:bg-red-600"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
