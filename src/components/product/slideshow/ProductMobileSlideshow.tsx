"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "./slideshow.css";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{
          width: "100vw",
          height: "500px",
        }}
        pagination
        navigation
        autoplay={{
          delay: 2500,
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper2"
      >
        {images.map((img) => (
          <SwiperSlide key={img}>
            <Image
              src={`/products/${img}`}
              alt={title}
              height={600}
              width={600}
              className="object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
