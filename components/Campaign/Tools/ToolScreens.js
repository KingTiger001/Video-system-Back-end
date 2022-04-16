import { useDispatch, useSelector } from "react-redux";

import { getDataByType, handleProgression, useDebounce } from "@/hooks";

import { mainAPI } from "@/plugins/axios";

import styles from "@/styles/components/Campaign/Tools.module.sass";
import { useState, useEffect } from "react";
import ToolItemText from "./Items/toolItemText";
import ToolItemLink from "./Items/toolItemLink";
import { ObjectID } from "bson";
import ToolItemBackground from "./Items/ToolItemBackground";
import ToolItemDuration from "./Items/ToolItemDuration";
import ToolItemSave from "./Items/ToolItemSave";
import ToolLogo from "./ToolLogo";
import PopupDeleteEndScreen from "@/components/Popups/PopupDeleteEndScreen";
import { toast } from "react-toastify";

const ToolScreens = () => {
   const dispatch = useDispatch();

   const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });

   const closeToolbox = () => {
      dispatch({ type: "SELECT_TOOL", data: 0 });
      setTimeout(() => dispatch({ type: "HIDE_PREVIEW" }), 0);
   };

   const tool = 3; /* useSelector((state) => state.campaign.tool) */

   const preview = useSelector((state) => state.campaign.preview);
   const contents = useSelector((state) => state.campaign.contents);
   const popup = useSelector((state) => state.popup);

   const endScreenList = useSelector((state) => state.campaign.endScreenList);
   const previewEndScreen = useSelector(
      (state) => state.campaign.previewEndScreen
   );
   const selectedContent = useSelector(
      (state) => state.campaign.selectedContent
   );

   const currentVideo = useSelector((state) => state.campaign.currentVideo);
   const videosRef = useSelector((state) => state.campaign.videosRef);

   const videosOffset = useSelector((state) => state.campaign.videosOffset);
   const templateList = useSelector((state) => state.campaign.templateList);

   const [selectedScreens, setSelectedScreens] = useState([]);
   const [unselectedScreens, setUnselectedScreens] = useState([]);
   const [showEdit, setShowEdit] = useState(false);

   useEffect(() => {
      const checkIfInContent = (element) => {
         return contents.some((content) => {
            if (content.type === "screen") return content._id === element._id;
            return content.video && content.video._id === element._id;
         });
      };
      const selected = contents.filter((obj) => obj.type === "screen");
      const screens = templateList.filter(
         (c) => c.type === "screen" && !checkIfInContent(c)
      );
      setSelectedScreens(selected);
      setUnselectedScreens(screens);
   }, [contents, endScreenList]);

   useEffect(() => {
      if (selectedContent && selectedContent.type === "screen")
         setShowEdit(true);
   }, [selectedContent]);

   const selectScreen = (elem, array) => {
      if (!array) {
         array = contents.slice();
      }
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
      } else {
         dispatch({
            type: "SHOW_PREVIEW",
            data: { element: "screen", data: elem },
         });
         dispatch({ type: "SET_PREVIEW_VIDEO", data: elem });
      }

      dispatch({
         type: "SET_SELECTED_CONTENT",
         data: elem,
      });
      dispatch({
         type: "DISPLAY_ELEMENT",
         data: "endScreen",
      });
      dispatch({
         type: "SET_PREVIEW_END_SCREEN",
         data: elem,
      });
   };

   const updateProcessingVideos = async () => {
      const processingVideos = endScreenList.filter(
         (video) => video.status === "processing" || video.status === "waiting"
      );
      if (processingVideos.length > 0) {
         const newVideosPromise = await Promise.all(
            processingVideos.map((video) => mainAPI(`/videos/${video._id}`))
         );
         const newVideos = newVideosPromise.flat().map((video) => video.data);
         dispatch({
            type: "SET_VIDEO_LIST",
            data: endScreenList.map((video) => {
               const videoProcessingFound = newVideos.find(
                  (newVideo) => newVideo._id === video._id
               );
               return videoProcessingFound || video;
            }),
         });
      }
   };

   // useDebounce(updateProcessingVideos, 3000, [endScreenList]);

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

   const handleCreate = () => {
      const array = contents.slice();
      const id = new ObjectID();
      const template = {
         _id: id.toString(),
         position: array.length,
         type: "screen",
         status: "done",
         screen: {
            name: `screen${selectedScreens.length}`,
            background: { type: "color", color: "#9FE4FC" },
            duration: 3,
         },
         texts: [],
         links: [],
      };
      array.push(template);
      addTemplateToDatabase(template, () => {
         dispatch({
            type: "SET_TEMPLATE_LIST",
            data: [...templateList, template],
         });
      });
      dispatch({ type: "SET_VIDEO", data: array });
      dispatch({ type: "CALC_VIDEOS_OFFSET", data: array });
      selectScreen(array[array.length - 1], array);
      setShowEdit(true);
   };

   const addTemplateToDatabase = async (temp, callback) => {
      try {
         const { data: template } = await mainAPI.post("/templates", temp);
         if (template && callback) callback(template);
      } catch (err) {
         const code = err.response && err.response.data;
         if (code === "Upload.incorrectFiletype") {
            setError(err.message);
         }
      }
   };

   const addToContents = (data) => {
      const array = contents.slice();

      const id = data._id ? data._id : new ObjectID().toString();
      const texts = data.texts.length > 0 ? data.texts : [];
      const links = data.links.length > 0 ? data.links : [];
      array.push({
         _id: id,
         position: array.length,
         type: "screen",
         status: "done",
         screen: data.screen,
         texts: texts,
         links: links,
      });
      return array;
   };

   const renderScreenItem = (obj) => {
      return (
         <div
            key={obj._id}
            className={`${styles.toolLibraryItem} ${styles.videosItem} ${
               contents.some(
                  (elem) => elem.type === "screen" && elem._id === obj._id
               )
                  ? styles.selected
                  : ""
            }`}
         >
            <div
               className={`${styles.toolLibraryItemName} ${
                  // previewVideo.name === obj.name ? styles.toolLibraryItemPreview : ""
                  previewEndScreen._id === obj._id
                     ? styles.toolLibraryItemPreview
                     : ""
               }`}
               onClick={() => {
                  const index = contents.findIndex(
                     (content) => content._id === obj._id
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
                        data: { element: "screen", data: obj },
                     });
                     dispatch({ type: "SET_PREVIEW_VIDEO", data: obj });
                  }

                  dispatch({
                     type: "DISPLAY_ELEMENT",
                     data: "endScreen",
                  });
                  dispatch({
                     type: "SET_PREVIEW_END_SCREEN",
                     data: obj,
                  });
               }}
            >
               <p>{obj.screen.name}</p>
            </div>
            <div className={styles.toolLibraryItemOptions}>
               {contents.some(
                  (elem) => elem.type === "screen" && elem._id === obj._id
               ) && (
                  <div className={styles.toolLibraryItemOption}>
                     <div
                        onClick={() => {
                           setShowEdit(true);
                           selectScreen(obj);
                        }}
                     >
                        <img src="/assets/campaign/libraryEdit.svg" />
                        <p>Edit</p>
                     </div>
                  </div>
               )}

               <div className={styles.toolLibraryItemOption}>
                  {!contents.some(
                     (elem) => elem.type === "screen" && elem._id === obj._id
                  ) && (
                     <div
                        onClick={() => {
                           const data = addToContents(obj);
                           selectScreen(data[data.length - 1], data);
                           dispatch({ type: "SET_VIDEO", data });
                           dispatch({ type: "CALC_VIDEOS_OFFSET", data });
                           dispatch({ type: "SET_VIDEOS_REF" });
                        }}
                     >
                        <img src="/assets/campaign/librarySelect.svg" />
                        <p>Select</p>
                     </div>
                  )}
                  {contents.some(
                     (elem) => elem.type === "screen" && elem._id === obj._id
                  ) && (
                     <div
                        onClick={() => {
                           const data = removeFromContents(obj._id);
                           dispatch({ type: "SET_VIDEO", data });

                           dispatch({ type: "CALC_VIDEOS_OFFSET", data });
                           dispatch({ type: "SET_VIDEOS_REF" });
                           dispatch({ type: "SET_PROGRESSION", data: 0 });
                           dispatch({
                              type: "SET_CURRENT_VIDEO",
                              data: 0,
                           });
                           if (data.length > 0)
                              dispatch({
                                 type: "SET_PREVIEW_END_SCREEN",
                                 data: data[0],
                              });
                           dispatch({ type: "SET_CURRENT_OVERLAY", data: 0 });
                        }}
                     >
                        <img src="/assets/campaign/libraryUnselect.svg" />
                        <p>Remove</p>
                     </div>
                  )}
               </div>
               {!contents.some(
                  (elem) => elem.type === "screen" && elem._id === obj._id
               ) && (
                  <div
                     className={styles.toolLibraryItemOption}
                     onClick={() =>
                        showPopup({
                           display: "DELETE_VIDEO",
                           data: obj,
                           target: "screen",
                        })
                     }
                  >
                     <div>
                        <img src="/assets/campaign/libraryDelete.svg" />
                        <p>Delete</p>
                     </div>
                  </div>
               )}
            </div>
         </div>
      );
   };

   const getScreenList = async () => {
      const { data } = await mainAPI.get("/users/me/endScreens");
      dispatch({
         type: "SET_END_SCREEN_LIST",
         data,
      });
   };

   return (
      tool === 3 && (
         <div
            className={styles.toolVideos}
            onClick={() => {
               if (!preview.show) {
                  // dispatch({ type: "SHOW_PREVIEW" });
               }
            }}
         >
            {popup.display === "DELETE_SCREEN" && (
               <PopupDeleteEndScreen
                  onDone={() => {
                     getScreenList();
                     toast.success("Screen deleted.");
                     selectScreen({});
                     hidePopup();
                  }}
               />
            )}
            {!showEdit &&
            selectedContent &&
            selectedContent.type !== "video" ? (
               <div className={styles.editSection}>
                  <span className={styles.toolTitleSection}>
                     {/* <div onClick={closeToolbox} className={styles.backArrow}>
                <img src="/assets/campaign/backArrow.svg" />{" "}
              </div> */}
                     <p className={styles.toolTitle}>Screen</p>
                  </span>

                  <div
                     onClick={handleCreate}
                     className={styles.createScreenBtn}
                  >
                     <span>Create</span>
                     <img src={"/assets/common/add.svg"} />
                  </div>

                  <p
                     style={{ marginTop: "14px" }}
                     className={styles.toolSubtitle}
                  >
                     Timeline
                  </p>
                  <div className={styles.videosList}>
                     {selectedScreens.map((obj) => renderScreenItem(obj))}
                  </div>
                  <p className={styles.toolSubtitle}>Library</p>
                  <div className={styles.videosList}>
                     {unselectedScreens.map((obj) => renderScreenItem(obj))}
                  </div>
               </div>
            ) : (
               <div className={styles.toolSection}>
                  {/* <span className={styles.toolTitleSection}>
              <div
                onClick={() => {
                  setShowEdit(false);
                }}
                className={styles.backArrow}
              >
                <img src="/assets/campaign/backArrow.svg" />{" "}
              </div>
              <p className={styles.toolTitle}>Edit</p>
            </span> */}

                  <div className={styles.toolItems}>
                     {selectedContent && selectedContent.screen ? (
                        <>
                           <div className={styles.editTemplate}>
                              <div>Duration</div>
                              <div>
                                 <ToolItemDuration />
                              </div>
                              <div>Color</div>
                              <div>
                                 <ToolItemBackground />
                              </div>
                           </div>
                        </>
                     ) : (
                        ""
                     )}
                     {/* <ToolItemBackground />
                     <ToolItemDuration />
                     <ToolItemSave /> */}
                     <ToolItemText />
                     <ToolItemLink />
                     <ToolLogo />
                  </div>
               </div>
            )}
         </div>
      )
   );
};

export default ToolScreens;
