import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getDataByType, useVideoResize } from "@/hooks";

import dayjs from "@/plugins/dayjs";

import Overlays from "./Campaign/OverlaysVideoPlayer";
import Logo from "@/components/Campaign/Logo";

import styles from "@/styles/components/VideoPlayer.module.sass";

const helloScreen = { duration: 0 }; // need to remove, only here temporary to fix bug
const endScreen = { duration: 0 }; // need to remove, only here temporary to fix bug

const VideoPlayer = ({
  contact,
  data = {},
  onPause = () => {},
  onPlay = () => {},
}) => {
  const dispatch = useDispatch();
  const { logo, finalVideo, contents } = data;

  const videosOffset = useSelector((state) => state.campaign.videosOffset);
  const duration = useSelector((state) => state.videoPlayer.duration);
  const isPlaying = useSelector((state) => state.videoPlayer.isPlaying);
  const progression = useSelector((state) => state.videoPlayer.progression);
  const activeContent = useSelector((state) => state.videoPlayer.activeContent);
  const timelineDraggable = useSelector(
    (state) => state.videoPlayer.timelineDraggable
  );
  const videoRef = useSelector((state) => state.videoPlayer.videoRef);
  const videoSeeking = useSelector((state) => state.videoPlayer.videoSeeking);
  const volume = useSelector((state) => state.videoPlayer.volume);
  const volumeDraggable = useSelector(
    (state) => state.videoPlayer.volumeDraggable
  );
  const volumeMuted = useSelector((state) => state.videoPlayer.volumeMuted);

  const [autoPlayFlag, setAutoPlayFlag] = useState(false);
  const [replay, setReplay] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showDivPlayButton, setShowDivPlayButton] = useState(false);

  const playerRef = useRef();
  const timelineRef = useRef();
  const volumeRef = useRef();
  const { height, width } = useVideoResize({
    ref: playerRef,
    autoHeight: true,
  });

  useEffect(() => {
    const data = Array.from(contents);
    dispatch({ type: "CALC_VIDEOS_OFFSET", data });
  }, []);
  useEffect(() => {
    const handleMouseUp = (e) => {
      if (timelineRef.current) {
        dispatch({ type: "videoPlayer/TIMELINE_DRAGGABLE", data: false });
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [timelineRef]);

  useEffect(() => {
    const handleMouseUp = (e) => {
      if (volumeRef.current) {
        dispatch({ type: "videoPlayer/VOLUME_DRAGGABLE", data: false });
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [volumeRef]);

  useEffect(() => {
    let interval = null;
    if (
      (progression > helloScreen.duration &&
        progression < duration &&
        videoSeeking &&
        videoRef.currentTime !== 0) ||
      (!isPlaying && progression !== 0)
    ) {
      clearInterval(interval);
    } else if (
      progression > helloScreen.duration &&
      progression < duration - endScreen.duration &&
      isPlaying
    ) {
      interval = setInterval(() => {
        const videoProg = videoRef.currentTime * 1000;
        if (videoProg > progression) {
          dispatch({
            type: "videoPlayer/SET_PROGRESSION",
            data: videoProg,
          });
        }
      }, 50);
    } else if (isPlaying) {
      interval = setInterval(() => {
        dispatch({
          type: "videoPlayer/SET_PROGRESSION",
          data: progression + 50,
        });
      }, 50);
    }
    if (progression > duration) {
      finish();
    }
    if (progression < 0) {
      dispatch({
        type: "videoPlayer/SET_PROGRESSION",
        data: 0,
      });
    }

    for (let i = 0; i < contents.length; i++) {
      if (
        progression > videosOffset[i] * 1000 &&
        progression <
          (videosOffset[i] + getDataByType(contents[i]).duration) * 1000 &&
        activeContent !== i
      ) {
        dispatch({
          type: "videoPlayer/SET_ACTIVE_CONTENT",
          data: i,
        });
      }
    }

    if (videoRef.ended && !videoRef.paused) {
      videoRef.currenTime = 0;
      videoRef.pause();
      onPause();
    } else if (
      Object.keys(videoRef).length > 0 &&
      !videoRef.paused &&
      (progression < helloScreen.duration ||
        progression > duration - endScreen.duration)
    ) {
      videoRef.pause();
      videoRef.currenTime = 0;
      onPause();
    } else if (
      Object.keys(videoRef).length > 0 &&
      videoRef.paused &&
      progression > helloScreen.duration &&
      progression < duration - endScreen.duration &&
      isPlaying
    ) {
      videoRef.play();
      onPlay();
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, progression, videoSeeking]);

  // play the video on component did mount
  useEffect(() => {
    tryToPlayVideo();
  }, [videoRef.play]);

  const finish = () => {
    dispatch({ type: "videoPlayer/PAUSE" });
    setReplay(true);
  };

  const restart = () => {
    setReplay(false);
    dispatch({ type: "videoPlayer/SET_PROGRESSION", data: 0 });
    setTimeout(playOrPause, 1200);
  };

  const tryToPlayVideo = () => {
    if (videoRef.play) {
      videoRef.muted = true;
      videoRef
        .play()
        .then(() => {
          videoRef.pause();
          videoRef.muted = false;
        })
        .catch((err) => {
          console.log("can't play video ", err);
        });
    }
  };

  useEffect(() => {
    setShowPlayButton(true);
   // setShowDivPlayButton(true);
    return () => {
      dispatch({ type: "videoPlayer/PAUSE" });
      dispatch({ type: "videoPlayer/SET_PROGRESSION", data: 0 });
      dispatch({ type: "videoPlayer/SET_DURATION", data: 0 });
    };
  }, []);

  const videoRefCb = useCallback(
    (node) => {
      const handleSeeking = () =>
        dispatch({ type: "videoPlayer/SET_VIDEO_SEEKING", data: true });
      const handlePlaying = () =>
        dispatch({ type: "videoPlayer/SET_VIDEO_SEEKING", data: false });

      if (node !== null) {
        dispatch({ type: "videoPlayer/SET_VIDEO_REF", data: node });
        dispatch({ type: "videoPlayer/SET_DURATION", data: data.duration });

        if (Object.keys(videoRef).length > 0) {
          videoRef.addEventListener("playing", handlePlaying);
          videoRef.addEventListener("seeking", handleSeeking);
          const currentTime = Math.round(progression) / 1000;
          videoRef.currentTime = currentTime > 0 ? currentTime : 0;
        }
      } else {
        if (Object.keys(videoRef).length > 0) {
          videoRef.removeEventListener("seeking", handleSeeking);
          videoRef.removeEventListener("playing", handlePlaying);
        }
      }
    },
    [finalVideo, videoRef]
  );

  const displayProgression = (value) => {
    const t = dayjs.duration(parseInt(value, 10));
    const m = t.minutes();
    const s = t.seconds();
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  };

  const seekTo = (e) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const seekProgression =
      (position / timelineRef.current.offsetWidth) * duration;
    const progression = seekProgression > duration ? duration : seekProgression;
    setReplay(progression >= duration);
    setShowPlayButton(false);
    dispatch({ type: "videoPlayer/SET_PROGRESSION", data: progression });
    if (Object.keys(videoRef).length > 0) {
      const currentTime = (progression - helloScreen.duration) / 1000;
      videoRef.currentTime = currentTime > 0 ? currentTime : 0;
    }
  };

  const playOrPause = () => {
    setShowPlayButton(false);
    if (!autoPlayFlag) {
      tryToPlayVideo();
      setAutoPlayFlag(true);
    }
    dispatch({ type: isPlaying ? "videoPlayer/PAUSE" : "videoPlayer/PLAY" });
    if (
      progression > helloScreen.duration &&
      progression < duration - endScreen.duration
    ) {
      isPlaying ? videoRef.pause() : videoRef.play();
      isPlaying ? onPause() : onPlay();
    }
  };

  const setVolume = (e) => {
    const rect = volumeRef.current.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const volume = position / volumeRef.current.offsetWidth;
    const volumeFormatted = volume < 0 ? 0 : volume > 1 ? 1 : volume;
    dispatch({ type: "videoPlayer/SET_VOLUME", data: volumeFormatted });
    if (Object.keys(videoRef).length > 0) {
      videoRef.volume = volumeFormatted;
    }
  };

  const toggleMute = () => {
    if (volume > 0 && !volumeMuted) {
      dispatch({ type: "videoPlayer/SET_VOLUME_MUTED", data: true });
      videoRef.volume = 0;
    } else if (volume <= 0 && !volumeMuted) {
      dispatch({ type: "videoPlayer/SET_VOLUME", data: 100 });
    } else if (volumeMuted) {
      dispatch({ type: "videoPlayer/SET_VOLUME_MUTED", data: false });
      videoRef.volume = volume;
    }
  };

  const PlayButton = () => {
    return (
      <div className={styles.playButton}>
        <img
          className={styles.playButtonImage}
          src="/assets/video/play.png"
        ></img>
      </div>
    );
  };

  const renderScreens = () => {
    if (contents.length > 0) {
      return contents.map(
        (elem, i) =>
          elem.type === "screen" &&
          activeContent === i && (
            <div
              key={i}
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                background: elem.screen.background.color,
              }}
            />
          )
      );
    }
  };
  const renderFirstScreen=()=>{
    if (progression ===0 && contents.length > 0 && contents[0].type==="screen" && !isPlaying) {
           return (
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                background: contents[0].screen.background.color,
              }}
            >
               {contents[0].texts.length > 0 && 
               (<span style={{ color:contents[0].texts[0]['color'] , fontSize:contents[0].texts[0]['fontSize'] * 30,
               left :  `${contents[0].texts[0]['position']['x']-5}%`, top :  `${contents[0].texts[0]['position']['x']}%`,position:'absolute'
                }}>
                    {contents[0].texts[0]['value']}
              </span>)
              }
              </div>
          )
      
    }
  }

  return (
    <div
      className={styles.videoPlayer}
      onMouseUp={() => {
        dispatch({ type: "videoPlayer/TIMELINE_DRAGGABLE", data: false });
        dispatch({ type: "videoPlayer/VOLUME_DRAGGABLE", data: false });
      }}
      onMouseMove={(e) => {
        timelineDraggable && seekTo(e);
        volumeDraggable && setVolume(e);
      }}
    >
      <div
        className={styles.player}
        onClick={playOrPause}
        ref={playerRef}
        style={{ height }}
      >
        <video
          className={styles.videoElement}
          height="100%"
          width="100%"
          key={finalVideo.url}
          onCanPlay={()=>setShowDivPlayButton(true)}
          playsInline={true}
          ref={videoRefCb}
          src={finalVideo.url}
        />

        {renderFirstScreen()}
        {renderScreens()}
        {width > 0 && (
          <Overlays
            contact={contact}
            contents={contents}
            activeContent={activeContent}
            playerWidth={width}
          />
        )}

        
        <Logo data={logo} />
        {showPlayButton && <PlayButton />}
        {!showDivPlayButton && <div className={styles.playButton}>
        <img
          className={styles.loadingImg}
          src="/assets/common/loading.gif"
        ></img>
      </div>}
      </div>

      {showDivPlayButton &&
      <div className={styles.controls}>
        <div
          className={styles.timeline}
          onClick={(e) => seekTo(e)}
          onMouseDown={(e) =>
            dispatch({ type: "videoPlayer/TIMELINE_DRAGGABLE", data: true })
          }
          onMouseUp={(e) =>
            dispatch({ type: "videoPlayer/TIMELINE_DRAGGABLE", data: false })
          }
          onMouseMove={(e) => timelineDraggable && seekTo(e)}
          ref={timelineRef}
        >
          <div className={styles.timelineDuration}>
            <div
              className={styles.timelineProgression}
              style={{ width: `${(progression / duration) * 100}%` }}
            />
          </div>
        </div>
        <img
          className={styles.playPause}
          onClick={replay ? restart : playOrPause}
          src={
            replay
              ? "/assets/video/replayW.svg"
              : isPlaying
              ? "/assets/video/pauseW.svg"
              : "/assets/video/playW.svg"
          }
        />
        <div className={styles.volume}>
          <div className={styles.volumeIcon} onClick={toggleMute}>
            {volume > 0.2 && !volumeMuted && (
              <img src="/assets/video/volumeHigh.svg" />
            )}
            {volume <= 0.2 && volume > 0 && !volumeMuted && (
              <img src="/assets/video/volumeLow.svg" />
            )}
            {(volume <= 0 || volumeMuted) && (
              <img src="/assets/video/volumeOff.svg" />
            )}
          </div>
          <div
            className={styles.volumeBar}
            onClick={(e) => setVolume(e)}
            onMouseDown={(e) =>
              dispatch({ type: "videoPlayer/VOLUME_DRAGGABLE", data: true })
            }
            onMouseUp={(e) =>
              dispatch({ type: "videoPlayer/VOLUME_DRAGGABLE", data: false })
            }
            onMouseMove={(e) => volumeDraggable && setVolume(e)}
            ref={volumeRef}
          >
            <div className={styles.volumeTotal}>
              <div
                className={styles.volumeAmount}
                style={{ width: `${volumeMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className={styles.progression}>
          <p>{displayProgression(progression)}</p>
          <span>/</span>
          <p>{displayProgression(duration)}</p>
        </div>
      </div>
}
    </div>
  );
};

export default VideoPlayer;
