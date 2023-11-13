import { useContext, useEffect, useMemo, useState } from "react";
import InfoSection from "../components/infoSection/InfoSection";
import { useParams } from "react-router-dom";
import { Context } from "../context/AppContext";
import axios from "axios";
import { Helmet } from "react-helmet";
import CastSection from "../components/infoSection/CastSection";
import EpisodeSection from "../components/infoSection/EpisodeSection";
import Caraousel from "../components/Caraousel";

const Info = () => {
  const params = useParams();
  const { popular, setProgress, api, setOnInfoPage, lrl, brl, local } =
    useContext(Context);
  const [resultData, setResultData] = useState([]);
  const [related, setRelated] = useState([]);
  const [episodeData, setEpisodeData] = useState([]);
  const [artworkData, setArtworkData] = useState([]);
  useEffect(() => {
    setOnInfoPage(true);
  }, []);

  const fetchEpisodes = async () => {
    try {
      const { data } = await axios.get(`${lrl}/episodes/${params.id}`);
      setEpisodeData(data);
    } catch (error) {
      console.log("huh?");
    }
  };

  useEffect(() => {
    if (!params.id) {
      return;
    }
    setResultData([]);
    setEpisodeData([]);
    setProgress(70);
    const info = async () => {
      try {
        const { data } = await axios.get(`${lrl}/info/${params.id}`);
        setProgress(80);
        setResultData(data?.data);
        if (data?.data?.episodes?.data?.length > 0) {
          setEpisodeData(data?.data?.episodes?.data);
        } else {
          fetchEpisodes();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setProgress(100);
      }
    };
    const relation = async () => {
      const { data } = await axios.get(`${lrl}/relations/${params.id}`);
      setRelated(data);
    };

    const artwork = async () => {
      const { data } = await axios.get(`${brl}/artwork/${params.id}`);
      const uniqueArtwork = Array.from(
        new Set(
          data?.artwork
            ?.filter((item) => item?.type === "banner")
            ?.map((art) => art?.img)
        )
      );
      setArtworkData(uniqueArtwork);
    };
    Promise.all([info(), relation(), artwork()]);
  }, [params.id]);
  const banner = useMemo(() => {
    const num = Math.floor(Math.random() * artworkData?.length) + 1;
    return artworkData?.[num] || resultData?.bannerImage;
  }, [artworkData, resultData]);
  return (
    <>
      <Helmet>
        <title>{`${
          resultData?.title
            ? `${
                resultData?.title?.english ||
                resultData?.title?.romaji ||
                resultData?.title?.native
              }`
            : "Loading..."
        }`}</title>
        <meta
          name="title"
          content={resultData?.title?.romaji}
          data-title-romaji={resultData?.title?.romaji}
          data-title-english={resultData?.title?.english}
          data-title-native={resultData?.title?.native}
        />
        <meta name="description" content={resultData?.description} />
        <meta
          name="twitter:title"
          content={`Pahe - ${
            resultData?.title?.romaji || resultData?.title?.english
          }`}
        />
        <meta
          name="twitter:description"
          content={`${resultData?.description?.slice(0, 180)}...`}
        />
        <meta name="twitter:image" content={banner} />
        <meta
          property="og:title"
          content={`Pahe - ${
            resultData?.title?.romaji || resultData?.title?.english
          }`}
        />
        <meta
          property="og:description"
          content={`${resultData?.description?.slice(0, 180)}...`}
        />

        <meta property="og:image" content={banner} />
        <meta
          name="description"
          content={`${resultData?.description?.slice(0, 180)}...`}
        />
        <link rel="icon" href={banner}></link>
      </Helmet>
      <div className="w-full mb-[100px]">
        <InfoSection data={resultData} banner={banner} />
        <div className="w-full max-w-[1200px] px-2 mx-auto my-5 md:my-12">
          <CastSection data={resultData?.characters} />
        </div>
        <div className="w-full max-w-[1200px] mx-auto mt-4 md:my-[70px]">
          <EpisodeSection
            episodeData={episodeData}
            title={resultData?.title}
            id={resultData?.id}
            related={related?.slice(0, 25)}
            banner={banner}
          />
        </div>
        {popular && (
          <div className="Popular ">
            <Caraousel
              data={popular}
              title={"Most Popular"}
              clas={"infoPopular"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Info;
