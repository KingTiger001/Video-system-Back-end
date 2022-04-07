import { useDispatch, useSelector } from "react-redux";

import { getDataByType, handleProgression, useDebounce } from "@/hooks";

import { mainAPI } from "@/plugins/axios";

// import styles from "@/styles/components/Campaign/Tools.module.sass";
import styles from "@/styles/components/Campaign/ToolVideos.module.sass";
import { useState, useEffect } from "react";
import ToolItemText from "./Items/toolItemText";
import ToolItemLink from "./Items/toolItemLink";
import ToolVideoItem from "./ToolVideoItem";
import ToolScreenItem from "./ToolScreenItem";

const ToolVideos = () => {
   const dispatch = useDispatch();

   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });

   const closeToolbox = () => {
      dispatch({ type: "SELECT_TOOL", data: 0 });
      setTimeout(() => {
         dispatch({ type: "HIDE_PREVIEW" });
         dispatch({
            type: "SET_CURRENT_OVERLAY",
            data: currentVideo,
         });
      }, 0);
   };

   const tool = 2;

   const currentVideo = useSelector((state) => state.campaign.currentVideo);
   const preview = useSelector((state) => state.campaign.preview);
   const previewVideo = useSelector((state) => state.campaign.previewVideo);
   const contents = useSelector((state) => state.campaign.contents);
   const videoList = useSelector((state) => state.campaign.videoList);
   const templateList = useSelector((state) => state.campaign.templateList);
   const showLast = useSelector((state) => state.campaign.last);
   const selectedContent = useSelector(
      (state) => state.campaign.selectedContent
   );

   const videosRef = useSelector((state) => state.campaign.videosRef);
   const videosOffset = useSelector((state) => state.campaign.videosOffset);
   const campaign = useSelector((state) => state.campaign);

   const [timelineVideos, setTimelineVideos] = useState([]);
   const [recordingVideos, setRecordingVideos] = useState([]);
   const [uploadsVideos, setUploadsVideos] = useState([]);
   const [templates, setTemplates] = useState([]);
   const [showEdit, setShowEdit] = useState(false);

   const [showContentTimeline, setShowContentTimeline] = useState(true);
   const [showContentRecorded, setShowContentRecorded] = useState(true);
   const [showContentUpload, setShowContentUpload] = useState(true);
   const [showContentScreen, setShowContentScreen] = useState(true);

   useEffect(() => {
      console.log("Screens From DB: ", campaign);
   }, [campaign]);
   useEffect(() => {
      const checkIfInContent = (element) => {
         return contents.some((content) => {
            if (content.type === "screen") return content._id === element._id;
            return content.video._id === element._id;
         });
      };
      const uploads = videoList.filter((v) => {
         return v.type === "video" && !checkIfInContent(v);
      });
      const recording = videoList.filter(
         (c) => c.type === "record" && !checkIfInContent(c)
      );
      const screens = templateList.filter(
         (c) => c.type === "screen" && !checkIfInContent(c)
      );

      console.log("Screens", screens);
      setTimelineVideos(contents);
      setRecordingVideos(recording);
      setUploadsVideos(uploads);
      setTemplates(screens);
   }, [contents, videoList, templateList]);

   useEffect(() => {
      if (selectedContent.length === 0) {
         setShowEdit(false);
      }
   }, [selectedContent]);

   const updateProcessingVideos = async () => {
      const processingVideos = videoList.filter(
         (video) => video.status === "processing" || video.status === "waiting"
      );
      if (processingVideos.length > 0) {
         const newVideosPromise = await Promise.all(
            processingVideos.map((video) => mainAPI(`/videos/${video._id}`))
         );
         const newVideos = newVideosPromise.flat().map((video) => video.data);
         dispatch({
            type: "SET_VIDEO_LIST",
            data: videoList.map((video) => {
               const videoProcessingFound = newVideos.find(
                  (newVideo) => newVideo._id === video._id
               );
               return videoProcessingFound || video;
            }),
         });
      }
      /* selected */
      contents.map(async (video, index) => {
         if (video.status === "processing" || video.status === "waiting") {
            const { data } = await mainAPI(`/videos/${video._id}`);
            const newSelected = data;
            contents[index].video = newSelected;
            selectVideo(contents[index], contents);
            dispatch({ type: "SET_VIDEO", data: contents });
            dispatch({ type: "CALC_VIDEOS_OFFSET", data: contents });
            dispatch({ type: "SET_VIDEOS_REF" });
         }
      });
   };

   useDebounce(updateProcessingVideos, 3000, [videoList]);

   const selectVideo = (elem, array) => {
      if (!array) {
         array = contents.slice();
      }
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
         dispatch({ type: "SET_PREVIEW_VIDEO", data: elem.video });
      }
      dispatch({ type: "SET_PREVIEW_VIDEO", data: elem.video });
   };

   const toggleTimeline = (show = null) => {
      if (show !== null) {
         setShowContentTimeline(show);
      }
      setShowContentTimeline(!showContentTimeline);
   };
   const toggleRecorded = (show = null) => {
      if (show !== null) {
         setShowContentRecorded(show);
      }
      setShowContentRecorded(!showContentRecorded);
   };
   const toggleUpload = (show = null) => {
      if (show !== null) {
         setShowContentUpload(show);
      }
      setShowContentUpload(!showContentUpload);
   };
   const toggleScreen = (show = null) => {
      if (show !== null) {
         setShowContentScreen(show);
      }
      setShowContentScreen(!showContentScreen);
   };

   return (
      tool === 2 && (
         <div
            className={styles.toolVideos}
            onClick={() => {
               if (!preview.show) {
                  // dispatch({ type: "SHOW_PREVIEW" });
               }
            }}
         >
            {!showEdit ? (
               <>
                  <div
                     className={`${styles.toolItemName} ${styles.orangeColor} ${
                        showContentTimeline ? styles.expand : ""
                     }`}
                     onClick={toggleTimeline}
                  >
                     <span>Timeline</span>
                  </div>
                  {showContentTimeline && (
                     <div className={styles.videosList}>
                        {timelineVideos.map((vd) =>
                           vd.type === "video" ? (
                              <ToolVideoItem
                                 key={vd.video._id}
                                 vd={vd}
                                 setShowContentTimeline={setShowContentTimeline}
                                 selected={true}
                              />
                           ) : (
                              <ToolScreenItem
                                 vd={{ screen: vd }}
                                 setShowContentTimeline={setShowContentTimeline}
                                 selected={true}
                              />
                           )
                        )}
                     </div>
                  )}
                  <div
                     className={`${styles.toolItemName} ${
                        showContentRecorded ? styles.expand : ""
                     }`}
                     onClick={toggleRecorded}
                  >
                     <span>Recordings</span>
                  </div>
                  {showContentRecorded && (
                     <div className={styles.videosList}>
                        {recordingVideos.map((vd) => (
                           <ToolVideoItem
                              key={vd._id}
                              vd={{ video: vd }}
                              setShowContentTimeline={setShowContentTimeline}
                           />
                        ))}
                     </div>
                  )}
                  <div
                     className={`${styles.toolItemName} ${
                        showContentUpload ? styles.expand : ""
                     }`}
                     onClick={toggleUpload}
                  >
                     <span>Uploads</span>
                  </div>
                  {showContentUpload && (
                     <div className={styles.videosList}>
                        {uploadsVideos.map((vd) => (
                           <ToolVideoItem
                              key={vd._id}
                              vd={{ video: vd }}
                              setShowContentTimeline={setShowContentTimeline}
                           />
                        ))}
                     </div>
                  )}
                  <div
                     className={`${styles.toolItemName} ${
                        showContentScreen ? styles.expand : ""
                     }`}
                     onClick={toggleScreen}
                  >
                     <span>Templates</span>
                  </div>
                  {showContentScreen && (
                     <div className={styles.videosList}>
                        {templates.map((vd) => (
                           <ToolScreenItem
                              vd={{ screen: vd }}
                              setShowContentTimeline={setShowContentTimeline}
                           />
                        ))}
                     </div>
                  )}
                  {/* <p className={styles.toolSubtitle}>Library</p>
            <div className={styles.videosList}>
              {unselectedVideos.map((vd, index) => renderVideoItem({ video: vd }, index))}
            </div> */}
               </>
            ) : (
               <div className={styles.toolSection}>
                  <span className={styles.toolTitleSection}>
                     <div
                        onClick={() => setShowEdit(false)}
                        className={styles.backArrow}
                     >
                        <img src="/assets/campaign/backArrow.svg" />{" "}
                     </div>
                     <p className={styles.toolTitle}>Edit</p>
                  </span>

                  <div className={styles.toolItems}>
                     <ToolItemText />
                     <ToolItemLink />
                  </div>
               </div>
            )}
         </div>
      )
   );
};

export default ToolVideos;
