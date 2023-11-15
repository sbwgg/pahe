import React, { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../context/AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ChevronRight, Heart } from "lucide-react";
const Caraousel = ({ data, title, clas, from }) => {
  const { progress, addToWatchList, removeFromWatchList, watchList } =
    useContext(Context);
  const [result, setResult] = useState([]);
  const [heading, setHeading] = useState("");
  const [classs, setClasss] = useState("");
  const [perPage, setPerPage] = useState(3);

  const containerRef = useRef(null);

  useEffect(() => {
    setResult(data);
    setHeading(title);
    setClasss(clas);
  }, [data, title, clas]);

  const breakpoints = {
    mobile: 3.5,
    tablet: 5.8,
    desktop: 6.8,
    huge: 7.7,
  };
  const updatePerPage = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 640) {
      // setMobileView(true);
      setPerPage(breakpoints.mobile);
    } else if (screenWidth < 1024) {
      // setMobileView(false);
      setPerPage(breakpoints.tablet);
    } else if (screenWidth < 1536) {
      // setMobileView(false);
      setPerPage(breakpoints.desktop);
    } else {
      // setMobileView(false);
      setPerPage(breakpoints.huge);
    }
  };

  useEffect(() => {
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => {
      window.removeEventListener("resize", updatePerPage);
    };
  }, []);

  return (
    <>
      <div
        className={`relative flex flex-col gap-4 md:gap-5 w-full max-w-[1300px] 2xl:max-w-[1400px] z-20 mx-auto my-5 mb-9 lg:my-8 lg:mb-12 `}
      >
        <div className="text-lg sm:text-xl lg:text-2xl font-medium lg:font-normal tracking-[0.015em] lg:tracking-normal 2xl:text-[1.6rem] font-['Poppins'] items-center gap-2 flex px-2 ">
          <div className="h-6 md:h-8 rounded-md w-[6px] bg-[var(--pink)] "></div>
          {heading}
          <span className="ml-auto md:m-0">
            <ChevronRight size={22} className={`lg:hidden`} />
            <ChevronRight size={25} className={`hidden lg:block`} />
          </span>
        </div>
        <div className="w-full pl-3 sm:pl-4 ">
          <Swiper
            slidesPerView={perPage}
            spaceBetween={8}
            navigation
            freeMode={true}
            modules={[FreeMode, Navigation]}
            className={`mySwiper ${classs}`}
          >
            {result?.length > 0 ? (
              result?.map((item, index) => {
                const isAddedToWatchList = watchList.some(
                  (i) => i?.id === parseInt(item?.id)
                );
                return (
                  <SwiperSlide className="h-auto group" key={index}>
                    <Link
                      to={`/anime/${item?.id}`}
                      className="h-full relative flex flex-col gap-2 rounded-lg overflow-hidden smoothie"
                    >
                      <div className="aspect-[1/1.5] xl:aspect-[1/1.45] w-full xl:h-full rounded-md overflow-hidden bg-[var(--lightt)]">
                        <LazyLoadImage
                          effect="blur"
                          width="100%"
                          height="100%"
                          src={item?.coverImage || item?.bannerImage}
                          className={`h-full object-cover lg:group-hover:scale-[1.03] smoothie object-center w-full `}
                        />
                      </div>
                      <div
                        className={`absolute gap-1 p-2 flex-col items-center justify-end bg-gradient-to-t tracking-wide from-[#000000c2] hidden opacity-0 group-hover:opacity-100 smoothie xl:flex w-full h-full top-0 left-0 `}
                      >
                        <div className="text-xs text-white/80 flex flex-wrap items-center justify-center gap-[.3rem]">
                          <span className="uppercase">
                            {item?.format || item?.type}
                          </span>
                          {"•"}
                          <span>{item?.status}</span>
                          {"•"}
                          <span>
                            Ep:{" "}
                            {item?.currentEpisode || item?.totalEpisodes || "?"}
                          </span>
                        </div>
                        <div className="text-center w-full !leading-tight font-medium text-base line-clamp-2">
                          {item?.title?.english ||
                            item?.title?.romaji ||
                            item?.title?.native}
                        </div>
                      </div>
                      {/* FOR MOBILE */}
                      <div
                        className={`h-[20%] flex-grow xl:hidden flex flex-col gap-1`}
                      >
                        {/* <div className="text-xs text-white/80 flex gap-[.3rem] ">
                          <span>{item?.format || item?.type}</span>
                          {"•"}
                          <span>{item?.duration + "min"}</span>
                          <span className="ml-auto">
                            Ep-
                            {item?.currentEpisodes ||
                              item?.totalEpisodes ||
                              "?"}
                          </span>
                        </div> */}
                        <div className="line-clamp-2 font-['Poppins'] tracking-wide flex-shrink-0 !leading-snug text-xs md:text-base font-medium">
                          {item?.title?.english}
                        </div>
                      </div>
                    </Link>
                    <div className="absolute smoothie hidden lg:flex items-center justify-center top-1 right-1 bg-black/50 p-[.3rem] opacity-0 group-hover:opacity-100 rounded-lg cursor-pointer">
                      <Heart
                        size={19}
                        color={`whitesmoke`}
                        className={`${
                          isAddedToWatchList && "hidden"
                        } smoothie `}
                        onClick={() =>
                          addToWatchList({
                            title:
                              item?.title?.english ||
                              data?.title?.romaji ||
                              data?.title?.userPreferred ||
                              data?.title?.native,
                            id: parseInt(item?.id),
                            image: item?.coverImage || item?.bannerImage,
                            type: item?.type,
                            episodes: item?.totalEpisodes,
                            duration: item?.duration,
                            dateAdded: Date.now(),
                          })
                        }
                      />
                      <Heart
                        size={19}
                        fill={"var(--pinkk)"}
                        color={`var(--pinkk)`}
                        className={`${
                          !isAddedToWatchList && "hidden"
                        } smoothie`}
                        onClick={() => removeFromWatchList(parseInt(item?.id))}
                      />
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <>
                <SwiperSlide className="aspect-[1/1.5] pulse1 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
                <SwiperSlide className="aspect-[1/1.5] pulse2 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
                <SwiperSlide className="aspect-[1/1.5] pulse3 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
                <SwiperSlide className="aspect-[1/1.5] pulse4 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
                <SwiperSlide className="aspect-[1/1.5] pulse5 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
                <SwiperSlide className="aspect-[1/1.5] pulse6 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
                <SwiperSlide className="aspect-[1/1.5] pulse7 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
                <SwiperSlide className="aspect-[1/1.5] pulse8 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
                <SwiperSlide className="aspect-[1/1.5] pulse9 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
                <SwiperSlide className="aspect-[1/1.5] pulse10 bg-[var(--lightt)] rounded-md overflow-hidden"></SwiperSlide>
              </>
            )}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Caraousel;
