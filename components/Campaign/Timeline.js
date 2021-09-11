import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import styles from "@/styles/components/Campaign/Timeline.module.sass";

const Timeline = () => {
  const dispatch = useDispatch();

  const duration = useSelector((state) => state.campaign.duration);
  const endScreen = useSelector((state) => state.campaign.endScreen);
  const helloScreen = useSelector((state) => state.campaign.helloScreen);
  const preview = useSelector((state) => state.campaign.preview);
  const progression = useSelector((state) => state.campaign.progression);
  const timelineDraggable = useSelector(
    (state) => state.campaign.timelineDraggable
  );
  const video = useSelector((state) => state.campaign.video);
  const videoRef = useSelector((state) => state.campaign.videoRef);
  const videosRef = useSelector((state) => state.campaign.videosRef);
  const currentVideo = useSelector((state) => state.campaign.currentVideo);
  const videosOffset = useSelector((state) => state.campaign.videosOffset);

  const ref = useRef();
  useEffect(() => {
    const handleMouseUp = (e) => {
      if (ref.current) {
        dispatch({ type: "TIMELINE_DRAGGABLE", data: false });
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref]);

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = Math.min(
      Math.max(e.clientX - rect.left, 0),
      ref.current.offsetWidth
    );
    const progression = (position / ref.current.offsetWidth) * duration;
    dispatch({ type: "SET_PROGRESSION", data: progression });
    if (videosRef.length > 0) {
      for (let i = 0; i < video.length; i++) {
        if (
          progression > videosOffset[i] * 1000 &&
          progression < (videosOffset[i + 1] * 1000 || duration)
        ) {
          const currentTime =
            (progression - helloScreen.duration) / 1000 - videosOffset[i];
          videosRef[i].currentTime = currentTime > 0 ? currentTime : 0;
          dispatch({
            type: "SET_CURRENT_VIDEO",
            data: i,
          });
        }
      }
    }
    if (preview.show) {
      dispatch({ type: "HIDE_PREVIEW" });
    }
  };

  return (
    <div
      className={styles.timeline}
      onClick={(e) => seekTo(e)}
      onMouseDown={(e) => dispatch({ type: "TIMELINE_DRAGGABLE", data: true })}
      onMouseUp={(e) => dispatch({ type: "TIMELINE_DRAGGABLE", data: false })}
      onMouseMove={(e) => timelineDraggable && seekTo(e)}
      ref={ref}
      style={{
        gridTemplateColumns: `${helloScreen.duration ? `auto` : ""} ${
          Object.keys(video).length > 0 ? "1fr" : ""
        } ${endScreen.duration ? `auto` : ""}`,
      }}
    >
      <span
        className={styles.cursor}
        style={{
          left: `${(progression / duration) * 100}%`,
        }}
      />
      {helloScreen.duration > 0 && (
        <div className={styles.helloScreen}>
          <div>
            <img src="/assets/campaign/toolHelloScreen.svg" />
            <p>{helloScreen.name}</p>
          </div>
        </div>
      )}
      {Object.keys(video).length > 0 && (
        <div className={styles.videoRecorded}>
          {video.map((elem) => (
            <div
              style={{
                width: `${((elem.metadata.duration * 1000) / duration) * 100}%`,
              }}
            >
              <img src="/assets/campaign/toolVideos.svg" />
              <p>{elem.name}</p>
            </div>
          ))}
        </div>
      )}
      {endScreen.duration > 0 && (
        <div className={styles.endScreen}>
          <div>
            <img src="/assets/campaign/toolEndScreen.svg" />
            <p>{endScreen.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
