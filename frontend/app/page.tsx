"use client";

import OutStandingHero from "@/components/homeSections/OutStandingHero";
import AreaHomeCard from "@/components/management/card/AreaHomeCard";
import Spinner from "@/components/Spinner";
import { IArea } from "@/interfaces/area.interface";
import { ICategory } from "@/interfaces/category.interface";
import MainLayout from "@/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { GetAllArea } from "@/services/area.service";
import { useSelect } from "@nextui-org/react";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";

export default function Home() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [areas, setAreas] = useState<IArea[]>();

  const fetchData = async () => {
    try {
      const res = await GetAllArea();
      setAreas(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // slider setting

  const areaSliderSetting = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          autoplay: true,
          autoplaySpeed: 2000,
          arrows: false,
        },
      },
    ],
  };

  return (
    <MainLayout>
      <section className="min-h-screen">
        <OutStandingHero />
      </section>
      <section
        className="min-h-screen sm:py-[80px] py-10 sm:px-[64px] px-2"
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
      >
        <h1 className="uppercase text-base sm:text-6xl text-center pb-4 mb-6">
          A CELEBRATION Of Personal <em>Style</em>
        </h1>
        <div>
          {areas ? (
            <Slider {...areaSliderSetting}>
              {areas.map((area) => (
                <AreaHomeCard areaItem={area} key={area._id} />
              ))}
            </Slider>
          ) : (
            <Spinner />
          )}
        </div>
      </section>
    </MainLayout>
  );
}
