import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/components/Campaign/ToolVideos.module.sass";
import dayjs from "@/plugins/dayjs";
import { getDataByType, handleProgression, useDebounce } from "@/hooks";

import { ObjectID } from "bson";

const ToolScreenItem = ({ vd, setShowContentTimeline, selected = false }) => {
   const dispatch = useDispatch();
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });

   const [displayDropdown, showDropdown] = useState(false);
   const dropdownRef = useRef(null);
   const videosOffset = useSelector((state) => state.campaign.videosOffset);

   const videosRef = useSelector((state) => state.campaign.screensRef);

   const currentVideo = useSelector((state) => state.campaign.currentVideo);
   const preview = useSelector((state) => state.campaign.preview);
   const previewVideo = useSelector((state) => state.campaign.previewVideo);
   const selectedContent = useSelector(
      (state) => state.campaign.selectedContent
   );
   const contents = useSelector((state) => state.campaign.contents);

   // Close click outside text style
   useEffect(() => {
      function handleClickOutside(event) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
         ) {
            showDropdown(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [dropdownRef]);

   const addToContents = (data) => {
      const array = contents.slice();
      console.log("ADD ", data);
      array.push({
         ...data,
         _id: data._id,
         position: array.length,
         type: "screen",
         status: "done",
         screen: data.screen,
         texts: data.texts,
         links: data.links,
      });
      return array;
   };

   const selectVideo = (elem, array = contents.slice()) => {
      dispatch({
         type: "SET_SELECTED_CONTENT",
         data: elem.type === "video" ? elem.video : elem,
      });
      dispatch({
         type: "SHOW_PREVIEW",
         data: { element: elem.type, data: elem.type === "video" ? {} : elem },
      });

      const index = array.findIndex((content) => content._id === elem._id);
      if (index !== -1) {
         const position = array[index].position;
         let timePosition;
         if (videosOffset[position] !== undefined) {
            timePosition = videosOffset[position];
         } else if (videosOffset[position - 1] !== undefined) {
            timePosition =
               videosOffset[position - 1] +
               getDataByType(array[position - 1]).duration;
         } else {
            timePosition = 0;
         }

         dispatch({
            type: "SET_PROGRESSION",
            data: timePosition * 1000 + 10,
         });
         handleProgression(
            array,
            videosOffset,
            timePosition * 1000 + 10,
            dispatch,
            videosRef,
            currentVideo,
            preview
         );
         dispatch({
            type: "SET_CURRENT_OVERLAY",
            data: index,
         });
      } else {
         dispatch({
            type: "SET_CURRENT_OVERLAY",
            data: -1,
         });
      }
      dispatch({
         type: "SET_PREVIEW_VIDEO",
         data: elem.type === "video" ? elem.video : elem,
      });
   };

   const removeFromContents = (id) => {
      const array = contents.filter((obj) => {
         if (obj.type === "screen") {
            return obj._id !== id;
         } else {
            return obj;
         }
      });
      array.map((elem, i) => {
         elem.position = i;
      });
      return array;
   };

   const displayDuration = (value) => {
      if (!value) {
         return "00:00";
      }
      const t = dayjs.duration(parseInt(value, 10));
      const m = t.minutes();
      const s = t.seconds();
      return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
   };

   const handleAddToTimeLine = () => {
      setShowContentTimeline(true);
      const data = addToContents(vd.screen);
      dispatch({
         type: "SHOW_PREVIEW",
         data: { element: "screen", data: vd.screen },
      });
      dispatch({ type: "SET_VIDEO", data });
      dispatch({ type: "CALC_VIDEOS_OFFSET", data });
      // selectVideo(data[data.length - 1], data);
      // dispatch({ type: "SET_PROGRESSION", data: 0 });
      // dispatch({
      //   type: "SET_CURRENT_VIDEO",
      //   data: 0,
      // });
   };

   const handleSelect = () => {
      const index = contents.findIndex(
         (content) => content._id === vd.screen._id
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
      } else {
         dispatch({
            type: "SHOW_PREVIEW",
            data: { element: "screen", data: vd.screen },
         });
         dispatch({
            type: "SET_PREVIEW_VIDEO",
            data: vd.screen,
         });
      }

      // dispatch({
      //    type: "SET_SELECTED_SCREEN",
      //    data: "SCREEN",
      // });
      dispatch({
         type: "SET_SELECTED_CONTENT",
         data: vd.screen,
      });
      dispatch({
         type: "DISPLAY_ELEMENT",
         data: "endScreen",
      });
      dispatch({
         type: "SET_PREVIEW_END_SCREEN",
         data: vd.screen,
      });
   };

   const handelPreview = () => {
      const index = contents.findIndex(
         (content) => content._id === vd.screen._id
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
         dispatch({ type: "HIDE_PREVIEW" });
      } else {
         dispatch({
            type: "SHOW_PREVIEW",
            data: { element: "screen", data: vd.screen },
         });
         dispatch({ type: "SET_PREVIEW_VIDEO", data: vd.screen });
      }

      dispatch({
         type: "DISPLAY_ELEMENT",
         data: "endScreen",
      });
      dispatch({
         type: "SET_PREVIEW_END_SCREEN",
         data: vd.screen,
      });
   };

   return (
      <div
         key={vd.screen._id}
         className={`${styles.toolLibraryItem} ${styles.screensItem} ${
            contents.some(
               (elem) => elem.type === "screen" && elem._id === vd.screen._id
            )
               ? styles.selected
               : ""
         }`}
      >
         {vd.screen.thumbnail ? (
            <div className={styles.videoImg}>
               <img src={vd.screen.thumbnail} alt={vd.screen.name} />
            </div>
         ) : (
            <div
               className={styles.screenImg}
               style={{
                  backgroundColor: vd.screen.screen.background.color,
                  height: "30px",
                  width: "54px",
               }}
            ></div>
         )}
         <div
            className={`${styles.toolLibraryItemName} ${
               previewVideo && previewVideo.name === vd.screen.screen.name
                  ? styles.toolLibraryItemPreview
                  : ""
            } ${
               selected && selectedContent._id === vd.screen._id
                  ? styles.orangeBorder
                  : ""
            }`}
            onClick={selected ? handleSelect : handelPreview}
         >
            <p>{vd.screen.screen.name}</p>
            {vd.screen.status === "done" ? (
               <p className={`${styles.videosItemStatus}`}>
                  {vd.screen.screen.duration
                     ? displayDuration(vd.screen.screen.duration * 1000)
                     : ""}
               </p>
            ) : (
               <p
                  className={`${styles.screensItemStatus} ${
                     styles[vd.screen.status]
                  }`}
               >
                  {vd.screen.status}...{" "}
                  {vd.screen.status === "processing" &&
                  vd.screen.statusProgress > 0
                     ? `${vd.screen.statusProgress || 0}%`
                     : ""}
               </p>
            )}
         </div>
         <div className={styles.toolLibraryItemOptions}>
            <div className={styles.toolLibraryItemOption}>
               {!selected && (
                  <div onClick={handleAddToTimeLine}>
                     <img src="/assets/campaign/librarySelect.svg" />
                  </div>
               )}
               {selected && (
                  <div
                     onClick={() => {
                        const data = removeFromContents(vd.screen._id);
                        dispatch({ type: "SET_VIDEO", data });

                        dispatch({ type: "CALC_VIDEOS_OFFSET", data });
                        dispatch({ type: "SET_VIDEOS_REF" });
                        dispatch({ type: "SET_PROGRESSION", data: 0 });
                        if (contents.length > 1) {
                           selectVideo(contents[0], contents);
                        } else {
                           dispatch({ type: "HIDE_PREVIEW" });
                           dispatch({ type: "SET_PREVIEW_VIDEO", data: {} });
                           dispatch({
                              type: "SET_CURRENT_VIDEO",
                              data: -1,
                           });
                           dispatch({ type: "SET_CURRENT_OVERLAY", data: -1 });
                           dispatch({
                              type: "SET_SELECTED_CONTENT",
                              data: {},
                           });
                        }
                     }}
                  >
                     <img src="/assets/campaign/libraryUnselect.svg" />
                  </div>
               )}
            </div>
            {!selected && (
               <>
                  <div
                     className={styles.toolLibraryItemOption}
                     onClick={() => showDropdown(!displayDropdown)}
                  >
                     <div>
                        <img
                           className={styles.delete}
                           src="/assets/campaign/videoOptions.svg"
                        />
                     </div>
                  </div>
                  {displayDropdown && (
                     <div className={styles.dropdown} ref={dropdownRef}>
                        <ul>
                           <li
                              onClick={() => {
                                 showPopup({
                                    display: "DELETE_VIDEO",
                                    data: vd.screen,
                                    target: "screen",
                                 });
                                 showDropdown(false);
                              }}
                           >
                              <p>Delete</p>
                           </li>
                        </ul>
                     </div>
                  )}
               </>
            )}
            {/* {!contents.some(
        (elem) => elem.type === "video" && elem.screen._id === vd.screen._id
      ) && (
          <div
            className={styles.toolLibraryItemOption}
            onClick={() =>
              showPopup({ display: "DELETE_VIDEO", data: vd.screen })
            }
          >
            <div>
              <img src="/assets/campaign/libraryDelete.svg" />
              <p>Delete</p>
            </div>
          </div>
        )} */}
         </div>
      </div>
   );
};

export default ToolScreenItem;

/*

on Select
      Set Show Preview To My Selection Type
      Set Current Video To My Selection
      Set preview video to my selection




*/
