// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-slate-800 hover:bg-slate-950 text-white w-10 h-10 rounded-full cursor-pointer shadow-lg transition"
    >
      <i className="fas fa-chevron-right text-sm"></i>
    </div>
  );
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-slate-800 hover:bg-slate-950 text-white w-10 h-10 rounded-full cursor-pointer shadow-lg transition"
    >
      <i className="fas fa-chevron-left text-sm"></i>
    </div>
  );
}

type ProductSliderType = {
  products: any[];
  setter: (val: any) => void;
};

const ProductsSlider = ({ products, setter }: ProductSliderType) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const handleSetter = (productId: string) => {
    const id = window.location.pathname.split("/").pop();
    if (id === productId) return;
    setter(null);
  };

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, []);

  return (
    <div className="relative w-full overflow-hidden px-4 sm:px-8">
      {/* Custom Arrows */}
      <div ref={prevRef}>
        <PrevArrow />
      </div>
      <div ref={nextRef}>
        <NextArrow />
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        loop={true}
        slidesPerView={5}
        spaceBetween={16}
        centeredSlides={false}
        breakpoints={{
          1400: { slidesPerView: 5 },
          1042: { slidesPerView: 4 },
          720: { slidesPerView: 3 },
          480: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
        style={{
          paddingInline: "0px",
        }}
      >
        {products.length
          ? products.map((product, idx) => (
              <SwiperSlide className="flex" key={product.id || idx}>
                <div className="flex justify-center rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group/card">
                  <div className="max-w-[300px] w-full">
                    <Link
                      to={`/productdetails/${product?.category?.name}/${product?.id}`}
                    >
                      {/* ✅ Responsive image height using Tailwind breakpoints */}
                      <div
                        onClick={() => handleSetter(product.id)}
                        className="relative w-full h-[20rem] overflow-hidden"
                      >
                        <img
                          src={product.imageCover}
                          alt={product.slug}
                          className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-4 sm:p-5 bg-slate-50 text-slate-800">
                        <h4 className="font-semibold text-sm sm:text-md 2xl:text-lg truncate">
                          {product.title
                            .trim()
                            .split(/\s+/)
                            .slice(0, 3)
                            .join(" ")}
                        </h4>

                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mt-2">
                          <span className="text-slate-600 font-semibold text-xs md:text-sm 2xl:text-md">
                            {product.price} EGP
                          </span>
                          <span className="flex items-center gap-1 text-xs md:text-sm 2xl:text-md text-yellow-500 font-medium">
                            {product.ratingsAverage}
                            <i className="fas fa-star"></i>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))
          : Array.from({ length: 10 }).map((_, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden p-4">
                  <div className="h-[18rem] sm:h-[18rem] md:h-[16rem]">
                    <Skeleton height={"100%"} className="rounded-xl" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton height={18} />
                    <Skeleton height={18} />
                    <Skeleton height={18} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default ProductsSlider;
