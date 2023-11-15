import { useState, createContext } from "react";

export const Context = createContext();

export const AppContext = (props) => {
  const [data, setData] = useState([]);
  const [mobileView, setMobileView] = useState(false);
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState(0);
  const [onInfoPage, setOnInfoPage] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [resultData, setResultData] = useState(null); //WatchPage Data
  const [cover, setCover] = useState("");
  const [popular, setPopular] = useState(null);
  const [loading, setLoading] = useState(false);
  const [watchList, setWatchList] = useState(() => {
    const storedList = localStorage.getItem("watchlist");
    return storedList ? JSON.parse(storedList) : [];
  });
  const workerURL = import.meta.env.VITE_IMGPROXY_URL;
  // const lrl = "http://localhost:3000";
  // const brl = "http://localhost:3000";
  const lrl = import.meta.env.VITE_BASE_URL;
  const brl = import.meta.env.VITE_BETA_URL;
  const api = import.meta.env.VITE_ANIFY_URL;
  const mProxy = import.meta.env.VITE_M3U8PROXY_URL;
  const mcProxy = import.meta.env.VITE_MCPROXY_URL;
  const local = "http://localhost:3000";
  const mLocal = "http://localhost:5010";

  const addToWatchList = (animeDetails) => {
    if (animeDetails.id) {
      if (!watchList.some((item) => item.id === animeDetails.id)) {
        const updatedWatchlist = [...watchList, animeDetails];
        setWatchList(updatedWatchlist);
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      }
    }
  };
  const removeFromWatchList = (animeId) => {
    const updatedWatchlist = watchList.filter((anime) => anime.id !== animeId);
    setWatchList(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  };
  const clearWatchList = () => {
    setWatchList([]);
    localStorage.removeItem("watchlist");
  };
  return (
    <Context.Provider
      value={{
        api,
        brl,
        workerURL,
        mcProxy,
        data,
        setData,
        mobileView,
        setMobileView,
        query,
        setQuery,
        progress,
        setProgress,
        onInfoPage,
        setOnInfoPage,
        showMenu,
        setShowMenu,
        showSnippet,
        setShowSnippet,
        searchResults,
        setSearchResults,
        mProxy,
        local,
        mLocal,
        lrl,
        setCover,
        cover,
        resultData,
        setResultData,
        popular,
        setPopular,
        loading,
        setLoading,
        watchList,
        setWatchList,
        addToWatchList,
        removeFromWatchList,
        clearWatchList,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
