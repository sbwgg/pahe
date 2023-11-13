import React, { useEffect, useMemo, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaCirclePlay } from "react-icons/fa6";
import { useState } from "react";
import { RefreshCw, Search, SortAsc, SortDesc } from "lucide-react";
import axios from "axios";
import { Context } from "../context/AppContext";
import { useContext } from "react";
import { Helmet } from "react-helmet";
const EpisodeCardSection = ({
  data,
  id,
  title,
  media,
  selectedEp,
  provider,
  banner,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [episodesData, setEpisodesData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [epCovers, setEpCovers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { setCover, lrl, local, workerURL } = useContext(Context);
  const [view, setView] = useState(false);
  const navigate = useNavigate();
  const episodeRef = useRef(null);
  const episodes = useMemo(() => {
    return episodesData?.filter((item) =>
      item?.number?.toString()?.includes(searchTerm)
    );
  }, [episodesData, searchTerm]);
  const epNum = useMemo(() => {
    const ola = episodes?.find(
      (item) => item?.number === Number(searchParams.get("ep"))
    );
    if (ola !== undefined) {
      return Number(searchParams.get("ep"));
    } else {
      return 1;
    }
  }, [episodes, searchParams]);

  useEffect(() => {
    if (data?.length === 0) {
      return;
    }
    setEpisodesData(data);
  }, [data]);

  const hasDub = useMemo(() => {
    return episodes?.find((ep) => ep?.number === epNum)?.hasDub || false;
  }, [episodes, epNum]);
  const audio = hasDub ? `${searchParams.get("subType") || "sub"}` : "sub";

  useEffect(() => {
    const fetcho = async () => {
      const { data } = await axios.get(`${lrl}/ep-covers/${id}`);
      const deta =
        data?.find((item) => item?.providerId === "tvdb") || data?.[0];
      setEpCovers(deta);
    };
    fetcho();
  }, []);
  useEffect(() => {
    const cover = epCovers?.data?.find((item) => item?.number === epNum)?.img;
    setCover(cover);
  }, [epNum, epCovers]);
  useEffect(() => {
    if (data?.length === 0) {
      return;
    }
    if (epNum && episodeRef.current) {
      episodeRef.current.scrollIntoView({
        behavior: "auto",
        block: "nearest",
      });
    }
  }, [epNum, episodes]);

  const dummys = useMemo(() => {
    let d = [];
    for (let i = 1; i < 5; i++) {
      d.push(
        <div
          className={`flex-shrink-0 pulse${i} gap-2 h-[81px] bg-[var(--lightt)] rounded-[8px]  overflow-hidden`}
        ></div>
      );
    }
    return d;
  }, []);
  const selecetedEpData = useMemo(() => {
    return epCovers?.data?.find((item) => item?.number === epNum);
  }, [epCovers, epNum]);

  const refreshEps = async () => {
    try {
      setRefresh(true);
      setEpisodesData([]);
      const { data } = await axios.get(`${lrl}/episodes/${id}`);
      const popo = () => {
        const pepe = data?.find((item) => item?.providerId === "gogoanime");
        if (pepe !== undefined) {
          return pepe;
        } else {
          return data[0];
        }
      };
      const providerId = searchParams.get("provider") || popo()?.providerId;
      setEpisodesData(
        data?.find((item) => item?.providerId === providerId)?.episodes
      );
    } catch (error) {
      console.log("epsda");
    } finally {
      setRefresh(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>{`${
          media?.title
            ? `${
                selecetedEpData?.title
                  ? `${selecetedEpData?.title} -`
                  : `Episode ${epNum} -`
              } ${
                media?.title?.english ||
                media?.title?.romaji ||
                media?.title?.native
              }`
            : "Loading..."
        }`}</title>
        <meta
          name="twitter:title"
          content={`${selecetedEpData?.title || title}`}
        />
        <meta
          name="twitter:description"
          content={selecetedEpData?.description || media?.description}
        />
        <meta
          name="twitter:image"
          content={selecetedEpData?.img || media?.bannerImage}
        />
        <meta
          property="og:title"
          content={`${selecetedEpData?.title || title}`}
        />
        <meta
          property="og:description"
          content={selecetedEpData?.description || media?.description}
        />
        <meta
          property="og:image"
          content={selecetedEpData?.img || media?.bannerImage}
        />
        <meta
          name="description"
          content={selecetedEpData?.description || media?.description}
        />
        <link
          rel="icon"
          content={selecetedEpData?.img || media?.bannerImage}
        ></link>
      </Helmet>
      <div className="flex flex-wrap items-center mt-3 lg:m-0 gap-1 px-2 md:p-0 lg:px-2">
        <span className="flex-shrink-0 flex items-center gap-2 font-['Poppins'] self-end font-medium tracking-wide text-lg">
          Episodes:{" "}
          <button
            onClick={() => refreshEps()}
            className={`h-fit hover:scale-105 smoothie ${
              refresh ? "rotato" : ""
            } smoothie active:scale-95`}
          >
            <RefreshCw size={17} color={`white`} />
          </button>
        </span>
        {hasDub ? (
          <div className="flex items-center font-['Poppins'] text-sm gap-1 ml-auto mx-1">
            <span>Dub</span>
            <label class="switch">
              <input
                type="checkbox"
                checked={searchParams.get("subType") === "dub" ? true : false}
                onChange={() => {
                  const newSubType =
                    searchParams.get("subType") === "dub" ? "sub" : "dub";
                  navigate(
                    `/watch/${id}?provider=${provider}&ep=${epNum}&subType=${newSubType}`
                  );
                }}
              />
              <span class="slider"></span>
            </label>
          </div>
        ) : (
          ""
        )}
        <span
          className={`bg-transparent flex items-center border gap-1 border-gray-500 p-1 ${
            hasDub ? "" : "ml-auto"
          } rounded`}
        >
          <Search size={15} className=" text-white/60" />
          <input
            type="number"
            placeholder={"Episode No."}
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setSortOrder("asc");
            }}
            className="bg-transparent w-[70px] text-white outline-none text-xs "
          />
        </span>
        <span className="p-1">
          <button className="w-fit flex gap-1 text-white items-center">
            {/* <span >Sort</span> */}
            <span
              className={`${sortOrder === "desc" ? "" : "hidden"}`}
              onClick={() => setSortOrder("asc")}
            >
              <SortAsc size={21} />
            </span>
            <span
              className={`${sortOrder === "asc" ? "" : "hidden"}`}
              onClick={() => setSortOrder("desc")}
            >
              <SortDesc size={21} />
            </span>
          </button>
        </span>
      </div>
      <div className="flex flex-col gap-[.4rem] py-1 px-2 lg:px-2 max-h-[330px] sm:max-h-[unset] sm:h-[330px] md:flex-grow scroll-smooth overflow-y-auto">
        {episodes && episodes?.length > 0
          ? episodes
              ?.sort((a, b) => {
                if (sortOrder === "asc") {
                  return a.number - b.number;
                } else {
                  return b.number - a.number;
                }
              })
              ?.map((ep, i) => {
                const cover = epCovers?.data?.find(
                  (item) => item?.number === ep?.number
                )?.img;
                const epTitle = epCovers?.data?.find(
                  (item) => item?.number === ep?.number
                )?.title;
                const desc = epCovers?.data?.find(
                  (item) => item?.number === ep?.number
                )?.description;
                return (
                  <Link
                    ref={epNum === ep?.number ? episodeRef : null}
                    key={ep?.number}
                    to={`/watch/${id}?provider=${provider}&ep=${
                      ep?.number
                    }&subType=${ep?.hasDub ? audio : "sub"}`}
                    className={`flex relative group flex-shrink-0 gap-1 h-[80px] items-center bg-[var(--lightt)] rounded-lg smoothie overflow-hidden ${
                      epNum === ep?.number
                        ? "ring-1 ring-[var(--pinkk)] brightness-[1.15] hover:scale-100"
                        : "hover:scale-[.98]"
                    }`}
                  >
                    <div className="h-[80px] aspect-[15/9] bg-white/[0.02] relative rounded-lg overflow-hidden flex-shrink-0 shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]">
                      <LazyLoadImage
                        effect="opacity"
                        src={
                          provider === "animepahe"
                            ? `${workerURL}/?url=${
                                ep?.image || ep?.img || cover || banner
                              }&all=yes`
                            : ep?.image || ep?.img || cover || banner
                        }
                        alt=""
                        height="100%"
                        width="100%"
                        className={`w-full h-full object-cover ${
                          epNum === ep?.number
                            ? "brightness-[.8]"
                            : "brightness-[.95]"
                        }`}
                      />

                      <span className="px-2 max-w-full flex-grow text-white shadow-2xl shadow-black bg-black/20 rounded-tr-xl brightness-125 font-semibold tracking-wide absolute bottom-0 left-0 ">
                        {ep?.number}
                      </span>
                    </div>
                    <FaCirclePlay
                      size={20}
                      className={`absolute text-[var(--pinkk)] ${
                        epNum === ep?.number ? "top-1 right-2 " : "hidden"
                      }`}
                    />
                    <div
                      className={`p-2 xl:px-3 flex-grow justify-center flex flex-col gap-[3px] tracking-wide`}
                    >
                      <span
                        className={`text-sm tracking-wider line-clamp-1 italic ${
                          epNum === ep?.number
                            ? "text-[var(--pinkk)] font-bold"
                            : "font-medium text-white/80"
                        } `}
                      >
                        {ep?.title || epTitle || ` Episode: ${ep?.number}`}
                      </span>
                      <span
                        className={`pr-1 text-xs !leading-tight line-clamp-2 italic  ${
                          epNum === ep?.number
                            ? "text-[var(--pinkk)] font-bold"
                            : "text-white/70"
                        }`}
                      >
                        {ep?.description || desc || title?.english}
                      </span>
                    </div>
                  </Link>
                );
              })
          : dummys.map((d, i) => {
              return <div key={i}>{d}</div>;
            })}
      </div>
    </>
  );
};

export default EpisodeCardSection;
