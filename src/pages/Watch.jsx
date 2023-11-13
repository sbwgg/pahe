import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { Context } from "../context/AppContext";
import VideoPlayer from "../components/playah/VideoPlayer";
import Caraousel from "../components/Caraousel";
import EpisodeCardSection from "../components/epCard";
import WatchInfo from "../components/WatchInfo";
import { useMemo } from "react";
const Watch = () => {
  const params = useParams();
  const { popular, setOnInfoPage, setProgress, lrl, cover, local } =
    useContext(Context);
  const [resultData, setResultData] = useState([]);
  const [providers, setProviders] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchEpisodes = async () => {
    try {
      const { data } = await axios.get(`${lrl}/episodes/${params.id}`);
      setProviders(data);
    } catch (error) {
      console.log("huh?");
    }
  };
  useEffect(() => {
    setOnInfoPage(false);
    const fetchData = async () => {
      try {
        setProgress(80);
        const { data } = await axios.get(`${lrl}/info/${params?.id}`);
        setResultData(data?.data);
        if (data?.data?.episodes?.data?.length > 0) {
          setProviders(data?.data?.episodes?.data || []);
        } else {
          fetchEpisodes();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setProgress(100);
      }
    };
    fetchData();
  }, []);
  const popo = useMemo(() => {
    const pepe = providers?.find((item) => item?.providerId === "gogoanime");
    if (pepe !== undefined) {
      return pepe;
    } else {
      return providers[0];
    }
  }, [providers]);

  const providerId = searchParams.get("provider") || popo?.providerId;

  const episodes = useMemo(() => {
    return providers?.find((item) => item?.providerId === providerId)?.episodes;
  }, [providers, providerId]);

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

  const hasDub = useMemo(() => {
    return episodes?.find((ep) => ep?.number === epNum)?.hasDub || false;
  }, [episodes, epNum]);
  const audio = hasDub ? `${searchParams.get("subType") || "sub"}` : "sub";
  // console.log("resultData", resultData);
  // console.log("provider", providerId);
  // console.log("episodes", episodes);
  // console.log("epNum", epNum);
  // console.log("audio", audio);
  // console.log("videoData", videoData);

  const banner = useMemo(() => {
    const num = Math.floor(Math.random() * 100) + 1;
    const art = resultData?.artwork?.filter((item) => item?.type === "banner");
    return art?.[num]?.img || resultData?.bannerImage;
  }, [resultData]);
  const poster = useMemo(() => {
    return episodes?.find((e) => e.number === epNum)?.img || cover || banner;
  }, [cover, episodes]);

  const color = resultData?.color;
  const watchId = useMemo(() => {
    return episodes?.find((item) => Number(item?.number) === epNum)?.id;
  }, [epNum, episodes]);
  // console.log("wpId", watchId);
  useEffect(() => {
    if (!watchId) {
      return;
    }
    setVideoData(null);
    setVideoError(false);
    setVideoLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${lrl}/tiddies?provider=${providerId}&watchId=${watchId}&id=${resultData?.id}&num=${epNum}&subType=${audio}`,
          {
            signal: signal,
          }
        );
        setVideoData(data);
      } catch (error) {
        setVideoError(true);
        setVideoData(null);
      } finally {
        setVideoLoading(false);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [watchId, providerId, audio]);

  const details = {
    id: parseInt(params?.id),
    episode: epNum,
    provider: providerId,
    cover: resultData?.coverImage,
    image: poster || banner,
    title:
      resultData?.title?.english ||
      resultData?.title?.romaji ||
      resultData?.title?.native,
    dateAdded: Date.now(),
  };
  return (
    <div className="w-full max-w-[1300px] 2xl:max-w-[1400px] mx-auto flex flex-col gap-8 sm:gap-12 xl:gap-16 pt-14">
      <div className="WATCH flex flex-col lg:flex-row w-full md:mt-4 xl:mt-8 2xl:mt-10 gap-2 md:px-3">
        <div className="Episode order-last lg:order-none w-full lg:w-[32%] overflow-hidden flex flex-col gap-3">
          <EpisodeCardSection
            media={resultData}
            data={episodes}
            provider={providerId}
            id={params.id}
            selectedEp={epNum}
            title={resultData?.title}
            banner={banner}
          />
        </div>
        <div className="Video w-full lg:w-[68%] flex flex-col gap-4">
          <div className="aspect-video w-full md:bg-[var(--light)] md:rounded-md overflow-hidden">
            {videoLoading ? (
              <div className="h-full w-full flex items-center justify-center p-1">
                <div className="golgol"></div>
              </div>
            ) : videoError ? (
              <p
                id="loading"
                className="!h-full !text-gray-300 flex flex-col gap-1"
              >
                <span> Whoops! Something went wrong.</span>
                <span>
                  Please{" "}
                  <span
                    onClick={() => window.location.reload()}
                    className={`underline-offset-2 cursor-pointer hover:text-[var(--pinkk)] underline`}
                  >
                    reload
                  </span>{" "}
                  the page or try
                </span>
                other sources. {`:(`}
              </p>
            ) : (
              <VideoPlayer
                details={details}
                key={params.id}
                id={params.id}
                provider={providerId}
                data={videoData}
                poster={poster}
              />
            )}
          </div>
          {providers ? (
            <div className="order-last w-full  rounded-md overflow-hidden flex flex-col md:flex-row items-center md:gap-3 bg-[var(--light)]">
              <div className="md:bg-[var(--pink)] p-3 px-5 tracking-wider text-white flex flex-col font-normal text-center md:w-[25%]">
                <span className="text-xs lg:text-sm">You are Watching</span>
                <span className="font-bold text-sm text-[var(--pinkk)] md:text-white">
                  Episode {epNum}
                </span>
                <span className="!leading-tight !text-xs">
                  If current server doesn't work please try other servers
                  beside.
                </span>
              </div>

              <div className="flex gap-3 sm:gap-6 p-2 items-center md:self-start py-5 h-fit">
                <span className="w-fit flex md:items-center font-medium self-start md:self-center tracking-wide">
                  Providers:
                </span>

                <div className="flex flex-wrap  gap-2 items-center">
                  {providers?.map(
                    (p) =>
                      p?.episodes?.length > 0 && (
                        <Link
                          key={p?.providerId}
                          to={`/watch/${resultData?.id}?provider=${p?.providerId}&ep=${epNum}&subType=${audio}`}
                          className={`px-3 py-1 w-fit h-fit text-sm lg:text-base transition-all ease-linear  text-white/0.9  tracking-wide rounded ${
                            providerId === p?.providerId
                              ? "bg-[var(--pink)]"
                              : "bg-[var(--lighttt)] hover:brightness-[.85] active:scale-95"
                          } cursor-pointer`}
                        >
                          {p.providerId === "gogoanime"
                            ? "gogo"
                            : p.providerId === "animepahe"
                            ? "ap"
                            : p?.providerId}
                        </Link>
                      )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="order-last animate-pulse w-full h-[130px] flex-grow rounded-md overflow-hidden  bg-[var(--light)]"></div>
          )}
        </div>
      </div>
      <WatchInfo resultData={resultData} />
      {resultData?.recommendations && (
        <div className="Recommends">
          <Caraousel
            data={resultData?.recommendations}
            title={"Recommendations"}
            clas={"watchRecommends"}
            from={"WatchPage"}
          />
        </div>
      )}
      {popular && (
        <div className="Popular">
          <Caraousel
            data={popular}
            title={"Most Popular"}
            from={"WatchPage"}
            clas={"watchPopular"}
          />
        </div>
      )}
    </div>
  );
};

export default Watch;
