import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useVideoResize } from "@/hooks";

import dayjs from "@/plugins/dayjs";

import EndScreen from "@/components/Campaign/EndScreen";
import {
  defaultEndScreen,
  defaultHelloScreen,
} from "../../store/reducers/campaign";
import HelloScreen from "@/components/Campaign/HelloScreen";
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
  const previewEndScreen = useSelector(
    (state) => state.campaign.previewEndScreen
  );
  const previewHelloScreen = useSelector(
    (state) => state.campaign.previewHelloScreen
  );
  const previewVideo = useSelector((state) => state.campaign.previewVideo);
  const progression = useSelector((state) => state.campaign.progression);
  const video = useSelector((state) => state.campaign.video);
  const videoSeeking = useSelector((state) => state.campaign.videoSeeking);
  //
  const videosRef = useSelector((state) => state.campaign.videosRef);
  const currentVideo = useSelector((state) => state.campaign.currentVideo);
  const videosOffset = useSelector((state) => state.campaign.videosOffset);
  //

  const [resume, setResume] = useState(false);

  useEffect(() => {
    setResume(preview.show || helloScreen.name || endScreen.name || video.url);
  }, [preview.show, helloScreen, endScreen, video]);

  const playerRef = useRef();
  const { width: playerWidth } = useVideoResize({
    ref: playerRef,
    autoWidth: true,
  });
  const videoRefCb = useCallback(
    (node) => {
      if (node !== null) {
        // dispatch({ type: "SET_VIDEO_REF", data: node });
        dispatch({ type: "SET_VIDEOS_REF", data: node });
        // if (Object.keys(videoRef).length > 0) {
        //   videoRef.addEventListener("playing", handlePlaying);
        //   videoRef.addEventListener("seeking", handleSeeking);
        //   const currentTime = (progression - helloScreen.duration) / 1000;
        //   videoRef.currentTime = currentTime > 0 ? currentTime : 0;
        // }
      } else {
        // if (Object.keys(videoRef).length > 0) {
        //   videoRef.removeEventListener("seeking", handleSeeking);
        //   videoRef.removeEventListener("playing", handlePlaying);
        // }
      }
    },
    [video]
  );

  useEffect(() => {
    const handleSeeking = () =>
      dispatch({ type: "SET_VIDEO_SEEKING", data: true });
    const handlePlaying = () =>
      dispatch({ type: "SET_VIDEO_SEEKING", data: false });

    if (videosRef.length === video.length) {
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
      (progression > helloScreen.duration &&
        progression < duration - endScreen.duration &&
        videoSeeking &&
        videosRef[currentVideo].currentTime !== 0) ||
      (!isPlaying && progression !== 0)
    ) {
      clearInterval(interval);
    } else if (isPlaying) {
      interval = setInterval(() => {
        dispatch({
          type: "SET_PROGRESSION",
          data: progression + 100,
        });
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
      videosRef[video.length - 1].currentTime = 0;
      videosRef[video.length - 1].pause();
    }
    if (progression < 0) {
      dispatch({
        type: "SET_PROGRESSION",
        data: 0,
      });
    }

    // if is timeline ended
    if (videosRef[video.length - 1]?.ended) {
      videosRef[0].pause();
      videosRef[0].currentTime = 0;
    } else if (videosRef[currentVideo]?.ended && currentVideo < video.length) {
      videosRef[currentVideo].currentTime = 0;
      videosRef[currentVideo].pause();
      videosRef[currentVideo + 1].currentTime = 0;
      videosRef[currentVideo + 1].play();
      dispatch({
        type: "SET_CURRENT_VIDEO",
        data: currentVideo + 1,
      });
    } else if (!videosRef[currentVideo]?.paused && isPlaying) {
      videosRef[currentVideo]?.play();
    }
    //
    else if (
      videosRef.length > 0 &&
      !videosRef[currentVideo].paused &&
      (progression < helloScreen.duration ||
        progression > duration - endScreen.duration)
    ) {
      videosRef[currentVideo].currentTime = 0;
      videosRef[currentVideo].pause();
    } else if (
      videosRef.length > 0 &&
      videosRef[currentVideo]?.paused &&
      progression > helloScreen.duration &&
      progression < duration - endScreen.duration &&
      isPlaying
    ) {
      videosRef[currentVideo]?.play();
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
    return video.map((elem, i) => (
      <video
        ref={videoRefCb}
        key={elem.url}
        src={elem.url}
        height="100%"
        width="100%"
        // onTimeUpdate={handleOnTimeUpdate}
        style={{
          display:
            progression > helloScreen.duration &&
            progression < duration - endScreen.duration &&
            currentVideo === i
              ? "block"
              : "none",
        }}
      />
    ));
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
              (previewVideo.url || video.url ? (
                <video
                  key={previewVideo.url}
                  controls
                  height="100%"
                  width="100%"
                >
                  <source
                    src={previewVideo.url || video.url}
                    type="video/mp4"
                  />
                  Sorry, your browser doesn't support embedded videos.
                </video>
              ) : (
                <Placeholder of={preview.element} />
              ))}
            {preview.element === "helloScreen" &&
              (Object.keys(previewHelloScreen).length == 0 &&
              (JSON.stringify(helloScreen) ===
                JSON.stringify(defaultHelloScreen) ||
                !helloScreen.name) ? (
                <Placeholder of={preview.element} />
              ) : (
                <HelloScreen
                  data={
                    Object.keys(previewHelloScreen).length > 0
                      ? previewHelloScreen
                      : helloScreen
                  }
                />
              ))}
            {preview.element === "endScreen" &&
              (Object.keys(previewEndScreen).length == 0 &&
              (JSON.stringify(endScreen) === JSON.stringify(defaultEndScreen) ||
                !endScreen.name) ? (
                <Placeholder of={preview.element} />
              ) : (
                <EndScreen
                  data={
                    Object.keys(previewEndScreen).length > 0
                      ? previewEndScreen
                      : endScreen
                  }
                />
              ))}
            {logo && <Logo data={logo} />}
          </div>
        ) : (
          !resume && <Placeholder of="all" />
        )}
        <div style={{ display: preview.show || !resume ? "none" : "block" }}>
          {renderVideos()}
          {progression < helloScreen.duration && (
            <HelloScreen data={helloScreen} />
          )}
          {progression >= duration - endScreen.duration && (
            <EndScreen data={endScreen} />
          )}
          <Logo data={logo} />
        </div>
      </div>
      <div className={styles.controls}>
        <img
          onClick={async () => {
            dispatch({ type: "HIDE_PREVIEW" });
            dispatch({ type: isPlaying ? "PAUSE" : "PLAY" });
            setResume(true);
            if (
              progression > helloScreen.duration &&
              progression < duration - endScreen.duration
            ) {
              isPlaying
                ? videosRef[currentVideo]?.pause()
                : videosRef[currentVideo]?.play();
            }
          }}
          src={isPlaying ? "/assets/video/pause.svg" : "/assets/video/play.svg"}
        />
        <p className={styles.progression}>{displayProgression()}</p>
      </div>
    </div>
  );
};

export default Player;
