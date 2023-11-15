import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { Context } from "../context/AppContext";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
} from "lucide-react";

const LatestReleases = ({ home, perPage }) => {
  const { progress, setProgress, conUrl, lrl, brl, local } =
    useContext(Context);
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);
  100;

  useEffect(() => {
    const fetcho = async () => {
      try {
        const { data } = await axios.get(
          `${brl}/recent-eps?type=anime&page=${page}&perPage=${perPage}`
        );
        const recentEpsData = removeDuplicates(data, "id");
        setResult(recentEpsData);
      } catch (error) {
        console.log(`something in yo ass hmmmmmmmmmmmmmmmmmmmmmmmmmmmmm`);
      }
    };
    fetcho();
  }, [page, perPage]);

  const handlePage = (newPage) => {
    setProgress(70);
    setResult([]);
    setPage(newPage);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
    setProgress(100);
  };
  const removeDuplicates = (array, key) => {
    const uniqueKeys = new Set();
    return array?.filter((item) => {
      if (!uniqueKeys.has(item[key])) {
        uniqueKeys.add(item[key]);
        return true;
      }
      return false;
    });
  };
  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full max-w-[1300px] 2xl:max-w-[1400px] mx-auto my-5 mb-9 lg:my-8 px-1 md:pb-3"
      >
        <Link
          to={`/latest-episodes`}
          className={`text-lg sm:text-xl lg:text-2xl font-medium lg:font-normal tracking-[0.015em] lg:tracking-normal hover:brightness-90 mb-3 md:mb-5 font-['Poppins'] items-center gap-2 flex px-1`}
        >
          <div className="h-6 md:h-8 rounded-md w-[6px] bg-[var(--pink)] "></div>
          Latest Episodes
          <span className="ml-auto md:m-0">
            <ChevronRight size={22} className={`lg:hidden`} />
            <ChevronRight size={25} className={`hidden lg:block`} />
          </span>
        </Link>
        <>
          <div
            className={`flex ${
              home ? "overflow-x-auto sm:flex-wrap" : "flex-wrap"
            } mx-auto px-1`}
          >
            {result?.length > 0 ? (
              result?.map((item) => {
                const num = Math.floor(Math.random() * 100) + 1;
                const art = item?.artwork
                  ?.slice(0, 300)
                  ?.filter((e) => e?.type === "banner");
                const banner =
                  art?.[num]?.img || item?.bannerImage || item?.coverImage;
                return (
                  <div
                    key={item?.id}
                    className={`${
                      home ? "w-[85%]" : "w-full"
                    } sm:w-[50%] md:w-[33.3%] xl:w-[25%] flex-shrink-0 p-[.3rem] mb-1 lg:mb-2 aspect-[16/8.7]`}
                  >
                    <Link
                      to={`/watch/${item?.id}?ep=${
                        item?.currentEpisode ||
                        item?.episodes?.latest?.latestEpisode
                      }`}
                      className="w-full h-full relative flex rounded-xl lg:rounded-lg aspect-video flex-col gap-2 overflow-hidden group smoothie"
                    >
                      <div className="w-full h-full bg-[var(--lightt)]">
                        <LazyLoadImage
                          effect="blur"
                          width="100%"
                          height="100%"
                          src={banner}
                          className={`h-full object-cover group-hover:scale-[1.05] group-hover:brightness-75 smoothie object-center w-full `}
                        />
                      </div>
                      <span className="absolute opacity-0 bg-white/40 backdrop-blur hover:bg-[var(--pinkk)] z-20 flex items-center justify-center p-3 xl:p-[.6rem] rounded-full shadow-black sha dow group-hover:opacity-90 smoothie top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <Play
                          size={22}
                          fill={`white`}
                          className={`brightness-200 p-0`}
                        />
                      </span>
                      <div
                        className={`absolute gap-5 items-end tracking-wide latest-releases smoothie flex w-full h-full top-0 left-0`}
                      >
                        <div className="z-10 w-full  py-2 px-3 flex justify-between gap-4 items-center">
                          <div className="flex flex-col">
                            <span
                              className={`font-medium !leading-tight tracking-wide text-sm md:text-base line-clamp-1 `}
                            >
                              {item?.title?.english ||
                                item?.title?.romaji ||
                                item?.title?.native}
                            </span>
                            <span className="text-xs px-[2px] !italic line-clamp-1 text-white/90">
                              {item?.episodes?.latest?.latestTitle}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 absolute top-0 right-0 bg-black/50 md:bg-black/60 text-white px-2 p-[.2rem] flex items-center justify-center text-center rounded-bl-lg tracking-wider brightness-200 font-semibold text-sm">
                          {item?.currentEpisode ||
                            item?.episodes?.latest?.latestEpisode}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <>
                <div
                  className={`${
                    home ? "w-[85%]" : "w-full"
                  } sm:w-[48%] md:w-[32%] xl:w-[25%] m-1 flex-shrink-0  aspect-video pulse1  bg-[var(--lightt)] rounded-xl`}
                ></div>
                <div
                  className={`${
                    home ? "w-[85%]" : "w-full"
                  } sm:w-[48%] md:w-[32%] xl:w-[24%] m-1 flex-shrink-0 aspect-video pulse3 bg-[var(--lightt)] rounded-xl`}
                ></div>
                <div className="hidden md:block w-[32%] xl:w-[24%] aspect-video pulse2 m-1 bg-[var(--lightt)] rounded-xl"></div>
                <div className="hidden xl:block w-[24%] aspect-video pulse4 m-1 bg-[var(--lightt)] rounded-xl"></div>
              </>
            )}
          </div>
          {result?.length > 0 && (
            <div
              className={`${
                home
                  ? "hidden"
                  : "mt-3 w-fit mx-auto flex rounded-lg overflow-hidden gap-[1px]"
              }`}
            >
              <button
                disabled={page === 1}
                onClick={() => handlePage(1)}
                className={`bg-[var(--lighttt)] p-2 w-[2rem]  text-sm  text-center flex items-center justify-center  ${
                  page === 1
                    ? "text-white/[0.5]"
                    : "cursor-pointer hover:bg-white/[0.15] hover:text-[var(--pinkk)]"
                }  `}
              >
                <ChevronsLeft size={22} />
              </button>
              <button
                disabled={page === 1}
                onClick={() => handlePage(Number(page) - 1)}
                className={`bg-[var(--lighttt)]  p-2 w-[2rem]  text-sm  text-center flex items-center justify-center  ${
                  page === 1
                    ? "text-white/[0.5]"
                    : "cursor-pointer hover:bg-white/[0.15] hover:text-[var(--pinkk)]"
                }  `}
              >
                <ChevronLeft size={22} />
              </button>
              <span className="bg-[var(--pink)] p-2  w-[2.5rem] flex items-center justify-center  text-[15px] text-white  ">
                {page}
              </span>
              <button
                disabled={page === 10}
                onClick={() => handlePage(Number(page) + 1)}
                className={`bg-[var(--lighttt)]  p-2  w-[2rem]  text-sm  text-center flex items-center justify-center  ${
                  page === 10
                    ? "text-white/[0.5]"
                    : "cursor-pointer hover:bg-white/[0.15] hover:text-[var(--pinkk)]"
                }  `}
              >
                <ChevronRight size={22} />
              </button>
              <button
                disabled={page === 10}
                onClick={() => handlePage(10)}
                className={`bg-[var(--lighttt)]  p-2 w-[2rem]  text-sm  text-center flex items-center justify-center  ${
                  page === 10
                    ? "text-white/[0.5]"
                    : "cursor-pointer hover:bg-white/[0.15] hover:text-[var(--pinkk)]"
                }  `}
              >
                <ChevronsRight size={22} />
              </button>
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default LatestReleases;
