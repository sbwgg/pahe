import { useState, useEffect, useContext, useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Context } from "../../context/AppContext";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { RefreshCw, Search, SortAsc, SortDesc } from "lucide-react";
import axios from "axios";

const EpisodeSection = ({ title, episodeData, related, banner }) => {
  const { setProgress, conUrl, lrl, workerURL, local } = useContext(Context);
  const [providerId, setProviderId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [epCovers, setEpCovers] = useState([]);
  const [view, setView] = useState(false);
  const params = useParams();
  const id = params.id;
  useEffect(() => {
    const allData = episodeData || [];
    setProviders(allData);
    if (allData?.length > 0) {
      const defaultProvider = allData?.find(
        (item) => item?.providerId === "gogoanime"
      );
      let selectedProviderId =
        defaultProvider?.providerId || allData?.[0]?.providerId;
      setProviderId(selectedProviderId);
    }
  }, [episodeData]);

  const episodes = useMemo(() => {
    const data = providers?.find(
      (item) => item?.providerId === providerId
    )?.episodes;
    return data?.filter((item) =>
      item?.number?.toString()?.includes(searchTerm)
    );
  }, [providers, providerId, searchTerm]);
  useEffect(() => {
    const fetcho = async () => {
      const { data } = await axios.get(`${lrl}/ep-covers/${id}`);
      const deta =
        data?.find((item) => item?.providerId === "tvdb") || data?.[0];
      setEpCovers(deta);
    };
    fetcho();
  }, [id]);

  const handleProviderChange = (event) => {
    setProgress(80);
    setProviderId(event.target.value);
    setProgress(100);
  };
  const refreshEps = async () => {
    try {
      setRefresh(true);
      setProviders([]);
      const { data } = await axios.get(`${lrl}/episodes/${id}`);
      setProviders(data);
    } catch (error) {
      console.log("epsda");
    } finally {
      setRefresh(false);
    }
  };

  const dummys = useMemo(() => {
    let d = [];
    for (let i = 1; i < 7; i++) {
      d.push(
        <div
          key={i}
          className={`flex-shrink-0 pulse${i} w-full gap-2 h-[90px] bg-[var(--lightt)] rounded-lg overflow-hidden`}
        ></div>
      );
    }
    return d;
  }, []);
  return (
    <div className="flex flex-col gap-3 px-1">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="LEFT flex flex-col flex-wrap lg:w-[70%] flex-shrink-0 gap-1 sm:gap-0">
          <div className="flex items-center my-2 md:my-3 px-1 md:mt-0 gap-2">
            <span className="flex-shrink-0 flex items-center gap-2 font-['Poppins'] !self-end font-medium tracking-wide text-lg sm:text-xl">
              Episodes:
              <button
                onClick={() => refreshEps()}
                className={`h-fit hover:scale-105 smoothie ${
                  refresh ? "rotato" : ""
                } smoothie active:scale-95`}
              >
                <RefreshCw size={17} color={`white`} />
              </button>
            </span>
            {providers && (
              <select
                onChange={handleProviderChange}
                value={providerId}
                className="gap-1 ml-auto hidden sm:flex bg-black p-1 text-center tracking-wide text-white rounded ring-1 ring-gray-500 outline-none text-xs"
              >
                {providers?.map(
                  (provider) =>
                    provider?.episodes?.length > 0 && (
                      <option
                        value={provider.providerId}
                        key={provider.providerId}
                      >
                        {provider.providerId}
                      </option>
                    )
                )}
              </select>
            )}
            <span className="bg-transparent ml-auto sm:m-0 flex flex-shrink items-center border gap-1 border-gray-500 p-1 rounded">
              <Search size={15} className=" text-white/60" />
              <input
                type="number"
                placeholder={"Episode No."}
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSortOrder("asc");
                }}
                className="bg-transparent w-[70px] text-white outline-none text-xs"
              />
            </span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setView(true)}
                className={`w-8 h-5 rounded-[5px] overflow-hidden ${
                  view
                    ? "bg-[var(--pink)] brightness-150"
                    : "bg-[var(--light)] brightness-200 hover:bg-[var(--pink)]"
                } smoothie`}
              ></button>
              <button
                onClick={() => setView(false)}
                className="flex flex-col justify-center items-center gap-[2px] h-[1.1rem] group"
              >
                <span
                  className={`w-8 h-1/2 rounded-sm overflow-hidden flex ${
                    !view
                      ? "bg-[var(--pink)] brightness-150"
                      : "bg-[var(--light)] brightness-200 group-hover:bg-[var(--pink)]"
                  }`}
                ></span>
                <span
                  className={`w-8 h-1/2 rounded-sm overflow-hidden flex ${
                    !view
                      ? "bg-[var(--pink)] brightness-150"
                      : "bg-[var(--light)] brightness-200 group-hover:bg-[var(--pink)]"
                  }`}
                ></span>
              </button>
            </div>
            <button className="w-fit flex gap-1 text-white items-center">
              {/* <span >Sort</span> */}
              <span
                className={`${sortOrder === "desc" ? "" : "hidden"}`}
                onClick={() => setSortOrder("asc")}
              >
                <SortDesc size={20} />
              </span>
              <span
                className={`${sortOrder === "asc" ? "" : "hidden"}`}
                onClick={() => setSortOrder("desc")}
              >
                <SortAsc size={20} />
              </span>
            </button>
          </div>
          <div
            className={`flex flex-wrap w-full max-h-[360px] lg:max-h-[480px] overflow-auto ${
              view ? "md:gap-0" : "gap-[.4rem]"
            }  px-1`}
          >
            {episodes && episodes?.length > 0
              ? episodes
                  ?.sort((a, b) => {
                    if (sortOrder === "asc") {
                      return a.number - b.number;
                    } else {
                      return b.number - a.number;
                    }
                  })
                  .map((ep) => {
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
                      <div
                        key={ep?.number}
                        className={`flex-shrink-0 smoothie ${
                          !view
                            ? "w-full h-[80px] sm:h-[90px] hover:brightness-90 hover:scale-[.98]"
                            : "w-1/2 md:w-1/3 p-1 md:h-[unset] aspect-video"
                        }`}
                      >
                        <Link
                          className="group w-full h-full z-0 flex bg-[var(--lightt)] gap-1 md:gap-2 relative smoothie rounded-lg overflow-hidden"
                          to={`/watch/${id}/?provider=${providerId}&ep=${ep?.number}`}
                          onClick={() => setProgress(60)}
                        >
                          <div
                            className={`h-full ${
                              !view ? "aspect-[15/9]" : "w-full"
                            }  relative flex-shrink-0 bg-white/5 rounded-lg overflow-hidden shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]`}
                          >
                            <LazyLoadImage
                              src={
                                providerId === "animepahe"
                                  ? `${workerURL}/?url=${
                                      ep?.image || ep?.img || cover || banner
                                    }&all=yes`
                                  : ep?.image || ep?.img || cover || banner
                              }
                              alt=""
                              effect="blur"
                              width="100%"
                              height="100%"
                              className={`brightness-90 sm:brightness-95 aspect-video h-full ${
                                view ? "group-hover:scale-105" : ""
                              } w-full object-cover rounded-md smoothie`}
                            />
                            <span className="px-2 z-20 bg-black/25 max-w-full flex-grow text-white shadow-2xl shadow-black font-semibold brightness-125 tracking-wide absolute bottom-0 left-0 rounded-tr-lg">
                              {ep?.number}
                            </span>
                          </div>

                          <div
                            className={`mobile ${
                              view ? "hidden" : "flex"
                            } !italic flex-grow flex flex-col gap-1 p-2 py-3`}
                          >
                            <span className="tracking-wider !leading-tight line-clamp-1 text-sm text-white/[.85] font-medium">
                              {ep?.title ||
                                epTitle ||
                                ` Epidode: ${ep?.number}`}
                            </span>
                            <span className="!leading-snug w-full line-clamp-2 text-white/70 text-xs font-normal tracking-wide">
                              {ep?.description || desc || title?.english}
                            </span>
                          </div>
                          <div
                            className={`${
                              view ? "flex" : "hidden"
                            } !italic z-10 text-white !tracking-wide py-1 px-2 flex-col bg-black/40 opacity-0 group-hover:opacity-100  absolute w-full h-full smoothie`}
                          >
                            <div className="font-medium brightness-110 !leading-snug w-full">
                              {ep?.title ||
                                epTitle ||
                                ` Epidode: ${ep?.number}`}
                            </div>
                            <div className="ml-auto mt-auto font-medium hover:underline brightness-125 hover:text-[var(--pinkk)]">
                              Watch Now
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
              : dummys.map((d, i) => {
                  return d;
                })}
          </div>
        </div>
        {related && (
          <div className="RIGHT my-5 lg:mt-0 flex-grow flex flex-col gap-3">
            <div className="text-xl font-medium tracking-[0.015em] font-['Poppins'] items-center gap-2 flex px-1">
              <div className="lg:hidden h-6 md:h-8 rounded-md w-[6px] bg-[var(--pink)]"></div>
              Seasons & Relations
            </div>
            <div className="flex flex-col gap-2 max-h-[360px] lg:max-h-[480px] overflow-auto">
              {related?.length > 0 ? (
                related?.slice(0, 33)?.map((item) => {
                  return (
                    <Link
                      key={item?.id}
                      to={`/anime/${item?.id}`}
                      className="flex gap-2 flex-shrink-0 h-[120px] p-2 bg-[var(--light)] rounded-lg overflow-hidden hover:brightness-[.8] hover:scale-[.98] smoothie"
                    >
                      <div className="h-full aspect-[1/1.4] flex-shrink-0 bg-white/5 rounded-md overflow-hidden">
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
                      <div className="flex flex-col flex-grow gap-1 justifsy-center items-center p-1">
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
                              <span className="text-white/60 ">
                                {item?.year}
                              </span>
                            </>
                          )}
                        </div>
                        <span
                          className="text-xs w-full tracking-wider mt-1 !leading-tight !italic line-clamp-2 text-white/60"
                          dangerouslySetInnerHTML={{
                            __html: item?.description,
                          }}
                        ></span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <>
                  <Link className="flex gap-2 pulse1 flex-shrink-0 h-[120px] p-2 bg-[var(--light)] rounded-md overflow-hidden "></Link>
                  <Link className="flex gap-2 pulse2 flex-shrink-0 h-[120px] p-2 bg-[var(--light)] rounded-md overflow-hidden "></Link>
                  <Link className="flex gap-2 pulse3 flex-shrink-0 h-[120px] p-2 bg-[var(--light)] rounded-md overflow-hidden "></Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default EpisodeSection;
