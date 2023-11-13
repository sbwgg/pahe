import React, { useContext, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { Context } from "../../context/AppContext";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "./style.scss";
const SearchSnippet = () => {
  const { query, setQuery, searchResults, loading, showSnippet } =
    useContext(Context);
  const [results, setResults] = useState([]);
  useEffect(() => {
    setResults(searchResults);
  }, [searchResults]);

  return (
    <div
      className={`w-full z-50 absolute top-full hidden right-0 py-1 max-h-[440px] md:max-h-[480px] overflow-x-auto gap-1 flex-col bg-black/80 rounded-b-lg ${
        showSnippet && query.length > 1 ? "group-focus-within:flex" : " hidden "
      }  `}
    >
      {searchResults?.length !== 0 ? (
        !loading ? (
          results?.map((item) => {
            return (
              <Link
                to={`/anime/${item?.id}`}
                className="flex gap-2 px-2 p-1 hover:bg-[#d5015b]"
                key={`${item?.id}`}
              >
                <div className="h-[70px] w-[49px] bg-white/10 rounded-md overflow-hidden flex-shrink-0">
                  <LazyLoadImage
                    effect="opacity"
                    src={`${item?.image}` || `${item?.cover}`}
                    height="100%"
                    className={`w-full h-full scale-125 object-cover `}
                  />
                </div>
                <div className="p-1 flex flex-col gap-1 tracking-wide flex-grow ">
                  <div className="text-xs font-semibold line-clamp-1">
                    {item?.title?.english ||
                      item?.title?.userPreferred ||
                      item?.title?.romaji ||
                      item?.title?.native ||
                      "?"}
                  </div>
                  <div className="text-xs text-white/[0.8] flex gap-1">
                    <span>{item?.type || "?"}</span>
                    {"•"}
                    <span>{item?.totalEpisodes || "?"} Episodes</span>
                    <span>({item?.status || "?"})</span>
                  </div>
                  <div className=" text-xs text-white/[0.8] flex gap-1">
                    <span>{item?.releaseDate || item?.year || "?"}</span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="center">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        )
      ) : (
        <p className="h-[50px] text-white/[0.7] flex items-center justify-center">
          Not found {`:(`}
        </p>
      )}
    </div>
  );
};
export default SearchSnippet;
