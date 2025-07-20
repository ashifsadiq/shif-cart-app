import React from "react";
import Slider from "react-slick";

type PromoBanner = { id: string; image: string; title: string };

export const PromoCarousel: React.FC<{ banners: PromoBanner[] }> = ({ banners }) => (
  <div className="mt-16 mb-4">
    <Slider dots autoplay arrows={false}>
      {banners.map(banner => (
        <div key={banner.id} className="h-36 md:h-64">
          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover rounded-lg" loading="lazy" />
        </div>
      ))}
    </Slider>
  </div>
);
