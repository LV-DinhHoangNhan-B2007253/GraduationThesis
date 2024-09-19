import { ICategory } from "@/interfaces/category.interface";
import React from "react";
import Slider from "react-slick";
import CategoryItemCard from "./CategoryItemCard";

function CategoryItemSlider({
  categoryList,
}: {
  categoryList: ICategory[] | undefined;
}) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow:
      (categoryList?.length ?? 0) < 4 ? categoryList?.length ?? 0 : 4,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: false,
          centerMode: true,
        },
      },
    ],
  };
  return (
    <Slider {...settings} className="sm:h-[250px] h-[100px] sm:mx-10 mx-1">
      {categoryList?.map((item) => (
        <CategoryItemCard name={item.name} categoryId={item._id} />
      ))}
    </Slider>
  );
}

export default CategoryItemSlider;
