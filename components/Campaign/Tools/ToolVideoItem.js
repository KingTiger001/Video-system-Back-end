import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/components/Campaign/ToolVideos.module.sass";
import dayjs from "@/plugins/dayjs";
import { getDataByType, handleProgression, useDebounce } from "@/hooks";

import { ObjectID } from "bson";

const ToolVideoItem = ({ vd, setShowContentTimeline, selected = false }) => {
   const dispatch = useDispatch();
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });

   const [displayDropdown, showDropdown] = useState(false);
   const dropdownRef = useRef(null);
   const videosOffset = useSelector((state) => state.campaign.videosOffset);

   const videosRef = useSelector((state) => state.campaign.videosRef);

   const currentVideo = useSelector((state) => state.campaign.currentVideo);
   const preview = useSelector((state) => state.campaign.preview);
   const previewVideo = useSelector((state) => state.campaign.previewVideo);
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
      const _id = new ObjectID().toString();
      array.push({
         _id,
         position: array.length,
         type: "video",
         video: data,
         texts: [],
         links: [],
      });
      return array;
   };

   const selectVideo = (elem, array = contents.slice()) => {
      dispatch({
         type: "SET_SELECTED_CONTENT",
         data: elem,
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
         dispatch({ type: "HIDE_PREVIEW" });
         dispatch({
            type: "SET_CURRENT_OVERLAY",
            data: index,
         });
      } else {
         dispatch({
            type: "SET_CURRENT_OVERLAY",
            data: -1,
         });
         dispatch({
            type: "SHOW_PREVIEW",
            data: { element: "video", data: {} },
         });
      }
      dispatch({ type: "SET_PREVIEW_VIDEO", data: elem.video });
      dispatch({ type: "HIDE_PREVIEW" });
   };

   const removeFromContents = (id) => {
      const array = contents.filter((obj) => {
         if (obj.type === "video") {
            return obj.video._id !== id;
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
      const data = addToContents(vd.video);
      dispatch({
         type: "SHOW_PREVIEW",
         data: { element: "video", data: {} },
      });
      selectVideo(data[data.length - 1], data);
      dispatch({ type: "SET_VIDEO", data });
      dispatch({ type: "CALC_VIDEOS_OFFSET", data });
      dispatch({ type: "SET_VIDEOS_REF" });
      // dispatch({ type: "SET_PROGRESSION", data: 0 });
      // dispatch({
      //   type: "SET_CURRENT_VIDEO",
      //   data: 0,
      // });
   };
   const handleSelect = () => {
      const index = contents.findIndex(
         (elem) => elem.type === "video" && elem.video._id === vd.video._id
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
         dispatch({
            type: "SET_CURRENT_OVERLAY",
            data: index,
         });
      } else {
         dispatch({
            type: "SET_CURRENT_OVERLAY",
            data: -1,
         });
         dispatch({ type: "SET_PREVIEW_VIDEO", data: vd.video });
      }
      dispatch({
         type: "SHOW_PREVIEW",
         data: { element: "video", data: vd.video },
      });
      dispatch({ type: "HIDE_PREVIEW" });
      dispatch({ type: "SET_PREVIEW_VIDEO", data: vd.video });
      dispatch({ type: "SET_SELECTED_CONTENT", data: vd });
   };

   return (
      <div
         key={vd.video._id}
         className={`${styles.toolLibraryItem} ${styles.videosItem} ${
            contents.some(
               (elem) =>
                  elem.type === "video" && elem.video._id === vd.video._id
            )
               ? styles.selected
               : ""
         }`}
      >
         <img className={styles.videoImg} src={vd.video.thumbnail}></img>
         <div
            className={`${styles.toolLibraryItemName} ${
               previewVideo && previewVideo.name === vd.video.name
                  ? styles.toolLibraryItemPreview
                  : ""
            } ${selected ? styles.orangeBorder : ""}`}
            onClick={selected ? handleSelect : handleAddToTimeLine}
         >
            <p>{vd.video.name}</p>
            {vd.video.status === "done" ? (
               <p className={`${styles.videosItemStatus}`}>
                  {displayDuration(vd.video.metadata.duration * 1000)}
               </p>
            ) : (
               <p
                  className={`${styles.videosItemStatus} ${
                     styles[vd.video.status]
                  }`}
               >
                  {vd.video.status}...{" "}
                  {vd.video.status === "processing" &&
                  vd.video.statusProgress > 0
                     ? `${vd.video.statusProgress || 0}%`
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
                        const data = removeFromContents(vd.video._id);
                        dispatch({ type: "SET_VIDEO", data });

                        dispatch({ type: "CALC_VIDEOS_OFFSET", data });
                        dispatch({ type: "SET_VIDEOS_REF" });
                        dispatch({ type: "SET_PROGRESSION", data: 0 });
                        if (contents.length > 1) {
                           selectVideo(contents[0], contents);
                        } else {
                           dispatch({ type: "HIDE_PREVIEW" });
                           dispatch({
                              type: "SET_CURRENT_VIDEO",
                              data: -1,
                           });
                           dispatch({ type: "SET_CURRENT_OVERLAY", data: -1 });
                           dispatch({ type: "SET_PREVIEW_VIDEO", data: {} });
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
            {!contents.some(
               (elem) =>
                  elem.type === "video" && elem.video._id === vd.video._id
            ) && (
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
                              onClick={() =>
                                 showPopup({
                                    display: "DELETE_VIDEO",
                                    data: vd.video,
                                 })
                              }
                           >
                              <p>Delete</p>
                           </li>
                        </ul>
                     </div>
                  )}
               </>
            )}
            {/* {!contents.some(
        (elem) => elem.type === "video" && elem.video._id === vd.video._id
      ) && (
          <div
            className={styles.toolLibraryItemOption}
            onClick={() =>
              showPopup({ display: "DELETE_VIDEO", data: vd.video })
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

export default ToolVideoItem;
