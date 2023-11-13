import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./infoStyle.scss";
import { Context } from "../../context/AppContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
const InfoSection = ({ data, banner }) => {
  const {
    setProgress,
    progress,
    workerURL,
    addToWatchList,
    removeFromWatchList,
    watchList,
  } = useContext(Context);
  const [result, setResult] = useState([]);
  const [animeData, setAnimeData] = useState(null);
  const [description, setDescription] = useState("");
  const [desc, setDesc] = useState(false);
  useEffect(() => {
    if (!data) {
      return;
    }

    setResult(data);
    setDescription(data?.description);
    setAnimeData({
      title:
        data?.title?.english ||
        data?.title?.romaji ||
        data?.title?.userPreferred ||
        data?.title?.native,
      id: parseInt(data?.id),
      image: data?.coverImage || data?.bannerImage,
      type: data?.type,
      episodes: data?.totalEpisodes,
      duration: data?.duration,
      dateAdded: Date.now(),
    });
  }, [data]);
  const isAddedToWatchList = watchList.some(
    (item) => item?.id === parseInt(data?.id)
  );

  const bgStyle = {
    backgroundImage: `url(${banner})`,
  };
  // let synonyms = result?.synonyms;

  // let shortSynonyms = synonyms?.reduce((shortest, current) => {
  //   return current.length < shortest.length ? current : shortest;
  // }, synonyms[0]);
  // const animeColor = result?.color;

  return (
    <div className={`w-full ${!result?.id ? "h-screen" : ""}`}>
      {result?.id ? (
        <>
          <div className="banner" style={bgStyle}>
            <div className="overlay"></div>
            <div className="mobileCover md:hidden w-full h-full pt-[80px]">
              <div className="coverImg aspect-[1/1.5] w-[160px] h-[240px] bg-white/10 rounded-md mx-auto ">
                <LazyLoadImage
                  effect="blur"
                  src={`${result?.coverImage}`}
                  alt=""
                  width="100%"
                  height="100%"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </div>
            <div className="header ">
              <div className="cover rounded-lg bg-white/10">
                <LazyLoadImage
                  effect="blur"
                  src={`${result?.coverImage}`}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                  width="100%"
                  height="100%"
                />
              </div>
              <div className="title">
                <h1 className="english text-3xl !leading-tight font-medium mb-1">
                  {result?.title?.english || result?.title?.romaji || " "}
                </h1>
                <h2 className="romaji italic font-normal text-white/80 tracking-wide text-base !leading-none">
                  {result?.title?.romaji || result?.title?.native || " "}
                </h2>
                <div className="btns items-center">
                  <Link id="b1" className="btn" to={`/watch/${result?.id}`}>
                    Watch Now
                  </Link>
                  <Link className="btn p-2 rounded-md">
                    {isAddedToWatchList ? (
                      <span
                        className="flex gap-1 "
                        onClick={() => removeFromWatchList(parseInt(data?.id))}
                      >
                        <AiFillHeart size={25} />
                        Added
                      </span>
                    ) : (
                      <span
                        className="flex gap-1 group"
                        onClick={() => addToWatchList(animeData)}
                      >
                        <AiOutlineHeart
                          className="text-[var(--pinkk)] brightness-110 group-hover:hidden"
                          size={25}
                        />
                        <AiFillHeart
                          className="text-[var(--pinkk)] brightness-110 hidden group-hover:block"
                          size={25}
                        />
                        Add to List
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="md:hidden w-full text-center gap-4 relative mt-[-6.3rem] my-3 flex flex-col ">
              <div className="tracking-wide font-['Poppins'] w-[90%] mx-auto flex flex-col gap-1 text-white">
                <span className="font-medium !leading-tight text-xl">
                  {result?.title?.english || result?.title?.romaji || ". . ."}
                </span>
                <span className="text-sm !leading-tight tracking-wide line-clamp-2 font-normal text-white/80 italic">
                  {result?.title?.romaji || result?.title?.native}
                </span>
              </div>

              <div className="btns flex items-center justify-center gap-3 text-center ">
                <Link
                  id="b1"
                  className="btn bg-[#bc0150] border font-medium border-[var(--pink)] text-white rounded-lg text-[16px]  w-[8rem] px-4 brightness-110 py-2 text-center tracking-wide"
                  to={`/watch/${result?.id}`}
                >
                  Watch Now
                </Link>
                <Link className="w-[8rem] bg-white/25 p-2 rounded-lg font-medium">
                  {isAddedToWatchList ? (
                    <span
                      className="flex gap-1 text-center justify-center"
                      onClick={() => removeFromWatchList(parseInt(data?.id))}
                    >
                      <AiFillHeart size={25} />
                      Added
                    </span>
                  ) : (
                    <span
                      className="flex gap-1 group"
                      onClick={() => addToWatchList(animeData)}
                    >
                      <AiOutlineHeart
                        className="text-[var(--pinkk)] brightness-110 "
                        size={25}
                      />
                      Add to List
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <div className="details">
              <div className="tab">
                <div className="md:w-[60%] lg:w-[70%] w-full py-2 lg:p-2 lg:py-5">
                  <div className="lg:hidden !leading-tight w-full px-2">
                    <div
                      onClick={() => {
                        setDesc(!desc);
                      }}
                      className={`w-full`}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: description?.substr(0, desc ? 2000 : 170),
                        }}
                        className={`italic w-full text-[#D4D4D8] font-normal tracking-wider text-sm smoothie`}
                      ></span>
                      {description?.length > 170 && (
                        <span className="text-white font-medium text-xs cursor-pointer">
                          {desc ? "" : " ...see more"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="lg:block w-full hidden text-[#D4D4D8] text-base font-normal tracking-wider">
                    <div
                      onClick={() => {
                        setDesc(!desc);
                      }}
                      className={`w-full`}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: description?.substr(0, desc ? 2000 : 330),
                        }}
                        className={`italic md:!leading-tight smoothie`}
                      ></span>
                      {description?.length > 330 && (
                        <span className="text-white font-medium cursor-pointer">
                          {desc ? " see less" : "... see more"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="info ">
                  <span className="info-item line-clamp-2 text-white/[0 text-[#D4D4D8] text-xs">
                    <span className="font-medium tracking-wide text-white   ">
                      Japanese:
                    </span>
                    {"  "}
                    {result?.title?.native || "N/A"}
                  </span>
                  <span className="info-item line-clamp-3 text-[#D4D4D8] text-xs tracking-wide">
                    <span className="font-medium text-white  ">Synonyms:</span>{" "}
                    {result?.synonyms?.slice(0, 3)?.join(" , ") || "N/A"}
                  </span>

                  <span className="info-item line-clamp-2  text-[#D4D4D8] text-xs tracking-wide">
                    <span className="font-medium  text-white  ">Type:</span>{" "}
                    {result?.type} ({result?.subOrDub || result?.format || "?"})
                  </span>
                  <span className="info-item line-clamp-2 text-[#D4D4D8] text-xs tracking-wide">
                    <span className="font-medium text-white  ">Episodes:</span>{" "}
                    {`${result?.currentEpisode}/${result?.totalEpisodes}` ||
                      "?"}
                  </span>
                  <span className="info-item line-clamp-2 text-[#D4D4D8] text-xs tracking-wide">
                    <span className="font-medium text-white  ">Season:</span>{" "}
                    {result?.season} (
                    {result?.releaseDate || result?.year || "N/A"})
                  </span>
                  <span className="info-item line-clamp-2 text-[#D4D4D8] text-xs tracking-wide">
                    <span className="font-medium text-white  ">Rating:</span>{" "}
                    {result?.rating?.anilist || "N/A"}
                  </span>
                  <span className="info-item line-clamp-2 text-[#D4D4D8] text-xs tracking-wide">
                    <span className="font-medium text-white  ">Duration:</span>{" "}
                    {result?.duration || "N/A"}
                  </span>
                  <span className="info-item line-clamp-2 text-[#D4D4D8] text-xs tracking-wide">
                    <span className="font-medium text-white  ">Status:</span>{" "}
                    {result?.status || "N/A"}
                  </span>
                  <span className="info-item text-[#D4D4D8] line-clamp-3 text-xs tracking-wide">
                    <span className="font-medium text-white  ">Genres:</span>{" "}
                    {result?.genres?.join(", ") || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-sm text-gray-400 font-medium tracking-wide font-['Poppins'] ">
            Loading...
          </span>
        </div>
      )}
    </div>
  );
};

export default InfoSection;
