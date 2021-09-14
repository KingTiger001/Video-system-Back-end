import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

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
  const contents = useSelector((state) => state.campaign.contents);
  const videosRef = useSelector((state) => state.campaign.videosRef);
  const currentVideo = useSelector((state) => state.campaign.currentVideo);
  const videosOffset = useSelector((state) => state.campaign.videosOffset);

  //

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
      for (let i = 0; i < contents.length; i++) {
        if (
          progression > videosOffset[i] * 1000 &&
          progression < (videosOffset[i + 1] * 1000 || duration)
        ) {
          const currentTime =
            (progression - helloScreen.duration) / 1000 - videosOffset[i];
          videosRef[i].currentTime = currentTime > 0 ? currentTime : 0;

          if (i !== currentVideo) {
            videosRef[currentVideo].currentTime = 0;
            videosRef[currentVideo].pause();
            dispatch({
              type: "SET_CURRENT_VIDEO",
              data: i,
            });
          }
        }
      }
    }
    if (preview.show) {
      dispatch({ type: "HIDE_PREVIEW" });
    }
  };

  const handleOnDragEnd = (result) => {
    const data = Array.from(contents);

    if (result.destination) {
      const [reorderedItem] = data.splice(result.source.index, 1);
      data.splice(result.destination.index, 0, reorderedItem);
    }

    data.map((elem, i) => {
      elem.position = i;
    });
    dispatch({ type: "SET_VIDEO", data });
    dispatch({ type: "CALC_VIDEOS_OFFSET", data });
    dispatch({ type: "SET_VIDEOS_REF" });
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
          contents.length > 0 ? "1fr" : ""
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

      {contents.length > 0 && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable direction="horizontal" droppableId="videoRecorded">
            {(provided) => (
              <div
                className={styles.videoRecorded}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {contents.map((elem, i) => (
                  <Draggable key={i} draggableId={`draggable-${i}`} index={i}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        style={{
                          width: `${
                            ((elem.video.metadata.duration * 1000) / duration) *
                            100
                          }%`,
                          ...provided.draggableProps.style,
                        }}
                      >
                        <img src="/assets/campaign/toolVideos.svg" />
                        <p>{elem.video.name}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
