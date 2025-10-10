import Slider from "react-slick";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow({ onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="hidden md:flex items-center justify-center absolute -right-8 top-1/2 -translate-y-1/2 z-30 bg-slate-800 hover:bg-slate-950 text-white w-10 h-10 rounded-full cursor-pointer shadow-lg transition"
    >
      <i className="fas fa-chevron-right text-sm"></i>
    </div>
  );
}

function PrevArrow({ onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="hidden md:flex items-center justify-center absolute -left-8 top-1/2 -translate-y-1/2 z-30 bg-slate-800 hover:bg-slate-950 text-white w-10 h-10 rounded-full cursor-pointer shadow-lg transition"
    >
      <i className="fas fa-chevron-left text-sm"></i>
    </div>
  );
}
type ProductSliderType = {
    products: any[],
    setter: (val:any) => void,
}
const ProductsSlider = ({ products , setter }: ProductSliderType) => {
  const settings = {
    mobileFirst: true,
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchMove: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1600, settings: { slidesToShow: 5 } },
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } },
    ],
  };
  function handleSetter(productId:string){
    const id = window.location.pathname.split("/").pop();
    if (id === productId) return 
    setter(null)
  }
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
  }, []);

  return (
    <div className="relative w-full overflow-hidden px-4 sm:px-8">
      <Slider key={window.innerWidth} {...settings}>
        {products.length
          ? products.map((product, idx) => (
              <div key={product.id || idx} className="px-2">
                <Link to={`/productdetails/${product?.category?.name}/${product?.id}`}>
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group/card">
                    <div onClick={() => handleSetter(product.id)} className="relative w-full h-[16rem] overflow-hidden">
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
                  </div>
                </Link>
              </div>
            ))
          : Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="px-2">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden p-4">
                  <div className="h-[16rem]">
                    <Skeleton height={"100%"} className="rounded-xl" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton height={18} />
                    <Skeleton height={18} />
                    <Skeleton height={18} />
                  </div>
                </div>
              </div>
            ))}
      </Slider>
    </div>
  );
};

export default ProductsSlider;
