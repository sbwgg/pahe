import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context/AppContext";
import Player from "./ArtPlayer";
const fontSize = [
  {
    html: "Small",
    size: "24px",
  },
  {
    html: "Medium",
    size: "30px",
  },
  {
    html: "Large",
    size: "40px",
  },
];
const VideoPlayer = ({ id, provider, data, poster, details }) => {
  const { mProxy, mLocal, mcProxy } = useContext(Context);
  const [url, setUrl] = useState();
  const [source, setSource] = useState();
  const [resolution, setResolution] = useState("auto");
  const [subtitle, setSubtitle] = useState();
  const [subSize, setSubSize] = useState({ size: "16px", html: "Small" });
  const [defSize, setDefSize] = useState();
  const [defSub, setDefSub] = useState();
  useEffect(() => {
    if (!data || data.length === 0) {
      // If data is null, exit early
      return;
    }
    const resol = localStorage.getItem("quality");
    if (provider !== "zoro") {
      if (resol) {
        setResolution(resol);
      }
    }
    const sub = JSON.parse(localStorage.getItem("subSize"));
    if (provider !== "gogoanime") {
      const size = fontSize?.map((s) => {
        const isDefault = !sub ? s.html === "Small" : s.html === sub?.html;
        return {
          ...(isDefault && {
            default: true,
          }),
          html: s.html,
          size: s.size,
        };
      });
      const defSize = size?.map((s) => s?.default === true);
      setDefSize(defSize);
      setSubSize(size);
    }
    async function dabadoo() {
      try {
        const source = data?.sources?.map((items) => {
          const isDefault =
            resolution === "auto"
              ? items?.quality === "default" || items?.quality === "auto"
              : items?.quality === resolution;
          return {
            ...(isDefault && { default: true }),
            html: items?.quality === "default" ? "auto" : items?.quality,

            url:
              provider === "gogoanime" || provider === "zoro"
                ? // ? `${items?.url}`
                  `${mProxy}/cors?url=${items?.url}`
                : `${mcProxy}` +
                  encodeURIComponent(items?.url) ,
          };
        });
        const defSource = source?.find((i) => i?.default === true);

        setUrl(defSource?.url);
        setSource(source);
        if (Array.isArray(data?.subtitles)) {
          let subtitle = data?.subtitles
            ?.filter((subtitle) => subtitle?.lang !== "Thumbnails")
            ?.map((subtitle) => {
              const isEnglish = subtitle?.lang === "English";
              return {
                ...(isEnglish && { default: true }),
                url: subtitle?.url,
                html: `${subtitle?.lang}`,
              };
            });

          const defSub = data?.subtitles?.find((i) => i.lang === "English");
          setDefSub(defSub?.url);
          setSubtitle(subtitle);
        }
      } catch (err) {
        console.error(err);
      }
    }
    dabadoo();
    if (provider !== "gogoanime") {
      const size = fontSize.map((i) => {
        const isDefault = i.html === "Small";
        return {
          ...(isDefault && { default: true }),
          html: i.html,
          size: i.size,
        };
      });

      const defSize = size?.find((i) => i?.default === true);
      setDefSize(defSize);
      setSubSize(size);
    }
  }, [data, provider, resolution]);
  return (
    <div className="w-full aspect-video outline-none border-none">
      {url ? (
        <Player
          key={url}
          details={details}
          option={{
            url: `${url}`,
            autoplay: false,
            screenshot: true,
            poster: poster ? poster : "",
            ...(provider === "zoro" && {
              subtitle: {
                url: `${defSub}`,
                // type: "vtt",
                encoding: "utf-8",
                default: true,
                name: "English",
                escape: false,
                style: {
                  color: "#FFFF",
                  fontSize: `${defSize?.size}`,
                },
              },
            }),
          }}
          res={resolution}
          quality={source}
          subSize={subSize}
          subtitles={subtitle}
          provider={provider}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center p-1">
          {/* <div className="golgol"></div> */}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
