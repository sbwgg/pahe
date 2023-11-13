import { useState, useEffect, useContext } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../context/AppContext";

import { History, Heart } from "lucide-react";
import Watchlist from "./Watchlist";
import ContinueWatching from "./ContinueWatching";
import { Helmet } from "react-helmet";
const Dashboard = () => {
  const params = useParams();
  const [list, setList] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const { setProgress, watchList, removeFromWatchList, clearWatchList } =
    useContext(Context);

  useEffect(() => {
    setProgress(70);
    const sortedList = watchList.sort((a, b) => b.dateAdded - a.dateAdded);
    setTimeout(() => {
      setList(sortedList);
      setProgress(100);
    }, 1000);
  }, [watchList]);

  return (
    <div className="min-h-[95vh] max-w-[1200px] pt-12 w-full px-2 items-center mx-auto flex flex-col gap-1 md:gap-5">
      <div className="flex font-['Poppins'] flex-wrap relative w-[90%] mx-auto justify-center gap-6 items-center my-6 mt-10">
        <Link
          to={`/user/history`}
          className={`flex gap-1 items-center cursor-pointer relative flex-shrink-0 ${
            params.tab === "history"
              ? "text-[#d42c72] tabs brightness-125 "
              : ""
          } md:text-xl first-letter:tracking-wide`}
        >
          <History size={22} />
          Continue Watching
        </Link>
        <Link
          to={`/user/watchlist`}
          className={`flex gap-1 items-center cursor-pointer relative flex-shrink-0 ${
            params.tab === "watchlist"
              ? "text-[#d42c72] tabs brightness-125 "
              : ""
          } md:text-xl first-letter:tracking-wide`}
        >
          <Heart
            size={22}
            fill={params.tab === "watchlist" ? "#d42c72" : "whitesmoke"}
          />
          WatchList
        </Link>
      </div>

      {params.tab === "watchlist" && <Watchlist />}
      {params.tab === "history" && <ContinueWatching />}
      <Helmet>
        <title>
          {params.tab === "history" ? "History" : "Watchlist"} - Pahe
        </title>
      </Helmet>
    </div>
  );
};

export default Dashboard;
