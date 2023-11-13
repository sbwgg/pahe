import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Slider from "../components/Slider";
import LatestReleases from "../components/LatestReleases";
import { Context } from "../context/AppContext";
import Caraousel from "../components/Caraousel";
import { Helmet } from "react-helmet";
import RecentWatched from "../components/RecentWatched";

const Home = () => {
  const {
    popular,
    setPopular,
    setProgress,
    setOnInfoPage,
    conUrl,
    lrl,
    local,
  } = useContext(Context);
  const [trendingData, setTrendingData] = useState([]);
  const [TopAnimeData, setTopAnimeData] = useState([]);
  const [seasonalData, setSeasonal] = useState([]);

  useEffect(() => {
    setOnInfoPage(false);
  }, []);

  useEffect(() => {
    setProgress(70);
    const fetchData = async () => {
      setProgress(80);
      try {
        const { data } = await axios.get(`${lrl}/home`);
        data?.trending?.length > 0
          ? setTrendingData(data?.trending)
          : setTrendingData([]);
        data?.popular?.length > 0
          ? setPopular(data?.popular?.slice(0, 15))
          : setPopular([]);
        data?.top?.length > 0
          ? setTopAnimeData(data?.top?.slice(0, 15))
          : setTopAnimeData([]);
        data?.seasonal?.length > 0
          ? setSeasonal(data?.seasonal)
          : setSeasonal([]);
      } catch (error) {
      } finally {
        setProgress(100);
      }
    };
    fetchData();
  }, []);
  const listo = JSON.parse(localStorage.getItem(`history`))?.sort(
    (a, b) => b.dateAdded - a.dateAdded
  );
  return (
    <>
      <Helmet>
        <title>Pahe - Free Anime Streaming</title>
      </Helmet>
      <div>
        <Slider data={trendingData?.slice(0, 10)} />
        {listo?.length > 0 && <RecentWatched listo={listo?.slice(0, 4)} />}
        <Caraousel
          data={trendingData}
          title={"Trending Anime"}
          clas={"trending"}
        />
        <LatestReleases home={true} perPage={12} />
        <Caraousel
          data={seasonalData}
          title={"Popular this Season"}
          clas={"sPopular"}
        />
        <Caraousel data={TopAnimeData} title={"Top Rated"} clas={"top"} />
        <Caraousel data={popular} title={"Most Popular"} clas={"popular"} />
      </div>
    </>
  );
};

export default Home;
