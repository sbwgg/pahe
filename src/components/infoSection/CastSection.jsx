import { useState, useEffect, useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import noImage from "../../assets/noImage.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
const CastSection = ({ data }) => {
  const [item, setItem] = useState();
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    setItem([]);
    if (item?.length < 0) {
      return;
    }
    setItem(data);
  }, [data]);

  const dummys = useMemo(() => {
    let d = [];
    for (let i = 1; i < 12; i++) {
      d.push(
        <div
          key={i}
          className={`pulse${i} aspect-square overflow-hidden rounded-full bg-[var(--lightt)]`}
        ></div>
      );
    }
    return d;
  }, []);
  const breakpoints = {
    mobile: 2.7,
    tablet: 5.6,
    desktop: 8.9,
    huge: 9.8,
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
    <div className="flex flex-col gap-3 overflow-auto select-none">
      <h1 className="text-white font-['Poppins'] text-xl font-medium tracking-wide">
        Characters & Voice Actors
      </h1>
      <>
        <Swiper
          slidesPerView={perPage}
          spaceBetween={8}
          className={`w-full cursor-grab`}
        >
          {item
            ? item?.map((it, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    className="py-1 items-center gap-2 flex flex-col"
                  >
                    <LazyLoadImage
                      effect="blur"
                      width={"100px"}
                      height={"100px"}
                      src={it?.image || noImage}
                      className="w-full rounded-full h-full object-cover bg-[var(--lightt)]  brightness-90 "
                    />
                    <div className="text-center text-md leading-tight tracking-wide font-[Karla] text-white/[0.8] line-clamp-2">
                      {it?.name?.full || it?.name?.first || it?.name}
                    </div>
                    <div className="text-center text-xs tracking-wide font-[Karla] text-white/[0.7]">
                      {it?.role}
                    </div>
                  </SwiperSlide>
                );
              })
            : dummys?.map((d, index) => {
                return (
                  <SwiperSlide className="p-2 aspect-square" key={index}>
                    {d}
                  </SwiperSlide>
                );
              })}
        </Swiper>
      </>
      {/* <div className="gap-2 overflow-y-auto pl-2">
        {item?.map((it, index) => {
          return (
            <div
              key={index}
              className="flex-shrink-0  w-[120px] py-1  items-center gap-3 flex flex-col"
            >
              <LazyLoadImage
                effect="blur"
                width={"100px"}
                height={"100px"}
                src={it?.voiceActor?.image || noImage}
                className="w-full rounded-full h-full object-cover brightness-90"
              />
              <div className="text-center text-md tracking-wide font-[Karla] text-white/[0.7] line-clamp-2">
                {it?.voiceActor?.name?.full ||
                  it?.voiceActor?.name?.first }
              </div>
              <div className="text-center text-xs tracking-wide font-[Karla] text-white/[0.7]">
                {it?.role}
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default CastSection;
