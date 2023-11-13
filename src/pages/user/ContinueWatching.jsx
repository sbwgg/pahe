import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import hainn from "../../assets/wathcGirl.png";
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../../context/AppContext";
import { Play } from "lucide-react";

const ContinueWatching = () => {
  const [showDelete, setShowDelete] = useState(false);
  const { setProgress } = useContext(Context);

  const listo = JSON.parse(localStorage.getItem(`history`))?.sort(
    (a, b) => b.dateAdded - a.dateAdded
  );

  return (
    <>
      <div className="flex flex-wrap mb-auto mx-auto w-full ">
        {listo?.length > 0 ? (
          listo?.map((i) => {
            const a = parseInt(i.timestamp);
            const d = parseInt(i.duration);
            const perecent = (a * 100) / d;
            const formatTime = (time) => {
              const hours = Math.floor(time / 3600);
              const minutes = Math.floor((time % 3600) / 60);
              const seconds = time % 60;
              return `${hours ? `:${hours}` : ""}${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            };
            const watchMin = formatTime(a);
            const totalMin = formatTime(d);
            return (
              <div
                key={i?.id}
                className="flex flex-shrink-0 group w-full sm:w-[50%] lg:w-[33.3%] xl:w-[25%] p-[.33rem] aspect-[16/8.5] flex-col gap-2 xl:mb-2"
              >
                <Link
                  to={`/watch/${i?.id}?provider=${i.provider}&ep=${i.episode}`}
                  className={`flex flex-col gap-1 h-full w-full relative rounded-xl overflow-hidden`}
                >
                  <div className="flex-shrink-0 w-full h-full bg-[var(--lightt)] overflow-hidden">
                    <LazyLoadImage
                      effect="blur"
                      src={`${i?.image}`}
                      height={"100%"}
                      width={"100%"}
                      className={`w-full h-full object-cover object-center group-hover:scale-[1.03] brightness-90 smoothie`}
                    />
                    <div className="history-layer absolute w-full h-full z-10 top-0 left-0"></div>
                  </div>
                  <div className="absolute pb-3 px-4 flex flex-col gap-[.4rem] z-20 w-full bottom-0 left-0 tracking-wide">
                    <div className="flex justify-between flex-grow">
                      <div className="flex gap-1 flex-col">
                        <span className="line-clamp-1 !leading-tight text-sm tracking-wide font-medium !capitalize">
                          {i?.title}
                        </span>
                        <span className="text-xs !italic text-white/80">
                          {watchMin} / {totalMin}
                          {i.episode ? ` - Episode: ${i.episode}` : ""}
                        </span>
                      </div>
                      <span className="flex-shrink-0 smoothie backdrop-blur-sm group-hover:bg-white/20 group-active:bg-[var(--pinkk)] p-2 items-center flex justify-center rounded-full h-fit">
                        <Play size={18} fill={`white`} />
                      </span>
                    </div>
                    <div className="bg-white/20">
                      <hr
                        style={{ width: `${perecent}%` }}
                        className={`!border-pink-600 !border-[1px]`}
                      />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <LazyLoadImage
            src={hainn}
            className={`w-[100px] h-[100px] self-center opacity-60 grayscale `}
          />
        )}
      </div>
      {/* {listo?.length > 0 && (
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
      )} */}
    </>
  );
};

export default ContinueWatching;
