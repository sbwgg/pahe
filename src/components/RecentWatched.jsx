import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import hainn from "../assets/wathcGirl.png";

import { ChevronRight, Play } from "lucide-react";
const RecentWatched = ({ listo }) => {
  return (
    <div className="max-w-[1300px] 2xl:max-w-[1400px] mx-auto w-full my-5 lg:my-8 flex gap-2 md:gap-3 flex-col">
      <Link
        to={`user/history`}
        className="text-lg sm:text-xl lg:text-2xl hover:brightness-[.85] smoothie font-medium lg:font-normal tracking-[0.015em] lg:tracking-normal 2xl:text-[1.6rem] font-['Poppins'] items-center gap-2 flex px-2 "
      >
        <div className="h-6 md:h-8 rounded-md w-[6px] bg-[var(--pink)]"></div>
        Continue Watching
        <span className="ml-auto md:m-0">
          <ChevronRight size={22} className={`lg:hidden`} />
          <ChevronRight size={25} className={`hidden lg:block`} />
        </span>
      </Link>
      <div className="flex overflow-x-auto mb-auto mx-auto w-full pl-2">
        {listo?.map((i) => {
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
              className="flex flex-shrink-0 group w-[85%] sm:w-[50%] md:w-[33.3%] xl:w-[25%] p-[.37rem] aspect-[16/8.3] flex-col gap-2 xl:mb-2"
            >
              <Link
                to={`/watch/${i?.id}?provider=${i.provider}&ep=${i.episode}`}
                className={`flex flex-col gap-1 h-full w-full relative rounded-xl overflow-hidden`}
              >
                <div className="flex-shrink-0 w-full h-full bg-[var(--lightt)]">
                  <LazyLoadImage
                    effect="blur"
                    src={`${i?.image}`}
                    height={"100%"}
                    width={"100%"}
                    className={`w-full h-full object-cover group-hover:scale-[1.03] brightness-90 smoothie`}
                  />
                  <div className="history-layer absolute w-full h-full z-10 top-0 left-0"></div>
                </div>
                <div className="absolute p-3 px-4 flex flex-col gap-[.4rem] z-20 w-full bottom-0 left-0 tracking-wide">
                  <div className="flex justify-between flex-grow">
                    <div className="flex gap-1 flex-col">
                      <span className="line-clamp-1 !leading-tight text-sm md:text-[.9rem] font-medium !capitalize">
                        {i?.title}
                      </span>
                      <span className="text-xs !italic text-white/80">
                        {watchMin} / {totalMin}
                        {i.episode ? ` - Episode: ${i.episode}` : ""}
                      </span>
                    </div>
                    <span className="flex-shrink-0 smoothie  backdrop-blur-sm group-hover:bg-white/20 group-active:bg-[var(--pinkk)] p-2 items-center flex justify-center rounded-full h-fit">
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
        })}
      </div>
    </div>
  );
};

export default RecentWatched;
