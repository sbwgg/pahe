import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import { useParams } from "react-router-dom";
export default function Player({
  option,
  res,
  quality,
  subSize,
  subtitles,
  provider,
  getInstance,
  details,
  ...rest
}) {
  const artRef = useRef();
  const params = useParams();
  function playM3u8(video, url, art) {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;
      art.on("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      art.notice.show = "Unsupported playback format: m3u8";
    }
  }

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current,
      type: "m3u8",
      customType: {
        m3u8: playM3u8,
      },
      fullscreen: true,
      hotkey: true,
      lock: true,
      setting: true,
      playbackRate: true,
      autoOrientation: true,
      pip: true,
      theme: "#d42c72",
      controls: [
        {
          name: "fast-rewind",
          position: "right",
          html: '<svg class="hi-solid hi-rewind inline-block w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/></svg>',
          tooltip: "Backward 5s",
          click: function () {
            art.backward = 5;
          },
        },
        {
          name: "fast-forward",
          position: "right",
          html: '<svg class="hi-solid hi-fast-forward inline-block w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/></svg>',
          tooltip: "Forward 5s",
          click: function () {
            art.forward = 5;
          },
        },
      ],
      settings: [
        subtitles && {
          html: "Subtitle",
          width: 240,
          tooltip: "English",
          selector: [
            {
              html: "Display",
              tooltip: "Show",
              switch: true,
              onSwitch: function (item) {
                item.tooltip = item.switch ? "Hide" : "Show";
                art.subtitle.show = !item.switch;
                return !item.switch;
              },
            },
            {
              html: "Font Size",
              selector: subSize,
              onSelect: function (item) {
                if (item.html === "Small") {
                  art.subtitle.style({ fontSize: "24px" });
                  localStorage.setItem(
                    "subSize",
                    JSON.stringify({
                      size: "24px",
                      html: "Small",
                    })
                  );
                } else if (item.html === "Medium") {
                  art.subtitle.style({ fontSize: "30px" });
                  localStorage.setItem(
                    "subSize",
                    JSON.stringify({
                      size: "30px",
                      html: "Medium",
                    })
                  );
                } else if (item.html === "Large") {
                  art.subtitle.style({ fontSize: "40px" });
                  localStorage.setItem(
                    "subSize",
                    JSON.stringify({
                      size: "40px",
                      html: "Large",
                    })
                  );
                }
              },
            },
            ...subtitles,
          ],
          onSelect: function (item) {
            art.subtitle.switch(item.url, {
              name: item.html,
            });
            return item.html;
          },
        },
        {
          html: "Quality",
          width: 240,
          tooltip: `${res}`,
          selector: quality,
          onSelect: function (item) {
            art.switchQuality(item.url, item.html);
            localStorage.setItem("quality", item.html);
            return item.html;
          },
        },
      ].filter(Boolean),
    });

    art.events.proxy(document, "keydown", (event) => {
      if (event.key === "f" || event.key === "F") {
        art.fullscreen = !art.fullscreen;
      }
    });
    art.events.proxy(document, "keydown", (event) => {
      if (event.key === "enter" || event.key === "Enter") {
        if (art.playing) {
          art.pause();
        } else {
          art.play();
        }
      }
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    let interval;
    const storedProgress = JSON.parse(localStorage.getItem(`history`)) || [];
    const itemIndexToUpdate = storedProgress.findIndex(
      (item) => item.id === parseInt(params.id)
    );

    if (itemIndexToUpdate !== -1) {
      art.on("ready", () => {
        if (storedProgress[itemIndexToUpdate].episode === details?.episode) {
          art.seek = storedProgress[itemIndexToUpdate].timestamp;
          art.play();
        }
      });
    } else {
      const newHistoryItem = {
        id: parseInt(params.id),
        duration: art.duration,
      };
      storedProgress.push(newHistoryItem);
    }
    art.on("video:playing", () => {
      interval = setInterval(() => {
        const lastItemIndex = storedProgress.length - 1;
        if (lastItemIndex >= 0) {
          const itemIndexToUpdate = storedProgress.findIndex(
            (item) => item.id === parseInt(params.id)
          );
          storedProgress[itemIndexToUpdate] = {
            ...details,
            duration: art.duration,
            timestamp: art.currentTime,
          };
        } else {
          storedProgress.push({
            ...details,
            duration: art.duration,
            timestamp: art.currentTime,
          });
        }
        if (art.playing) {
          localStorage.setItem(`history`, JSON.stringify(storedProgress));
        }
      }, 8000);
    });
    art.on("video:pause", () => {
      clearInterval(interval);
    });

    art.on("video:ended", () => {
      clearInterval(interval);
    });

    art.on("destroy", () => {
      clearInterval(interval);
    });
    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, []);

  return <div ref={artRef} {...rest} className={`w-full h-full`}></div>;
}
