import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import styles from "@/styles/components/Campaign/Timeline.module.sass";
import TestDragnDrop from "./TestDragnDrop";
import { getDataByType } from "@/hooks";
import ContextMenu from "./ContextMenu";
const grid = 5;
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

  const ref = useRef();

  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [contextMenuElem, setContextMenuElem] = useState(null);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

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

  const getVideoIndex = (max) => {
    let count = -1;
    for (let i = 0; i <= max; i++) {
      if (contents[i].type === "video") count++;
    }
    return count;
  };

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = Math.min(
      Math.max(e.clientX - rect.left, 0),
      ref.current.offsetWidth
    );
    const progression = (position / ref.current.offsetWidth) * duration;
    dispatch({ type: "SET_PROGRESSION", data: progression });
    if (contents.length > 0) {
      for (let i = 0; i < contents.length; i++) {
        if (
          progression > videosOffset[i] * 1000 &&
          progression <
            (videosOffset[i] + getDataByType(contents[i]).duration) * 1000
        ) {
          if (contents[i].type === "video") {
            const currentTime =
              (progression - helloScreen.duration) / 1000 - videosOffset[i];
            videosRef[getVideoIndex(i)].currentTime =
              currentTime > 0 ? currentTime : 0;
          }

          if (i !== currentVideo) {
            if (contents[currentVideo].type === "video") {
              videosRef[getVideoIndex(currentVideo)].currentTime = 0;
              videosRef[getVideoIndex(currentVideo)].pause();
            }
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
    } else {
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const data = Array.from(contents);

    const [reorderedItem] = data.splice(result.source.index, 1);
    data.splice(result.destination.index, 0, reorderedItem);

    data.map((elem, i) => {
      elem.position = i;
    });
    dispatch({ type: "SET_VIDEO", data });
    dispatch({ type: "CALC_VIDEOS_OFFSET", data });
    dispatch({ type: "SET_VIDEOS_REF" });
  };

  const handleContextMenu = (event, id) => {
    event.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setAnchorPoint({ x, y });
    setContextMenuElem(id);
    setShow(true);
  };

  const onDelete = () => {
    if (contextMenuElem === null) {
      return;
    }
    const data = contents.filter((obj) => obj._id !== contextMenuElem._id);
    data.map((elem, i) => {
      elem.position = i;
    });
    dispatch({ type: "SET_VIDEO", data });
    dispatch({ type: "CALC_VIDEOS_OFFSET", data });

    dispatch({ type: "SET_VIDEOS_REF" });
    dispatch({ type: "SET_PROGRESSION", data: 0 });
    dispatch({
      type: "SET_CURRENT_VIDEO",
      data: 0,
    });
  };

  const handleClick = () => {
    setShow(false);
    setContextMenuElem(null);
  };

  return (
    <div className={styles.timeline}>
      <span
        className={styles.progressionDrag}
        onClick={(e) => seekTo(e)}
        onMouseDown={(e) =>
          dispatch({ type: "TIMELINE_DRAGGABLE", data: true })
        }
        onMouseUp={(e) => dispatch({ type: "TIMELINE_DRAGGABLE", data: false })}
        onMouseMove={(e) => timelineDraggable && seekTo(e)}
        ref={ref}
      />
      <span
        className={styles.cursor}
        style={{
          left: `${(progression / duration) * 100}%`,
        }}
      />

      {contents.length > 0 && (
        <>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable direction="horizontal" droppableId="videoRecorded">
              {(provided) => (
                <div
                  className={styles.videoRecorded}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {contents.map((elem, i) => {
                    const infos = getDataByType(elem);

                    return (
                      <Draggable
                        key={i}
                        draggableId={`draggable-${i}`}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <div
                            onContextMenu={(e) => handleContextMenu(e, elem)}
                            className={styles[elem.type]}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              width: `${
                                ((infos.duration * 1000) / duration) * 100
                              }%`,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <img src="/assets/campaign/toolVideos.svg" />
                            <p>{infos.name}</p>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {show && (
            <ContextMenu onDelete={onDelete} anchorPoint={anchorPoint} />
          )}
        </>
      )}

      {/* <TestDragnDrop /> */}
    </div>
  );
};

export default Timeline;
