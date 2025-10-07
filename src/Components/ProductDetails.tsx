// src/components/ProductDetails.tsx
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";

type ProductDetailsParams = {
  id: string;
  category: string;
};
type ProductDetailsType = {
  slug: string;
  imageCover: string;
  title: string;
  images: string[];
  description: string;
  price: number | string;
  ratingsAverage: number;
  brand: { name: string };
};

export default function ProductDetails() {
  const { id, category } = useParams<ProductDetailsParams>();
  const [productDetails, setProductDetails] =
    useState<ProductDetailsType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { t } = useTranslation();
  const mainSliderRef = useRef<any>(null);
  const thumbSliderRef = useRef<any>(null);
  const navigate = useNavigate();
  const [cartBtnLoading, setCartBtnLoading] = useState(false);
  const [favBtnLoading, setFavBtnLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const settings = {
    arrows: true,
    dots: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    className: "center",
    infinite: true,
    centerPadding: "60px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: function (index: number) {
      console.log(
        `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
      );
    },
    // small padding inside slides handled via responsive wrapper classes (p-2 / p-3)
    responsive: [
      // extra-large desktops
      { breakpoint: 1600, settings: { slidesToShow: 5, slidesToScroll: 1 } },
      { breakpoint: 1536, settings: { slidesToShow: 5, slidesToScroll: 1 } }, // 2xl
      // xl screens
      { breakpoint: 1280, settings: { slidesToShow: 5, slidesToScroll: 1 } }, // xl
      // large / desktop
      { breakpoint: 1100, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } }, // lg
      // medium (tablet)
      { breakpoint: 900, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } }, // md
      // small (large phones)
      { breakpoint: 640, settings: { slidesToShow: 2, slidesToScroll: 1 } }, // sm
      // tiny phones
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 380, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const settingsMain = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 450,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const settingsThumbs = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    focusOnSelect: true,
    responsive: [
      { breakpoint: 640, settings: { slidesToShow: 4 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } },
    ],
  };

  function checkUserToken() {
    // if not loggind
    if (!localStorage.getItem("userToken")) {
      Swal.fire({
        icon: "error",
        title: `${t("uhave2beloggind")}`,
        confirmButtonText: `${t("gologin")}`,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return false;
    }
    return true;
  }
  function sendAlert(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: `${document.body.dir === 'ltr' ? "top-start":"top-end"}`,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: message,
    });
  }
  function getProductDetails(productId: string) {
    axios
      .get(`https://ecommerce.routemisr.com/api/v1/products/${productId}`)
      .then(({ data }) => {
        setProductDetails(data.data);
        console.log(data.data);
      })
      .catch((response) => {
        console.log("error while getting details", response);
      });
  }
  function getRelatedProducts(category: string) {
    axios
      .get("https://ecommerce.routemisr.com/api/v1/products")
      .then(({ data }) => {
        console.log(data.data);
        let rel = data.data?.filter(
          (product: { category: { name: string } }) =>
            product.category.name === category
        );
        setRelatedProducts(rel);
        console.log(rel);
      })
      .catch((response) => {
        console.log(response);
      });
  }
  function addToCart(productId: string) {
    // if not loggind
    if (!checkUserToken()) return;
    setCartBtnLoading(true);
    const userToken = localStorage.getItem("userToken") || "";
    axios
      .post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId },
        { headers: { token: userToken } }
      )
      .then(({ data }) => {
        console.log(data);
        setCartBtnLoading(false);
        sendAlert(`${t("addedtocart")}`);
      })
      .catch((response) => {
        console.log(response);
      });
  }
  function toggleFav(productId:string){
    if (!checkUserToken()) return;
    // setFavBtnLoading(true);
    const userToken = localStorage.getItem("userToken") || "";
    console.log(userToken);    
    isFav ? removefromWishList(userToken , productId) : addToWishList(userToken , productId)
  }
  function addToWishList( userToken:string , productId: string) {
    setIsFav(true)
    axios
      .post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        { headers: { token: userToken } }
      )
      .then(({ data }) => {
        setFavBtnLoading(false);
        sendAlert(t("addedtofav"));
      })
      .catch((response) => {
        console.log(response);
      });
  }
  function removefromWishList(userToken:string , productId:string){
    setIsFav(false)
    axios
    .delete(
      `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
      { headers: { token: userToken } }
    )
    .then(({ data }) => {
      setFavBtnLoading(false);
      sendAlert(t("rmfromfav"));
    })
    .catch((response) => {
      console.log(response);
    });
  }
  function checkIfFav(){
    if (!checkUserToken()) return;
    const userToken = localStorage.getItem("userToken") || "";
    axios.get('https://ecommerce.routemisr.com/api/v1/wishlist' , { headers: { token: userToken } })
    .then(({data}) =>{
        console.log(data);   
        data.data.forEach((product:{_id:string}) => {
            if(product._id === id){
                setIsFav(true)
                return;
            }                
        });    
    })
    .catch((response) =>{
        console.log(response);        
    })
  }

  useEffect(() => {
    if (id && !productDetails) getProductDetails(id);
    if (category && !relatedProducts.length) getRelatedProducts(category);
    checkIfFav()
  }, [id, category]);

  if (!productDetails) {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* LEFT: Image skeleton */}
              <div className="md:w-1/2 p-6 md:p-8 bg-slate-50">
                <div className="rounded-xl overflow-hidden shadow-inner">
                  <div className="flex items-center justify-center bg-white h-[420px] md:h-[520px]">
                    <Skeleton
                      height="100%"
                      width="100%"
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[84px] h-[64px] rounded-lg overflow-hidden border border-slate-200 bg-white"
                      >
                        <Skeleton height="100%" width="100%" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Details skeleton */}
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <Skeleton height={28} width="70%" />
                  </div>

                  <div className="mb-3">
                    <Skeleton height={18} width="40%" />
                  </div>

                  <div className="mt-6">
                    <Skeleton height={28} width="30%" />
                    <div className="mt-3">
                      <Skeleton count={3} />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Skeleton width={140} height={36} />
                    <Skeleton width={160} height={36} />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Skeleton width="60%" height={48} />
                  <Skeleton width="30%" height={48} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const images =
    productDetails.images && productDetails.images.length
      ? productDetails.images
      : [productDetails.imageCover];

  return (
    <>
      <div className="py-10 px-4 mt-4 sm:mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="sm:flex">
              {/* LEFT: Side */}
              <div className="sm:w-1/2 lg:w-1/3 p-6 md:p-8 bg-slate-50">
                <div className="rounded-xl overflow-hidden shadow-inner">
                  <Slider
                    {...settingsMain}
                    ref={(c) => {
                      mainSliderRef.current = c;
                    }}
                  >
                    {images.map((url, idx) => (
                      <div
                        key={`main-${idx}`}
                        className="flex items-center overflow-hidden bg-white justify-center h-[30rem] md:h-[35rem]"
                      >
                        <img
                          src={url}
                          alt={`${productDetails.slug}-${idx}`}
                          className=" h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </Slider>
                </div>

                {/* thumbnails */}
                <div className="mt-4">
                  <Slider
                    {...settingsThumbs}
                    ref={(c) => {
                      thumbSliderRef.current = c;
                    }}
                  >
                    {images.map((url, idx) => (
                      <button
                        key={`thumb-${idx}`}
                        aria-label={`Go to image ${idx + 1}`}
                        onClick={() => mainSliderRef.current?.slickGoTo(idx)}
                        className="px-1 focus:outline-none"
                      >
                        <div className="w-[84px] h-[64px] rounded-lg overflow-hidden border border-slate-200 bg-white hover:shadow-md transition-all">
                          <img
                            src={url}
                            alt={`thumb-${idx}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </button>
                    ))}
                  </Slider>
                </div>
              </div>

              {/* RIGHT Side */}
              <div className="sm:w-1/2 lg:w-2/3 p-6 md:p-10 flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {productDetails.title}
                  </h1>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      <i className="fas fa-tag text-slate-500" />
                      <span>{productDetails.brand.name}</span>
                    </span>
                    {/* reting with stars  */}
                    <span>
                      {Array.from({ length: 5 }).map((_, idx) => {
                        return (
                          <>
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-2 ${
                                idx + 1 < productDetails.ratingsAverage
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              } font-semibold text-sm`}
                            >
                              <i className="fas fa-star" />
                            </span>
                          </>
                        );
                      })}
                      <span className="mx-2">
                        {productDetails.ratingsAverage}
                      </span>
                    </span>
                  </div>

                  <div className="mt-6 flex items-baseline gap-4">
                    <div className="text-3xl sm:text-4xl font-extrabold text-blue-800">
                      {productDetails.price}{" "}
                      <span className="text-sm xl:text-lg text-slate-500">
                        {t("productsPage.currency")}
                      </span>
                    </div>
                  </div>

                  <p className="mt-6 text-slate-700 leading-relaxed">
                    {productDetails.description}
                  </p>

                  {/* info badges */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm flex items-center gap-2 shadow-sm">
                      <i className="fas fa-truck text-slate-500" />
                      <span>
                        {t("productsPage.free_shipping") ?? "Free shipping"}
                      </span>
                    </div>
                    <div className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm flex items-center gap-2 shadow-sm">
                      <i className="fas fa-shield-alt text-slate-500" />
                      <span>
                        {t("productsPage.warranty") ?? "1 year warranty"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* actions */}
                <div className="mt-6 flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() => id && addToCart(id)}
                    className="w-full cursor-pointer sm:w-auto flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition transform hover:-translate-y-0.5 shadow-lg"
                  >
                    {cartBtnLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        <i className="fas fa-shopping-bag mr-2" />
                        {t("productsPage.add_to_cart") ?? "Add to cart"}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => id && toggleFav(id)}
                    className="w-full cursor-pointer sm:w-auto px-6 py-3 border-2 border-slate-200 rounded-xl font-semibold text-slate-800 hover:bg-slate-100 transition"
                  >
                    {favBtnLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        <i className={`fas fa-heart mr-2 text-${isFav?'rose':'slate'}-600`} />                        
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx- py-10  lg:mx-auto">
        <h1 className="text-lg sm:text-2xl lg:text-3xl  font-semibold text-slate-800">
          {t("suggetion")}
        </h1>
        {relatedProducts && (
          <div className="slider-container group relative mt-5 sm:mt-10 cursor-pointer">
            <Slider {...settings}>
              {relatedProducts.length
                ? relatedProducts.map(
                    (
                      product: {
                        id: string;
                        title: string;
                        slug: string;
                        imageCover: string;
                        ratingsAverage: string;
                        price: string;
                      },
                      idx
                    ) => (
                      <div key={product.id || idx} className="p-3">
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group/card">
                          <div className="relative w-full h-[16rem] overflow-hidden">
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
                      </div>
                    )
                  )
                : // ✅ لف السكلتون بنفس structure الـ slide
                  Array.from({ length: 10 }).map((_, idx) => (
                    <div key={idx} className="p-3">
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

            <div className="absolute flex text-sm sm:text-md 2xl:text-lg -bottom-10 left-1/2 transform -translate-x-1/2 items-center gap-2 text-slate-500">
              <span className="animate-bounce">←</span>
              <span>{t("scroll for more")}</span>
              <span className="animate-bounce">→</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="hidden md:block  absolute -right-10 top-1/2 -translate-y-1/2 z-30 bg-slate-800  hover:bg-slate-950 text-slate-50 py-2 px-3 rounded-2xl cursor-pointer shadow-lg transition"
    >
      <i className="fas fa-chevron-right text-xs"></i>
    </div>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="hidden md:block  absolute -left-10 top-1/2 -translate-y-1/2 z-30 bg-slate-800  hover:bg-slate-950 text-slate-50 py-2 px-3 rounded-2xl cursor-pointer shadow-lg transition"
    >
      <i className="fas fa-chevron-left text-xs"></i>
    </div>
  );
}
