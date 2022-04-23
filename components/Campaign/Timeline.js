import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import styles from "@/styles/components/Campaign/Timeline.module.sass";
import TestDragnDrop from "./TestDragnDrop";
import { getDataByType, handleProgression } from "@/hooks";
import ContextMenu from "./ContextMenu";
const grid = 5;
const Timeline = ({ handlecreate }) => {
   const dispatch = useDispatch();

   const duration = useSelector((state) => state.campaign.duration);

   const preview = useSelector((state) => state.campaign.preview);
   const progression = useSelector((state) => state.campaign.progression);
   const timelineDraggable = useSelector(
      (state) => state.campaign.timelineDraggable
   );
   const contents = useSelector((state) => state.campaign.contents);
   const videosRef = useSelector((state) => state.campaign.videosRef);
   const currentVideo = useSelector((state) => state.campaign.currentVideo);
   const selectedContent = useSelector(
      (state) => state.campaign.selectedContent
   );
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
      let count = 0;
      for (let i = 0; i < max; i++) {
         if (contents[i].type === "video") count++;
      }
      const result = count - 1;
      return result >= 0 ? result : 0;
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
                  const currentTime = progression / 1000 - videosOffset[i];
                  console.log(videosRef);
                  if (videosRef.length)
                     videosRef[getVideoIndex(i)].currentTime =
                        currentTime > 0 ? currentTime : 0;
               }

               if (i !== currentVideo) {
                  if (
                     contents[currentVideo]?.type === "video" &&
                     videosRef.length
                  ) {
                     videosRef[getVideoIndex(currentVideo)].currentTime = 0;
                     videosRef[getVideoIndex(currentVideo)].pause();
                  }
                  dispatch({
                     type: "SET_SELECTED_CONTENT",
                     data: contents[i],
                  });
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
      dispatch({
         type: "SET_SELECTED_SCREEN",
         data: "SCREEN",
      });
      if (preview.show) {
         dispatch({ type: "HIDE_PREVIEW" });
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
      dispatch({
         type: "DRAG_ITEM",
         data: true,
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
      dispatch({
         type: "SET_CURRENT_OVERLAY",
         data: 0,
      });
   };

   const handleClick = () => {
      setShow(false);
      setContextMenuElem(null);
   };

   const select = (type, vd) => {
      const index = contents.findIndex((content) =>
         type === "screen"
            ? content._id === vd.screen._id
            : type === "video" && content._id === vd.video._id
      );
      if (index !== -1) {
         const position = contents[index].position;
         const timePosition = videosOffset[position];

         dispatch({
            type: "SET_PROGRESSION",
            data: timePosition * 1000 + 10,
         });
         handleProgression(
            contents,
            videosOffset,
            timePosition * 1000 + 10,
            dispatch,
            videosRef,
            currentVideo,
            preview
         );
         if (type !== "screen") {
            dispatch({ type: "HIDE_PREVIEW" });
            dispatch({
               type: "SET_CURRENT_OVERLAY",
               data: index,
            });
         }
      } else {
         if (type !== "screen") {
            dispatch({
               type: "SET_CURRENT_OVERLAY",
               data: -1,
            });
         }
         dispatch({
            type: "SHOW_PREVIEW",
            data: {
               element: "screen",
               data: type === "screen" ? vd.screen : vd.video,
            },
         });
         dispatch({
            type: "SET_PREVIEW_VIDEO",
            data: type === "screen" ? vd.screen : vd.video,
         });
      }

      dispatch({
         type: "SET_SELECTED_CONTENT",
         data: type === "screen" ? vd.screen : vd.video,
      });
      dispatch({
         type: "DISPLAY_ELEMENT",
         data: "endScreen",
      });
      dispatch({
         type: "SET_PREVIEW_END_SCREEN",
         data: type === "screen" ? vd.screen : vd.video,
      });
      dispatch({
         type: "SET_SELECTED_SCREEN",
         data: "SCREEN",
      });
   };

   return (
      <div className={styles.timeline}>
         <span
            className={styles.progressionDrag}
            onClick={(e) => seekTo(e)}
            onMouseDown={(e) =>
               dispatch({ type: "TIMELINE_DRAGGABLE", data: true })
            }
            onMouseUp={(e) =>
               dispatch({ type: "TIMELINE_DRAGGABLE", data: false })
            }
            onMouseMove={(e) => timelineDraggable && seekTo(e)}
            ref={ref}
         />
         <div className={styles.sensorContainer}>
            <div>
               <span
                  className={styles.cursor}
                  style={{
                     left: `${(progression / duration) * 100}%`,
                  }}
               >
                  <img
                     className={styles.cursor}
                     src="/assets/campaign/timeLineCursor.svg"
                  ></img>
               </span>
            </div>
         </div>

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
                                       onContextMenu={(e) =>
                                          handleContextMenu(e, elem)
                                       }
                                       className={`${styles[elem.type]} ${
                                          selectedContent &&
                                          elem._id === selectedContent._id
                                             ? styles.active
                                             : ""
                                       }`}
                                       onClick={() =>
                                          select(elem.type, {
                                             [elem.type]: elem,
                                          })
                                       }
                                       ref={provided.innerRef}
                                       {...provided.draggableProps}
                                       {...provided.dragHandleProps}
                                       style={{
                                          width: `${
                                             ((infos.duration * 1000) /
                                                duration) *
                                             100
                                          }%`,
                                          ...provided.draggableProps.style,
                                          backgroundColor:
                                             elem.type === "screen"
                                                ? elem.screen.background.color
                                                : undefined,
                                       }}
                                    >
                                       <p>{infos.name}</p>
                                    </div>
                                 )}
                              </Draggable>
                           );
                        })}
                        {provided.placeholder}
                        {contents.length > 0 && (
                           <button
                              className={styles.newButton}
                              onClick={() => {
                                 handlecreate();
                              }}
                           >
                              +
                           </button>
                        )}
                     </div>
                  )}
               </Droppable>
            </DragDropContext>
            {show && (
               <ContextMenu onDelete={onDelete} anchorPoint={anchorPoint} />
            )}
         </>

         {/* <TestDragnDrop /> */}
      </div>
   );
};

export default Timeline;
