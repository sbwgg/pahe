import { useState, useEffect, useContext } from "react";
import { Context } from "../context/AppContext";
import { Link } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaClosedCaptioning } from "react-icons/fa";
import { Play, TrendingUp, Volume2, VolumeX } from "lucide-react";
import { Helmet } from "react-helmet";
import axios from "axios";
import ReactPlayer from "react-player";
const Slider = ({ trendingData }) => {
  const { setProgress, local, brl } = useContext(Context);
  const [result, setResult] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    if (trendingData.length < 0) {
      return;
    }
    let match = trendingData?.[0]?.trailer?.match(/[?&]v=([^&]+)/);
    const v = match ? match[1] : null;
    const fetchV = async () => {
      const { data } = await axios.get(`${brl}/trailer/${v}`);
      setTrailer(data?.hls || data?.video);
    };
    setResult(trendingData);
    if (v !== null) {
      fetchV();
    }
  }, [trendingData]);

  const cleanDescription = (description) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = description;
    return tempElement.textContent || tempElement.innerText || "";
  };
  return (
    <div>
      <Helmet>
        <meta
          property="og:image"
          content={`${result?.[0]?.bannerImage}`}
        ></meta>
        <meta
          name="twitter:image"
          content={`${result?.[0]?.bannerImage}`}
        ></meta>
      </Helmet>
      <Swiper
        loop
        modules={[Autoplay]}
        spaceBetween={0}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className={`h-[44vh] sm:h-[77vh] z-0 lg:h-[87vh] 2xl:h-screen`}
      >
        {result?.map((item, index) => {
          return (
            <SwiperSlide key={item?.id} className={`relative`}>
              {trailer?.length > 1 ? (
                <ReactPlayer
                  url={trailer}
                  muted={muted}
                  onError={(e) => {
                    if (e?.target?.error?.code === 4 || e === "hlsError") {
                      setTrailer("");
                    }
                  }}
                  onEnded={() => setTrailer("")}
                  playing={true}
                  width={`100vw`}
                  height={`100%`}
                  style={{ objectFit: "cover" }}
                  className="absolute top-0 z-[-1] left-0 w-full h-full object-cover"
                ></ReactPlayer>
              ) : (
                <LazyLoadImage
                  alt=""
                  height="100%"
                  src={item?.bannerImage || item?.coverImage}
                  width="100%"
                  effect="blur"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              )}
              <div className="op-layer-hero"></div>
              {trailer?.length > 0 ? (
                <button
                  onClick={() => setMuted(!muted)}
                  className="absolute right-2 sm:right-6 bottom-4 z-20 p-2 bg-white/20 hover:bg-white/25 active:!scale-95 rounded-full overflow-hidden "
                >
                  {muted ? (
                    <VolumeX strokeWidth={1.7} size={20} />
                  ) : (
                    <Volume2 strokeWidth={1.7} size={20} />
                  )}
                </button>
              ) : (
                ""
              )}
              <div className="slide-details  w-[77%] lg:w-[45%] tracking-wide z-10 absolute flex flex-col gap-3 md:gap-6 bottom-[6%] md:bottom-[10%] left-[5%] lg:left-[8%] ">
                <div className="flex flex-col gap-2 md:gap-3 ">
                  <span className="text-[var(--pinkk)] mb-[2px] tracking-wider text-sm md:text-base font-semibold brightness-125 ">
                    #{index + 1} Spotlight
                  </span>
                  <span className="title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-['Montserrat'] leading-[1.2em] font-semibold line-clamp-2">
                    {item?.title?.english || item?.title?.romaji}
                  </span>
                  <span className="review text-xs md:text-sm text-white/90 md:text-white flex items-center gap-3 md:gap-4">
                    {item?.rating && (
                      <span className="flex items-center gap-1 text-green-400">
                        <TrendingUp size={17} />
                        {item?.rating?.anilist ||
                          item?.averageRating ||
                          item?.rating?.kitsu}
                      </span>
                    )}
                    <span className="movie flex items-center ">
                      {item?.type || item?.format || ""}
                    </span>
                    <span className="">{item?.status}</span>
                    {item?.releaseDate || item?.year ? (
                      <span className="hidden sm:block">
                        {item?.releaseDate || item?.year}
                      </span>
                    ) : (
                      ""
                    )}

                    <span className="cc flex gap-[3px] items-center">
                      <FaClosedCaptioning size={15} />
                      <span>
                        {item?.currentEpisode || item?.totalEpisodes || "?"}
                      </span>
                    </span>
                    {item?.duration && <span>{item?.duration}min</span>}
                  </span>
                  <span className="slide-desc leading-tight">
                    {cleanDescription(item?.description)}
                  </span>
                </div>
                <span className="slide-btns tracking-wide flex gap-2 sm:gap-3">
                  <Link
                    to={`/watch/${item?.id}`}
                    onClick={() => setProgress(30)}
                    className="flex gap-1 md:w-[9.7rem] text-sm md:text-base font-medium items-center justify-center py-[7px] px-[15px] md:py-[10px] md:px-4 bg-[var(--pink)] hover:brightness-[.85] rounded-full md:rounded-lg smoothie"
                  >
                    <Play size={17} fill={`white`} />
                    Watch Now
                  </Link>
                  <Link
                    className="flex gap-2 md:w-[9.7rem] text-sm md:text-base font-medium items-center justify-center py-[7px] px-[15px] md:py-[10px] md:px-4 bg-white/20 hover:bg-white/10 rounded-full md:rounded-lg smoothie"
                    to={`/anime/${item?.id}`}
                  >
                    <BsInfoCircleFill size={17} className={`text-white/90`} />
                    <span className="hidden sm:block">View</span> Details
                  </Link>
                </span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Slider;
