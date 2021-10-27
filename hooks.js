import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useVideoResize = ({ autoHeight, autoWidth, ref }) => {
  const getDimensions = () => ({
    width: autoWidth
      ? Math.round((ref.current.offsetHeight / 9) * 16)
      : ref.current.offsetWidth,
    height: autoHeight
      ? Math.round((ref.current.offsetWidth / 16) * 9)
      : ref.current.offsetHeight,
  });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => setDimensions(getDimensions());

    if (ref.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return dimensions;
};

export const useDebounce = (effect, delay, deps) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
};

export const getDataByType = (elem) => {
  switch (elem.type) {
    case "video":
      return {
        name: elem.video.name,
        duration: elem.video.metadata.duration,
      };
    case "screen":
      return { name: elem.screen.name, duration: elem.screen.duration };
  }
};

const getVideoIndex = (contents, max) => {
  let count = -1;
  for (let i = 0; i <= max; i++) {
    if (contents[i].type === "video") count++;
  }
  return count;
};

export const handleProgression = (
  contents,
  videosOffset,
  progression,
  dispatch,
  videosRef,
  currentVideo,
  preview
) => {
  console.log("videosRef", videosRef);
  dispatch({ type: "SET_PROGRESSION", data: progression });
  if (contents.length > 0) {
    for (let i = 0; i < contents.length; i++) {
      if (
        progression > videosOffset[i] * 1000 &&
        progression <
          (videosOffset[i] + getDataByType(contents[i]).duration) * 1000
      ) {
        if (contents[i].type === "video") {
          const currentTime = progression / 1000 - videosOffset[i];
          videosRef[getVideoIndex(contents, i)].currentTime =
            currentTime > 0 ? currentTime : 0;
        }

        if (i !== currentVideo) {
          if (contents[currentVideo]?.type === "video") {
            videosRef[getVideoIndex(contents, currentVideo)].currentTime = 0;
            videosRef[getVideoIndex(contents, currentVideo)].pause();
          }
          dispatch({
            type: "SET_CURRENT_VIDEO",
            data: i,
          });
          dispatch({
            type: "SET_CURRENT_OVERLAY",
            data: i,
          });
        }
      }
    }
  }
  if (preview.show) {
    dispatch({ type: "HIDE_PREVIEW" });
  } else {
  }
};
