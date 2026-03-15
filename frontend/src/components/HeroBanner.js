import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { assets } from "../assets/assets";

function HeroBanner() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true
  };

  const banners = [
    {
      id: 1,
      image: assets.main_banner_bg,
      title: "Fresh Groceries Delivered",
      subtitle: "Up to 50% off on daily essentials"
    },
    {
      id: 2,
      image: assets.bottom_banner_image,
      title: "Organic Vegetables",
      subtitle: "Fresh from the farm to your door"
    },
    {
      id: 3,
      image: assets.main_banner_bg_sm,
      title: "Premium Snacks",
      subtitle: "Stock up your pantry today"
    }
  ];

  return (
    <div className="hero-banner-container">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className="hero-slide">
            <div className="hero-image-wrapper">
              <img src={banner.image} alt={banner.title} className="hero-image" />
              <div className="hero-overlay" />
            </div>
            <div className="hero-content">
              <h2>{banner.title}</h2>
              <p>{banner.subtitle}</p>
              <button className="btn-shop-now">Shop Now</button>
            </div>
          </div>
        ))}
      </Slider>
      <div className="hero-fade-bottom"></div>
    </div>
  );
}

export default HeroBanner;