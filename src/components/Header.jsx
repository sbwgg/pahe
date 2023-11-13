import { Link } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context/AppContext";
import logo from "../assets/logo.svg";
import LoadingBar from "react-top-loading-bar";
import { CgClose } from "react-icons/cg";
import {
  Heart,
  Search,
  Settings,
  User2,
  Timer,
} from "lucide-react";
import SearchSnippet from "./SearchSnippet/SearchSnippet";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import pp from "/android-chrome-192x192.png";
import debounce from "lodash/debounce";

const Header = () => {
  const {
    progress,
    query,
    setQuery,
    onInfoPage,
    showSnippet,
    setShowSnippet,
    lrl,
    local,
    searchResults,
    setSearchResults,
    loading,
    setLoading,
  } = useContext(Context);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [headerBg, setHeaderBg] = useState(false);
  const pathname = location.pathname;
  useEffect(() => {
    setShowMenu(false);
    setShowSnippet(false);
    setShowSearch(false);
  }, [pathname]);

  window.addEventListener("scroll", () => {
    if (window.scrollY >= 8) {
      !headerBg && setHeaderBg(true);
    } else {
      headerBg && setHeaderBg(false);
    }
  });

  const fetchSearchResults = async () => {
    const { data } = await axios.get(`${lrl}/search/${query}`);
    setSearchResults(data?.results);
    setLoading(false);
  };

  const debouncedFetchResults = debounce(fetchSearchResults, 400);

  useEffect(() => {
    if (query.length < 1) {
      return;
    }
    setLoading(true);
    setShowSnippet(true);
    debouncedFetchResults();

    return () => debouncedFetchResults.cancel();
  }, [query]);


  return (
    <>
      <header
        className={`header z-[99] fixed top-0 w-full sm:backdrop-blur-[1px] smoothie ${
          showSearch
            ? "bg-[#000000cc]"
            : `${
                !onInfoPage
                  ? headerBg
                    ? "bg-[#00000080]"
                    : ""
                  : "bg-[#00000070]"
              }`
        }`}
      >
        <LoadingBar
          color="#bc0150"
          progress={progress}
          height={2}
          loaderSpeed={1500}
          waitingTime={800}
          shadow={true}
          className={`hidden md:block brightness-110 `}
        />
        <LoadingBar
          color="var(--pinkk)"
          progress={progress}
          height={3}
          shadow={true}
          loaderSpeed={1500}
          waitingTime={800}
          className={`md:hidden`}
        />
        <div
          className={`absolute ${
            progress !== 100 && progress !== 0 ? "flex" : "hidden"
          } justify-end p-1 w-full top-0 left-0 right-0 z-[60]`}
        >
          <div className="loaderrr "></div>
        </div>
        <div className="w-full h-14 flex gap-3 md:gap-4 items-center max-w-[1300px] mx-auto px-3 md:px-5">
          {/* <SlMenu size={22} /> */}
          <div className="left flex gap-8 items-center">
            <Link to="/" className="hover:brightness-125 flex-shrink-0">
              <img
                fetchpriority="high"
                src={logo}
                alt="pahe"
                width="136px"
                height="30px"
              />
            </Link>
            <div
              className={`links hidden lg:flex items-center gap-1 rounded-sm overflow-hidden tracking-wide`}
            >
              <Link
                className="hover:bg-[var(--pink)] transition-all duration-300 ease-linear  p-2"
                to="/"
              >
                home
              </Link>
              <Link
                className="hover:bg-[var(--pink)] transition-all duration-300 ease-linear p-2"
                to="/latest-episodes"
              >
                anime
              </Link>
              <Link
                to={"/user/watchlist"}
                className="hover:bg-[var(--pink)] transition-all duration-300 ease-linear p-2"
              >
                watchlist
              </Link>
            </div>
          </div>
          <div className="relative z-50 hidden md:flex ml-auto flex-col transition-all duration-300 group ease-linear ">
            <div
              className={`flex gap-2 items-center backdrop-blur-3xl bg-[var(--light)] p-2 px-3 group-focus-within:rounded-b-none rounded-md  
               smoothie`}
            >
              <Search size={17} color={`#9c9c9c`} strokeWidth={3} />
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                name="search"
                placeholder="Search Anything..."
                className="!bg-transparent text-[.8rem] leading-tight font-normal text-white w-[250px] group-focus-within:w-[280px] 2xl:group-focus-within:w-[300px] tracking-wide smoothie"
              />
            </div>
            <SearchSnippet />
          </div>
          <div className="md:hidden ml-auto z-50 pr-2 flex gap-3 ">
            <Search
              strokeWidth={3}
              size={23}
              onClick={() => setShowSearch(true)}
              className={`${showSearch && "hidden"}`}
            />
            <CgClose
              size={22}
              onClick={() => setShowSearch(false)}
              className={`${!showSearch && "hidden"}`}
            />
            <div
              className={`absolute z-50 left-0 w-full mx-auto top-full group flex-col smoothie ${
                !showSearch && "hidden"
              }`}
            >
              <div className="flex gap-3 items-center bg-black/80 p-3 px-3 w-full smoothie">
                <Search size={18} color={`#9c9c9c`} strokeWidth={3} />
                <input
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  name="search"
                  placeholder="Search Anything..."
                  className="!bg-transparent text-[.8rem] font-normal text-white h-full w-full tracking-wide smoothie"
                />
              </div>
              <hr className="!border-0 !h-[1px] !bg-white" />
              <SearchSnippet />
            </div>
          </div>
          <div className="group relative w-fit smoothie">
            <img
              alt=""
              src={pp}
              size={28}
              onClick={() => setShowMenu(!showMenu)}
              className={`w-9 select-none md:w-10 rounded-full active:scale-95 smoothie cursor-pointer`}
            />

            <div
              className={`${
                showMenu ? "flex" : "hidden"
              } text-sm smoothie absolute font-['Poppins'] w-[250px] z-50 gap-4 top-[102%] right-0 p-6 px-4 rounded-xl bg-[#000000e5]  flex-col`}
            >
              <div className="flex flex-col gap-1 select-none">
                <div className="text-[var(--pinkk)] brightness-110 font-medium uppercase">
                  Hola amigo!!
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  to={"/user/history"}
                  className={`px-3 py-2 flex items-center gap-3  bg-white/10  hover:bg-white/20  rounded-2xl`}
                >
                  <User2 size={17} />
                  Profile
                </Link>
                <Link
                  to={"/user/history"}
                  className={`px-3 py-2 flex items-center gap-3  bg-white/10  hover:bg-white/20  rounded-2xl`}
                >
                  <Timer size={17} />
                  Continue Watching
                </Link>
                <Link
                  to={"/user/watchlist"}
                  className={`px-3 py-2 flex items-center gap-3   bg-white/10  hover:bg-white/20  rounded-2xl`}
                >
                  <Heart size={17} />
                  WatchList
                </Link>
                <Link
                  to={"/user/history"}
                  className={`px-3 py-2 flex items-center gap-3  bg-white/10  hover:bg-white/20  rounded-2xl`}
                >
                  <Settings size={17} />
                  Settings
                </Link>
              </div>
            </div>
          </div>

       
        </div>
      </header>
    </>
  );
};

export default Header;
