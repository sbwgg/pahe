import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import hainn from "../../assets/wathcGirl.png";
import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../../context/AppContext";

const Watchlist = () => {
  const [showDelete, setShowDelete] = useState(false);
  const { setProgress, watchList, removeFromWatchList, clearWatchList } =
    useContext(Context);
  const listo = JSON.parse(localStorage.getItem(`watchlist`))?.sort(
    (a, b) => b.dateAdded - a.dateAdded
  );

  return (
    <>
      <div className="flex flex-wrap mb-auto mx-auto w-full ">
        {listo?.length > 0 ? (
          listo?.map((i) => {
            return (
              <div
                key={i?.id}
                className="flex flex-shrink-0 group p-1 md:p-[.4rem] w-[33.3%] sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-[14.28%] mb-2 relative flex-col gap-2"
              >
                <Link
                  to={`/anime/${i?.id}`}
                  className={`flex flex-col gap-1 h-full w-full`}
                >
                  <div className="flex-shrink-0 w-full rounded-lg bg-[var(--lightt)] aspect-[1/1.45] overflow-hidden">
                    <LazyLoadImage
                      effect="blur"
                      src={`${i?.image}`}
                      height={"100%"}
                      width={"100%"}
                      className={`w-full h-full object-cover group-hover:scale-[1.03] smoothie`}
                    />
                  </div>
                  <span className="line-clamp-2 font-['Poppins'] tracking-wide !leading-snug text-sm xl:text-base sm:font-medium flex-shrink-0">
                    {i?.title}
                  </span>
                </Link>
                <span
                  className="absolute lg:opacity-0 group-hover:opacity-100 top-2 z-30 right-2 flex items-center justify-center cursor-pointer p-[6px] bg-black/60 rounded-[12px] hover:text-[var(--pinkk)] transition-all duration-300 ease-linear"
                  onClick={() => removeFromWatchList(i?.id)}
                >
                  <AiFillDelete size={20} />
                </span>
              </div>
            );
          })
        ) : (
          <LazyLoadImage
            src={hainn}
            className={`w-[100px] h-[100px] self-center mx-auto select-none opacity-60 grayscale `}
          />
        )}
      </div>
      {listo?.length > 0 && (
        <div className=" flex justify-end items-center w-[90%] mx-auto">
          <span
            onClick={() => setShowDelete(true)}
            className={`${
              showDelete && "hidden"
            } hover:bg-white ring-white ring-1 flex items-center text-end justify-end cursor-pointer p-2 py-[3px]  bg-black/60  tracking-wide font-normal hover:text-[var(--pinkk)] transition-all duration-200 ease-linear`}
          >
            Clear
            <AiFillDelete size={20} />
          </span>
          <div className={`${!showDelete && "hidden"} flex items-center gap-2`}>
            Are u sure?
            <span
              className={`bg-[crimson] rounded w-10 flex items-center text-end justify-center cursor-pointer p-2 py-[3px]  tracking-wide font-normal`}
              onClick={() => clearWatchList()}
            >
              Yes
            </span>
            <span
              className={`bg-[var(--lighttt)] rounded w-10 flex items-center text-end justify-center cursor-pointer p-2 py-[3px] tracking-wide font-normal`}
              onClick={() => setShowDelete(false)}
            >
              no
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Watchlist;
