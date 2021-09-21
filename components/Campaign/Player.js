import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getDataByType, useVideoResize } from "@/hooks";

import dayjs from "@/plugins/dayjs";

import EndScreen from "@/components/Campaign/EndScreen";

import Logo from "@/components/Campaign/Logo";

import styles from "@/styles/components/Campaign/Player.module.sass";
import Placeholder from "./Placeholder";

const Player = () => {
  const dispatch = useDispatch();

  const endScreen = useSelector((state) => state.campaign.endScreen);
  const duration = useSelector((state) => state.campaign.duration);
  const helloScreen = useSelector((state) => state.campaign.helloScreen);
  const isPlaying = useSelector((state) => state.campaign.isPlaying);
  const logo = useSelector((state) => state.campaign.logo);
  const preview = useSelector((state) => state.campaign.preview);

  const previewVideo = useSelector((state) => state.campaign.previewVideo);
  const progression = useSelector((state) => state.campaign.progression);
  const contents = useSelector((state) => state.campaign.contents);
  const videoSeeking = useSelector((state) => state.campaign.videoSeeking);
  //
  const videosRef = useSelector((state) => state.campaign.videosRef);
  const currentVideo = useSelector((state) => state.campaign.currentVideo);
  const videosOffset = useSelector((state) => state.campaign.videosOffset);
  //

  const [resume, setResume] = useState(false);

  useEffect(() => {
    setResume(
      preview.show || helloScreen.name || endScreen.name || contents.url
    );
  }, [preview.show, helloScreen, endScreen, contents]);

  const playerRef = useRef();
  const { width: playerWidth } = useVideoResize({
    ref: playerRef,
    autoWidth: true,
  });
  const videoRefCb = useCallback(
    (node) => {
      if (node !== null) {
        dispatch({ type: "SET_VIDEOS_REF", data: node });
      } else {
      }
    },
    [contents]
  );

  const getVideoIndex = (max) => {
    let count = -1;
    for (let i = 0; i <= max; i++) {
      if (contents[i].type === "video") count++;
    }
    if (count < 0) count = 0;
    return count;
  };

  useEffect(() => {
    const handleSeeking = () =>
      dispatch({ type: "SET_VIDEO_SEEKING", data: true });
    const handlePlaying = () =>
      dispatch({ type: "SET_VIDEO_SEEKING", data: false });

    if (videosRef.length === contents.length) {
      for (let i = 0; i < videosRef; i++) {
        videosRef[i].addEventListener("playing", handlePlaying);
        videosRef[i].addEventListener("seeking", handleSeeking);
      }
    }
    return () => {
      if (videosRef.length > 0)
        for (let i = 0; i < videosRef; i++) {
          videosRef[i].removeEventListener("seeking", handleSeeking);
          videosRef[i].removeEventListener("playing", handlePlaying);
        }
    };
  }, [videosRef]);

  useEffect(() => {
    let interval = null;
    if (
      (videoSeeking &&
        videosRef[getVideoIndex(currentVideo)].currentTime !== 0) ||
      (!isPlaying && progression !== 0)
    ) {
      clearInterval(interval);
    } else if (isPlaying) {
      interval = setInterval(() => {
        if (
          videosRef[getVideoIndex(currentVideo)]?.readyState === 4 ||
          contents[currentVideo].type !== "video"
        ) {
          dispatch({
            type: "SET_PROGRESSION",
            data: progression + 100,
          });
        }
      }, 100);
    }
    if (progression >= duration) {
      dispatch({ type: "PAUSE" });
      dispatch({
        type: "SET_PROGRESSION",
        data: 0,
      });
      dispatch({
        type: "SET_CURRENT_VIDEO",
        data: 0,
      });
    }
    if (progression < 0) {
      dispatch({
        type: "SET_PROGRESSION",
        data: 0,
      });
    }

    for (let i = 0; i < contents.length; i++) {
      if (
        progression > videosOffset[i] * 1000 &&
        progression <
          (videosOffset[i] + getDataByType(contents[i]).duration) * 1000 &&
        currentVideo !== i
      ) {
        if (contents[currentVideo].type === "video") {
          videosRef[getVideoIndex(currentVideo)].pause();
        }
        dispatch({
          type: "SET_CURRENT_VIDEO",
          data: i,
        });
      }
    }
    if (progression >= duration) {
    } else if (!videosRef[getVideoIndex(currentVideo)]?.paused && !isPlaying) {
      videosRef[getVideoIndex(currentVideo)]?.pause();
    } else if (
      contents[currentVideo].type === "video" &&
      !videosRef[getVideoIndex(currentVideo)]?.paused &&
      isPlaying &&
      !videosRef[getVideoIndex(currentVideo)]?.ended
    ) {
      videosRef[getVideoIndex(currentVideo)]?.play();
    } else if (
      contents[currentVideo].type === "video" &&
      videosRef.length > 0 &&
      videosRef[getVideoIndex(currentVideo)]?.paused &&
      isPlaying &&
      !videosRef[getVideoIndex(currentVideo)]?.ended
    ) {
      videosRef[getVideoIndex(currentVideo)]?.play();
    }
    return () => clearInterval(interval);
  }, [isPlaying, progression, videoSeeking]);

  const displayProgression = () => {
    const t = dayjs.duration(progression);
    const m = t.minutes();
    const s = t.seconds();
    const ms = t.milliseconds();
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}:${
      ms < 100 ? "0" : ms.toString().substring(0, 1)
    }`;
  };

  const renderVideos = () => {
    if (contents.length > 0)
      return contents.map(
        (elem, i) =>
          elem.type === "video" && (
            <video
              ref={videoRefCb}
              key={elem.video.url}
              src={elem.video.url}
              height="100%"
              width="100%"
              // onTimeUpdate={handleOnTimeUpdate}
              style={{
                display: currentVideo === i ? "block" : "none",
              }}
            />
          )
      );
  };

  const renderTemplates = () => {
    if (contents.length > 0) {
      return contents.map(
        (elem, i) =>
          elem.type === "template" &&
          currentVideo === i && <EndScreen key={i} data={elem.template} />
      );
    }
  };

  return (
    <div className={styles.player}>
      <div
        ref={playerRef}
        className={styles.video}
        style={{ width: playerWidth }}
      >
        {preview.show ? (
          <div>
            {preview.element === "record" && (
              <Placeholder of={preview.element} />
            )}
            {preview.element === "video" &&
              (previewVideo.url || contents.url ? (
                <video
                  key={previewVideo.url}
                  controls
                  height="100%"
                  width="100%"
                >
                  <source
                    src={previewVideo.url || contents.url}
                    type="video/mp4"
                  />
                  Sorry, your browser doesn't support embedded videos.
                </video>
              ) : (
                <Placeholder of={preview.element} />
              ))}
            {logo && <Logo data={logo} />}
          </div>
        ) : (
          !resume && <Placeholder of="all" />
        )}
        <div style={{ display: preview.show || !resume ? "none" : "block" }}>
          {renderVideos()}
          {renderTemplates()}

          <Logo data={logo} />
        </div>
      </div>
      <div className={styles.controls}>
        <img
          onClick={async () => {
            dispatch({ type: "HIDE_PREVIEW" });
            dispatch({ type: isPlaying ? "PAUSE" : "PLAY" });
            setResume(true);
          }}
          src={isPlaying ? "/assets/video/pause.svg" : "/assets/video/play.svg"}
        />
        <p className={styles.progression}>{displayProgression()}</p>
      </div>
    </div>
  );
};

export default Player;
