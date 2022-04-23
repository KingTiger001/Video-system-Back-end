import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getDataByType, useDebounce, useVideoResize } from "@/hooks";

import dayjs from "@/plugins/dayjs";

import EndScreen from "@/components/Campaign/EndScreen";
import { defaultEndScreen } from "../../store/reducers/campaign";

import Logo from "@/components/Campaign/Logo";

import styles from "@/styles/components/Campaign/Player.module.sass";
import Placeholder from "./Placeholder";
import Overlays from "./Overlays";
import OverlaysStatic from "./OverlaysVideoPlayer";
import { mainAPI } from "@/plugins/axios";
import useGenerateThumbnail from "hooks/useGenerateThumbnail";
import { uploadThumbnailFile } from "utils";

const Player = () => {
   const dispatch = useDispatch();
   const previewRef = useRef();

   const endScreen = useSelector((state) => state.campaign.endScreen);
   const duration = useSelector((state) => state.campaign.duration);
   const selectedContent = useSelector(
      (state) => state.campaign.selectedContent
   );
   const helloScreen = useSelector((state) => state.campaign.helloScreen);
   const isPlaying = useSelector((state) => state.campaign.isPlaying);
   const logo = useSelector((state) => state.campaign.logo);
   const preview = useSelector((state) => state.campaign.preview);
   const createThumbnailRedux = useSelector(
      (state) => state.campaign.createThumbnail
   );

   const previewVideo = useSelector((state) => state.campaign.previewVideo);
   const progression = useSelector((state) => state.campaign.progression);
   const contents = useSelector((state) => state.campaign.contents);
   const videoSeeking = useSelector((state) => state.campaign.videoSeeking);
   const previewEndScreen = useSelector(
      (state) => state.campaign.previewEndScreen
   );

   //
   const videosRef = useSelector((state) => state.campaign.videosRef);
   const currentVideo = useSelector((state) => state.campaign.currentVideo);
   const videosOffset = useSelector((state) => state.campaign.videosOffset);
   //

   const [resume, setResume] = useState(false);
   const [isPlayPreview, setIsPlayPreview] = useState(false);
   const [ref, setRef] = useState();
   const { generateTemplateThumbnail } = useGenerateThumbnail();

   useEffect(() => {
      setResume(
         preview.show || helloScreen.name || endScreen.name || contents.url
      );
   }, [preview.show, helloScreen, endScreen, contents]);

   const playerRef = useRef();
   const { width: playerWidth } = useVideoResize({
      ref: playerRef,
      autoWidth: true,
   });
   const videoRefCb = useCallback(
      (node) => {
         if (node !== null) {
            dispatch({ type: "SET_VIDEOS_REF", data: node });
         } else {
         }
      },
      [contents]
   );

   const getVideoIndex = (max) => {
      let count = -1;
      for (let i = 0; i <= max; i++) {
         if (contents[i] && contents[i].type === "video") count++;
      }
      if (count < 0) count = 0;
      return count;
   };

   useEffect(() => {
      // Upload Thumbnail For Template
      (async () => {
         if (
            createThumbnailRedux &&
            ref &&
            selectedContent &&
            selectedContent.type === "screen"
         ) {
            dispatch({ type: "SET_CREATE_TEMPLATE_THUMBNAIL", data: false });
            const { thumbnail } = await generateTemplateThumbnail(
               "PlayerContainer"
            );
            const { url } = await uploadThumbnailFile(thumbnail);
            await mainAPI.patch(`/templates/${selectedContent._id}`, {
               ...selectedContent,
               thumbnail: url,
            });
            const array = contents.slice();
            const indexOfTemplate = array.findIndex(
               (i) => i._id === selectedContent._id
            );
            array[indexOfTemplate] = {
               ...array[indexOfTemplate],
               thumbnail: url,
            };
            dispatch({
               type: "DRAG_ITEM",
               data: true,
            });
            dispatch({
               type: "SET_VIDEO",
               data: array,
            });
         }
      })();
   }, [createThumbnailRedux, ref, selectedContent]);

   useEffect(() => {
      const handleSeeking = () =>
         dispatch({ type: "SET_VIDEO_SEEKING", data: true });
      const handlePlaying = () =>
         dispatch({ type: "SET_VIDEO_SEEKING", data: false });

      if (videosRef.length === contents.length) {
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
         (videoSeeking &&
            videosRef[getVideoIndex(currentVideo)].currentTime !== 0) ||
         (!isPlaying && progression !== 0)
      ) {
         clearInterval(interval);
      } else if (isPlaying) {
         interval = setInterval(() => {
            if (
               videosRef[getVideoIndex(currentVideo)]?.readyState === 4 ||
               contents[currentVideo]?.type !== "video"
            ) {
               dispatch({
                  type: "SET_PROGRESSION",
                  data: progression + 100,
               });
            }
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
         dispatch({
            type: "SET_CURRENT_OVERLAY",
            data: 0,
         });
      }
      if (progression < 0) {
         dispatch({
            type: "SET_PROGRESSION",
            data: 0,
         });
      }

      for (let i = 0; i < contents.length; i++) {
         if (
            progression > videosOffset[i] * 1000 &&
            progression <
               (videosOffset[i] + getDataByType(contents[i]).duration) * 1000 &&
            currentVideo !== i
         ) {
            if (contents[currentVideo]?.type === "video") {
               videosRef[getVideoIndex(currentVideo)]?.pause();
            }
            dispatch({
               type: "SET_CURRENT_VIDEO",
               data: i,
            });
            dispatch({
               type: "SET_SELECTED_CONTENT",
               data: contents[i],
            });
            dispatch({
               type: "SET_CURRENT_OVERLAY",
               data: i,
            });
         }
      }
      if (progression >= duration) {
         dispatch({
            type: "SET_SELECTED_CONTENT",
            data: contents[0],
         });
      } else if (
         !videosRef[getVideoIndex(currentVideo)]?.paused &&
         !isPlaying
      ) {
         videosRef[getVideoIndex(currentVideo)]?.pause();
      } else if (
         contents[currentVideo]?.type === "video" &&
         !videosRef[getVideoIndex(currentVideo)]?.paused &&
         isPlaying &&
         !videosRef[getVideoIndex(currentVideo)]?.ended
      ) {
         videosRef[getVideoIndex(currentVideo)]?.play();
      } else if (
         contents[currentVideo]?.type === "video" &&
         videosRef.length > 0 &&
         videosRef[getVideoIndex(currentVideo)]?.paused &&
         isPlaying &&
         !videosRef[getVideoIndex(currentVideo)]?.ended
      ) {
         videosRef[getVideoIndex(currentVideo)]?.play();
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

   const getPositionPercent = (x, y) => {
      return {
         x: (x / ref.offsetWidth) * 100,
         y: (y / ref.offsetHeight) * 100,
      };
   };

   const convertPercentToPx = ({ x, y }) => {
      if (!playerRef) {
         return;
      } else {
         return {
            x: (x * playerRef.current?.offsetWidth) / 100,
            y: (y * playerRef.current?.offsetHeight) / 100,
         };
      }
   };

   const handleStop = (_, info, id, data, type) => {
      const obj = { ...data };

      const index =
         type === "text"
            ? obj.texts.findIndex((text) => text._id === id)
            : obj.links.findIndex((link) => link._id === id);
      if (index < 0) return;
      const { x, y } = getPositionPercent(info.x, info.y);
      // const { x, y } = { x: info.x, y: info.y };
      if (type === "text") {
         obj.texts[index].position = { x, y };
      } else {
         obj.links[index].position = { x, y };
      }

      const indexArr = contents.findIndex(
         (content) => content._id === data._id
      );
      let array = contents.slice();
      array[indexArr] = obj;
      dispatch({
         type: "DRAG_ITEM",
         data: true,
      });
      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
   };

   const renderVideos = () => {
      if (contents.length > 0)
         return contents.map(
            (elem, i) =>
               elem.type === "video" &&
               elem.video && (
                  <video
                     ref={videoRefCb}
                     key={i}
                     src={elem.video.url}
                     width="100%"
                     style={{
                        display: currentVideo === i ? "block" : "none",
                        position: "initial",
                     }}
                     controls={false}
                  />
               )
         );
   };

   const renderScreens = () => {
      if (contents.length > 0) {
         return contents.map(
            (elem, i) =>
               elem.type === "screen" &&
               currentVideo === i && <EndScreen key={i} data={elem} />
         );
      }
   };
   const renderFirstScreen = () => {
      if (
         progression === 0 &&
         contents.length > 0 &&
         contents[0].type === "screen" &&
         !isPlaying
      ) {
         return (
            <Overlays fromPlayer={true} contents={contents} activeContent={0} />
         );
      }
   };

   // const updateProcessingVideo = async () => {
   //     console.log(previewVideo);
   //     if (previewVideo.status === "processing" || previewVideo.status === "waiting") {
   //         const newVideo = await mainAPI(`/videos/${previewVideo._id}`);
   //         dispatch({ type: "SET_PREVIEW_VIDEO", data: newVideo });
   //     }
   // };

   // useDebounce(updateProcessingVideo, 3000);

   // console.log(previewVideo)

   const handlePlayVideo = async () => {
      if (
         preview.element === "video" &&
         previewVideo.url &&
         previewRef &&
         previewRef.current
      ) {
         if (isPlayPreview) {
            console.log("STOP");
            previewRef.current.pause();
            setIsPlayPreview(false);
         } else {
            console.log("PLAY");
            previewRef.current.play();
            setIsPlayPreview(true);
         }
      } else {
         dispatch({ type: "HIDE_PREVIEW" });
         dispatch({ type: isPlaying ? "PAUSE" : "PLAY" });
         setResume(true);
      }
   };

   return (
      <div className={styles.player}>
         <div
            className={styles.playerWrap}
            style={{
               width: "90%",
               maxWidth: "850px",
               height: "525px" /* playerWidth */,
               overflow: "visible",
            }}
         >
            <div ref={playerRef} className={styles.video} id="player-id">
               {preview.show ? (
                  <div>
                     {preview.element === "record" && (
                        <Placeholder of={preview.element} />
                     )}
                     {preview.element === "screen" && (
                        <>
                           <EndScreen data={preview.data} />
                           <OverlaysStatic
                              contents={[preview.data]}
                              playerWidth={playerWidth}
                              activeContent={0}
                              containerRef={playerRef.current}
                           />
                        </>
                     )}
                     {preview.element === "video" &&
                        (previewVideo.url || contents.url ? (
                           <video
                              key={previewVideo.url}
                              controls={false}
                              height="100%"
                              width="100%"
                              ref={previewRef}
                           >
                              <source
                                 src={previewVideo.url || contents.url}
                                 type="video/mp4"
                              />
                              Sorry, your browser doesn't support embedded
                              videos.
                           </video>
                        ) : (
                           <Placeholder of={preview.element} />
                        ))}

                     {preview.element === "endScreen" &&
                        (Object.keys(previewEndScreen).length == 0 &&
                        (JSON.stringify(endScreen) ===
                           JSON.stringify(defaultEndScreen) ||
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
                     {preview.element === "logo" && (
                        <Placeholder of={preview.element} />
                     )}
                     {logo && <Logo data={logo} />}
                     {playerWidth > 0 && !preview.show && (
                        <div className={styles.overlaySection}>
                           <Overlays playerRef={playerRef.current} />
                        </div>
                     )}
                  </div>
               ) : null}

               {!resume && contents.length === 0 && <Placeholder of="all" />}

               <div
                  ref={(newRef) => setRef(newRef)}
                  style={{
                     display: preview.show ? "none" : "flex",
                     height: contents.length ? "100%" : "auto",
                     alignItems: "center",
                     justifyContent: "center",
                     overflow: "hidden",
                  }}
                  id="PlayerContainer"
               >
                  {/* || !resume */}
                  {renderVideos()}
                  {renderScreens()}

                  {!preview.show && (
                     <>
                        <Logo data={logo} />
                        {playerWidth > 0 && !preview.show && (
                           <div className={styles.overlaySection}>
                              <Overlays playerRef={playerRef.current} />
                           </div>
                        )}
                     </>
                  )}
               </div>
            </div>
            <div className={styles.controls}>
               {previewVideo &&
               (previewVideo.status == "done" ||
                  previewVideo.type === "screen") ? (
                  <>
                     {!previewRef.current ? (
                        <p className={styles.progression}>
                           {displayProgression()}
                        </p>
                     ) : (
                        ""
                     )}
                     <img
                        onClick={handlePlayVideo}
                        src={
                           isPlaying || isPlayPreview
                              ? "/assets/video/pause.svg"
                              : "/assets/video/play.svg"
                        }
                     />
                  </>
               ) : (
                  <p style={{ color: "white", textTransform: "capitalize" }}>
                     {previewVideo && previewVideo.status}
                  </p>
               )}
            </div>
         </div>
      </div>
   );
};

export default Player;
