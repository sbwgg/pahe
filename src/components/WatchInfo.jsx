import axios from "axios";
import { Bookmark, Share2 } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { Link, useParams } from "react-router-dom";
import hainn from "../assets/wathcGirl.png";
import { Context } from "../context/AppContext";
import Caraousel from "./Caraousel";

const WatchInfo = ({ resultData }) => {
  const [showMore, setShowMore] = useState(false);
  const [animeData, setAnimeData] = useState(null);
  const [related, setRelated] = useState(null);
  const [info, setInfo] = useState(null);
  const [copy, setCopy] = useState(false);
  const params = useParams();
  const { watchList, addToWatchList, lrl, removeFromWatchList } =
    useContext(Context);
  useEffect(() => {
    if (resultData === null) {
      return;
    }
    setInfo(null);
    setInfo(resultData);
    setAnimeData({
      title:
        resultData?.title?.english ||
        resultData?.title?.romaji ||
        resultData?.title?.userPreferred ||
        resultData?.title?.native,
      id: parseInt(resultData?.id),
      image: resultData?.coverImage || resultData?.bannerImage,
      type: resultData?.type,
      episodes: resultData?.totalEpisodes,
      duration: resultData?.duration,
      dateAdded: Date.now(),
    });
  }, [resultData]);
  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const { data } = await axios.get(
          `${lrl}/relations/${params.id}?type=anime`
        );
        setRelated(data?.slice(0, 30));
      } catch (error) {
        console.log("hmmm");
      }
    };
    fetchRelations();
  }, [params.id]);
  const isAddedToWatchList = watchList.some(
    (item) => item?.id === parseInt(info?.id)
  );
  useEffect(() => {
    if (copy) {
      setTimeout(() => {
        setCopy(false);
      }, 4000);
    }
  }, [copy]);
  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className="INFO flex md:px-4 w-full lg:w-[70%] h-fit">
          <div className="p-3 md:pl-1 flex md:flex-row gap-4 md:gap-5 w-full rounded-lg">
            <div className="cover aspect-[1/1.5] h-fit w-[80px] md:w-[140px] relative flex-shrink-0 mx-auto sm:m-0 overflow-hidden rounded-md bg-[var(--light)] ">
              <LazyLoadImage
                effect="blur"
                src={`${info?.coverImage || info?.bannerImage}`}
                alt=""
                width={`100%`}
                height={`100%`}
                className="w-full flex-shrink-0 h-full scale-125 md:scale-100 object-cover"
              />
            </div>
            {info ? (
              <div className="flex flex-col gap-3 md:gap-5 flex-grow">
                <div className="flex relative justify-between gap-2">
                  <Link
                    className="font-medium text-lg flex flex-col gap-1 "
                    to={`/anime/${info?.id}`}
                  >
                    <span className="!line-clamp-2 tracking-wide !leading-snug font-['Poppins'] ">
                      {info?.title?.english ||
                        info?.title?.userPreffered ||
                        info?.title?.romaji ||
                        info?.title?.native}
                    </span>
                    <div className="flex flex-wrap gap-1 tracking-wider text-xs font-normal items-center text-white/90">
                      <span
                        className={`py-0 px-1 w-fit hidden sm:flex rounded`}
                      >
                        {info?.format || info?.type || "?"}
                      </span>
                      <span className=" hidden sm:flex">{"•"}</span>
                      <span>{info?.year}</span>
                      <span>{"•"}</span>
                      <span className={`py-0 px-1 w-fit  rounded`}>
                        {info?.currentEpisode || info?.totalEpisodes || "?"}{" "}
                        episodes
                      </span>
                      <span>{"•"}</span>
                      <span className={`py-0 px-1 w-fit  rounded`}>
                        {info?.duration || "?"}min
                      </span>
                    </div>
                  </Link>
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          window.location.href
                        );
                        setCopy(true);
                      }}
                      className="h-fit relative active:text-[var(--pink)]"
                    >
                      <div
                        className={`absolute -top-[170%] smoothie left-1/2 -translate-x-1/2 bg-white/50 backdrop-blur rounded-lg p-2 py-1 ${
                          !copy ? "hidden" : ""
                        }`}
                      >
                        Copied!
                      </div>
                      <Share2 size={21} />
                    </button>
                    {isAddedToWatchList ? (
                      <button
                        className="h-fit active:text-[var(--pink)]"
                        onClick={() => removeFromWatchList(Number(info?.id))}
                      >
                        <Bookmark size={22} fill={`white`} />
                      </button>
                    ) : (
                      <button
                        className="h-fit active:text-[var(--pink)]"
                        onClick={() => addToWatchList(animeData)}
                      >
                        <Bookmark size={22} />
                      </button>
                    )}
                  </div>
                </div>
                <div
                  onClick={() => setShowMore(!showMore)}
                  className={`!tracking-wide flex flex-col`}
                >
                  <div
                    onClick={() => {
                      setShowMore(!showMore);
                    }}
                    className={`lg:hidden !leading-tight w-full`}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: info?.description?.substr(
                          0,
                          showMore ? 2000 : 100
                        ),
                      }}
                      className={`italic w-full text-[#D4D4D8] font-normal tracking-wider text-xs smoothie`}
                    ></span>
                    {info?.description?.length > 100 && (
                      <span className="text-white font-medium text-xs cursor-pointer">
                        {showMore ? "  see less" : " ...see more"}
                      </span>
                    )}
                  </div>
                  <div
                    onClick={() => {
                      setShowMore(!showMore);
                    }}
                    className={`lg:block w-full hidden text-[#D4D4D8] text-sm font-normal tracking-wider`}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: info?.description?.substr(
                          0,
                          showMore ? 2000 : 330
                        ),
                      }}
                      className={`italic md:!leading-tight smoothie`}
                    ></span>
                    {info?.description?.length > 330 && (
                      <span className="text-white font-medium cursor-pointer">
                        {showMore ? " see less" : "... see more"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex sm:hidden flex-wrap gap-3 mt-auto">
                  {info &&
                    info?.genres?.slice(0, 3)?.map((g) => {
                      return (
                        <span
                          key={g}
                          className={`!px-2 py-1 !w-auto text-center text-sm text-white/90 font-normal ring-1 ring-[var(--pink)] rounded-md`}
                        >
                          {g}
                        </span>
                      );
                    })}
                </div>
                <div className="hidden sm:flex flex-wrap gap-3 mt-auto">
                  {info &&
                    info?.genres?.slice(0, 5)?.map((g) => {
                      return (
                        <span
                          key={g}
                          className={`!px-2 py-1 !w-auto text-center text-sm text-white/90 font-normal ring-1 ring-[var(--pink)] rounded-md`}
                        >
                          {g}
                        </span>
                      );
                    })}
                </div>
              </div>
            ) : (
              <p className="text-white/50 h-full text-center px-4">
                Loading...
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-[30%] p-2 my-8 lg:mt-0 gap-3 flex-grow rounded justify-center">
          <div className="text-lg font-medium tracking-[0.015em] font-['Poppins'] items-center gap-2 flex md:px-2 lg:px-0">
            <div className="lg:hiddden h-6 rounded-md w-[.38rem] bg-[var(--pink)]"></div>
            Related Anime
          </div>
          <div className="flex flex-col md:px-3 lg:p-0 gap-2 max-h-[460px] lg:max-h-[180px] overflow-auto">
            {related?.length > 0 ? (
              related?.slice(0, 33)?.map((item) => {
                return (
                  <Link
                    key={item?.id}
                    to={`/anime/${item?.id}`}
                    className="flex gap-1 flex-shrink-0 h-[85px] bg-[var(--lightt)] lg:bg-[var(--light)] rounded-lg overflow-hidden hover:brightness-[.8] hover:scale-[.98] smoothie"
                  >
                    <div className="h-full aspect-[1/1.35] flex-shrink-0 bg-white/5 rounded-md overflow-hidden">
                      <LazyLoadImage
                        // src={`https://image.tmdb.org/t/p/original/aGKZirZsUhyhnLG4nNwHGvNcuZ0.jpg`}
                        src={item?.coverImage}
                        alt=""
                        effect="blur"
                        width="100%"
                        height="100%"
                        className={`brightness-90 scale-110 sm:brightness-100 h-full w-full object-cover rounded-md`}
                      />
                    </div>
                    <div className="flex flex-col flex-grow gap-1 justifsy-center items-center p-2  ">
                      <div className="w-full tracking-wide !leading-snug text-[.92rem] text-white/90 font-medium line-clamp-2">
                        {item?.title?.english ||
                          item?.title?.romaji ||
                          item?.title?.native}
                      </div>
                      <div className="w-full flex flex-wrap text-xs text-white/60 items-center gap-2">
                        <span className="text-white/60 ">{item?.format}</span>

                        {item?.relationType && (
                          <>
                            <span> • </span>
                            <span className="text-white/60 ">
                              {item?.relationType}
                            </span>
                          </>
                        )}
                        {item?.season && (
                          <>
                            <span> • </span>
                            <span className="text-white/60 ">
                              {item?.season}
                            </span>
                          </>
                        )}
                        {item?.year && (
                          <>
                            <span> • </span>
                            <span className="text-white/60 ">{item?.year}</span>
                          </>
                        )}
                      </div>
                      {/* <span
                        className="text-xs w-full tracking-wider mt-1 !leading-tight !italic line-clamp-2 text-white/60"
                        dangerouslySetInnerHTML={{
                          __html: item?.description,
                        }}
                      ></span> */}
                    </div>
                  </Link>
                );
              })
            ) : (
              <>
                <div className="flex pulse1 flex-shrink-0 h-[85px] bg-[var(--lightt)] lg:bg-[var(--light)] rounded-md overflow-hidden "></div>
                <div className="flex pulse1 flex-shrink-0 h-[85px] bg-[var(--lightt)] lg:bg-[var(--light)] rounded-md overflow-hidden "></div>
                <div className="flex pulse1 flex-shrink-0 h-[85px] bg-[var(--lightt)] lg:bg-[var(--light)] rounded-md overflow-hidden "></div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchInfo;
