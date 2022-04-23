import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditableContent from "@/components/global/EditableContent";
import { toast } from "react-toastify";
import withAuthServerSideProps from "@/hocs/withAuthServerSideProps";

import { initializeStore } from "@/store";

import { mainAPI, mediaAPI } from "@/plugins/axios";

import Button from "@/components/Button";
import PopupDeleteVideo from "@/components/Popups/PopupDeleteVideo";
import PopupUploadVideo from "@/components/Popups/PopupUploadVideo";
import Timeline from "@/components/Campaign/Timeline";
import Tools from "@/components/Campaign/Tools/index";
import Player from "@/components/Campaign/Player";
import Preview from "@/components/Campaign/Preview";
import Share from "@/components/Campaign/Share";
import { ObjectID } from "bson";
import { getDataByType, handleProgression, useDebounce } from "@/hooks";

import styles from "@/styles/pages/app/[campaignId].module.sass";

// test
import { resetServerContext } from "react-beautiful-dnd";
import PopupCreateCampaign from "@/components/Popups/PopupCreateCampaign";

import SidebarLeftCreate from "@/components/SidebarLeft/SidebarLeftCreate";

import VideoRecorder from "@/components/Campaign/VideoRecorder/index";

import ImportButton from "@/components/Campaign/ImportButton";

const Campaign = ({ me }) => {
   const router = useRouter();
   const dispatch = useDispatch();
   const popup = useSelector((state) => state.popup);
   const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });
   const inputNameRef = useRef();

   const campaign = useSelector((state) => state.campaign);
   const duration = useSelector((state) => state.campaign.duration);
   const endScreen = useSelector((state) => state.campaign.endScreen);
   const helloScreen = useSelector((state) => state.campaign.helloScreen);
   const logo = useSelector((state) => state.campaign.logo);
   const name = useSelector((state) => state.campaign.name);

   const contents = useSelector((state) => state.campaign.contents);
   const finalVideo = useSelector((state) => state.campaign.finalVideo);
   const previewVideo = useSelector((state) => state.campaign.previewVideo);
   const videosOffset = useSelector((state) => state.campaign.videosOffset);
   const currentVideo = useSelector((state) => state.campaign.currentVideo);
   const selectedContent = useSelector(
      (state) => state.campaign.selectedContent
   );
   const preview = useSelector((state) => state.campaign.preview);
   const hideTimeline = useSelector((state) => state.campaign.hideTimeline);
   const videosRef = useSelector((state) => state.campaign.videosRef);
   const templateList = useSelector((state) => state.campaign.templateList);
   const dragItem = useSelector((state) => state.campaign.dragItem);
   const selectedScreen = useSelector((state) => state.global.selectedScreen);

   const [displayMenu, showMenu] = useState(false);
   const [loadingPopup, setLoadingPopup] = useState({
      show: true,
      progress: 0,
   });
   const [displayPreview, showPreview] = useState(false);
   const [displayShare, showShare] = useState(false);
   const [previewLoading, setPreviewLoading] = useState(false);
   const [shareLoading, setShareLoading] = useState(false);
   const [uploadingVideo, setUploadingVideo] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);
   const [type, setType] = useState("video");
   const ref = useRef();
   const headerMenuRef = useRef(null);

   /* Record */
   const [displayVideoRecorder, showVideoRecorder] = useState(false);

   const [screen, showScreen] = useState(
      contents.length > 0 ? "MEDIA" : "CREATE"
   );
   // const [displayPreview, showPreview] = useState(false);

   useEffect(() => {
      if (
         preview &&
         preview.element === "screen" &&
         !dragItem &&
         contents.length !== 0
      ) {
         console.log("Select Screen From Page", contents[contents.length - 1]);
         if (contents[contents.length - 1])
            selectScreen(contents[contents.length - 1], contents);
      }
      if (dragItem) {
         dispatch({
            type: "DRAG_ITEM",
            data: false,
         });
      }
   }, [contents]);

   useEffect(() => {
      if (inputNameRef && inputNameRef.current && !name.length) {
         inputNameRef.current.focus();
      }
   }, [inputNameRef]);

   useEffect(() => {
      if (selectedScreen) showScreen(selectedScreen);
   }, [selectedScreen]);

   useEffect(() => {
      const handleClickOutside = (e) => {
         if (
            headerMenuRef.current &&
            !headerMenuRef.current.contains(e.target)
         ) {
            showMenu(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [headerMenuRef]);

   // mounted
   useEffect(() => {
      if (me.logo && !logo.value) {
         dispatch({
            type: "CHANGE_LOGO",
            data: {
               value: me.logo,
            },
         });
      }

      setTimeout(() => dispatch({ type: "SET_PROGRESSION", data: 1 }), 1);
      setTimeout(() => dispatch({ type: "SET_PROGRESSION", data: 0 }), 2);
   }, []);

   // Save campaign
   useEffect(() => {
      const saveCampaign = async () => {
         const res = await mainAPI
            .patch(`/campaigns/${router.query.campaignId}`, {
               duration,
               endScreen,
               helloScreen,
               logo,
               name,
               templateList,
               contents: contents || [],
               finalVideo,
            })
            .catch((err) => console.log("err", err));
      };
      saveCampaign();

      dispatch({
         type: "HAS_CHANGES",
         data: false,
      });
   }, [duration, endScreen, helloScreen, logo, name, contents, finalVideo]);

   const checkBeforeStartShare = () => {
      if (!name.length) {
         if (inputNameRef && inputNameRef.current) inputNameRef.current.focus();
         return toast.error("Please enter video title.");
      }
      if (contents.length <= 0) {
         return toast.error(
            "You need to add a video before sharing your campaign."
         );
      }
      setShareLoading(true);
      onMerge()
         .then(() => {
            setTimeout(() => {
               showShare(true);
               setShareLoading(false);
            }, 1000);
         })
         .catch((err) => {
            toast.error("The compression failed");
            setShareLoading(false);
         });
   };

   const selectScreen = (elem, array = contents.slice()) => {
      dispatch({
         type: "SET_SELECTED_CONTENT",
         data: elem,
      });
      dispatch({
         type: "SET_PREVIEW_VIDEO",
         data: elem,
      });
      const index = contents.findIndex(
         (c) => c.type === "screen" && c._id === elem._id
      );

      if (index !== -1) {
         const position = array[index].position;
         const timePosition = videosOffset[position] || 0;

         console.log("Position: ", position);
         console.log("timePosition: ", timePosition);
         console.log("videosOffset: ", videosOffset);
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
            data: { element: elem.type, data: elem },
         });
      }
      dispatch({
         type: "DISPLAY_ELEMENT",
         data: "endScreen",
      });
      dispatch({
         type: "SET_PREVIEW_END_SCREEN",
         data: elem,
      });
   };

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
         console.log(
            array,
            videosOffset,
            timePosition * 1000 + 10,
            dispatch,
            videosRef,
            currentVideo,
            preview
         );
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
         dispatch({
            type: "SHOW_PREVIEW",
            data: { element: "video", data: {} },
         });
      }
      dispatch({ type: "SET_PREVIEW_VIDEO", data: elem.video });
      dispatch({ type: "HIDE_PREVIEW" });
   };

   const getVideos = async (selectLast = false, update = false) => {
      const { data: videos } = await mainAPI("/users/me/videos");
      if (selectLast && videos.length > 0) {
         if (!update) {
            const data = addToContents(videos[0]);
            selectVideo(data[data.length - 1], data);
            dispatch({ type: "SET_VIDEO", data });
            dispatch({ type: "CALC_VIDEOS_OFFSET", data });
            dispatch({ type: "SET_PROGRESSION", data: 0 });
            dispatch({
               type: "SET_CURRENT_VIDEO",
               data: 0,
            });
         }
         // dispatch({ type: "SET_VIDEOS_REF" });
      }
      dispatch({
         type: "SET_VIDEO_LIST",
         data: videos,
      });
   };

   useEffect(() => {
      // getVideos();
      if (contents.length) {
         if (contents[0].type === "screen") selectScreen(contents[0], contents);
         else selectVideo(contents[0], contents);
      }
   }, []);

   const onMerge = async () => {
      try {
         const { data } = await mediaAPI.post("/renderVideo", {
            campaignId: campaign._id,
            contents: contents,
         });
         dispatch({
            type: "SET_FINALVIDEO",
            data: { url: data.url },
         });
         // Set current video redendered in cookies
         //cookies.set('rendred-video', data, { path: '/' });
         return data.url;
      } catch (err) {
         const code = err.response && err.response.data;
         if (code) {
            throw new Error(code);
         } else {
            throw new Error(err);
         }
      }
   };

   const handlePreviewMode = () => {
      setPreviewLoading(true);
      onMerge()
         .then(() => {
            setTimeout(() => {
               showPreview(true);
               setPreviewLoading(false);
            }, 1000);
         })
         .catch((err) => {
            toast.error("The compression failed");
            setPreviewLoading(false);
         });
   };

   const renderHeader = () => (
      <div className={styles.header}>
         {/* <div className={styles.headerMenu}>
            <div
                className={styles.headerMenuButton}
                onClick={() => showMenu(true)}
            >
                <img src="/assets/common/menu.svg" />
                <p>Menu</p>
            </div>
            {displayMenu && (
                <div className={styles.headerMenuDropdown} ref={headerMenuRef}>
                    <div
                        className={styles.headerMenuClose}
                        onClick={() => showMenu(false)}
                    >
                        <img src="/assets/common/close.svg" />
                        <p>Close menu</p>
                    </div>
                    <ul>
                        <li>
                            <Link href="/app">
                                <a>Dashboard</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/app/campaigns">
                                <a>My videos</a>
                            </Link>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <a href="mailto:contact@myfomo.io">Need help ?</a>
                        </li>
                    </ul>
                </div>
            )}
        </div> */}
         <div className={styles.headerVideoTitle}>
            <div>
               <div className={styles.headerVideoInput}>
                  <input
                     type="text"
                     onChange={(e) =>
                        dispatch({ type: "SET_NAME", data: e.target.value })
                     }
                     onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                     }}
                     placeholder="Please enter video title"
                     value={name}
                     ref={inputNameRef}
                     className={styles.headerVideoInput}
                  />
               </div>
               <img src="/assets/campaign/edit_title.svg" />
            </div>
         </div>
         <div className={styles.headerActions}>
            {/*<Button*/}
            {/*    color="white"*/}
            {/*    // onClick={() => showPreview(true)}*/}
            {/*    onClick={handlePreviewMode}*/}
            {/*    textColor="dark"*/}
            {/*    style={{*/}
            {/*        boxShadow: "0px 7px 14px -8px rgba(0,0,0,0.5)",*/}
            {/*    }}*/}
            {/*>*/}
            {/*    {previewLoading ? "Processing..." : "Preview mode"}*/}
            {/*</Button>*/}
            <Button
               style={{
                  width: "120px",
                  height: "38px",
                  fontSize: "17px",
               }}
               onClick={checkBeforeStartShare}
            >
               {shareLoading ? "Processing..." : "Share"}
            </Button>
         </div>
      </div>
   );

   const createTemplate = () => {
      const selectedScreens = contents.filter((obj) => obj.type === "screen");
      const array = contents.slice();
      const id = new ObjectID();
      const template = {
         _id: id.toString(),
         position: contents.length,
         status: "done",
         type: "screen",
         screen: {
            name: `Screen${templateList.length}`,
            background: { type: "color", color: "#9FE4FC" },
            duration: 3,
         },
         texts: [],
         links: [],
      };
      addTemplateToDatabase(template, () => {
         dispatch({
            type: "SET_TEMPLATE_LIST",
            data: [template, ...templateList],
         });
      });
      array.push(template);
      dispatch({
         type: "SHOW_PREVIEW",
         data: {
            element: "screen",
            data: template,
         },
      });
      dispatch({ type: "SET_VIDEO", data: array });
      dispatch({ type: "CALC_VIDEOS_OFFSET", data: array });
      dispatch({ type: "SET_VIDEOS_REF" });
      dispatch({ type: "SET_PREVIEW_END_SCREEN", data: template });

      // Create Thumbnail
      dispatch({ type: "SET_CREATE_TEMPLATE_THUMBNAIL", data: true });

      dispatch({ type: "DISPLAY_ELEMENT", data: "endScreen" });
      getVideos(true, true);
      dispatch({
         type: "SET_PREVIEW_VIDEO",
         data: template,
      });
      dispatch({
         type: "SELECT_TOOL",
         data: 2,
      });
      showScreen("SCREEN");
      if (contents[contents.length - 1]) selectScreen(template, contents);
   };

   const addTemplateToDatabase = async (temp, callback) => {
      try {
         const { data: template } = await mainAPI.post("/templates", temp);
         if (template && callback) callback(template);
      } catch (err) {
         const code = err.response && err.response.data;
         if (code === "Upload.incorrectFiletype") {
            setError(
               "Incorrect file type, Please use an accepted format (webm, mp4, avi, mov)"
            );
         }
      }
   };

   const uploadVideo = async (file) => {
      try {
         // create a video
         const { data: video } = await mainAPI.post("/videos", {
            name: file.name.split(".")[0],
            status: "uploading",
         });
         setUploadingVideo(video);
         // upload for encoding
         const formData = new FormData();
         formData.append("file", file);
         formData.append("folder", "videos");
         formData.append("videoId", video._id);
         await mediaAPI.post("/videos", formData, {
            onUploadProgress: function (progressEvent) {
               const totalLength = progressEvent.lengthComputable
                  ? progressEvent.total
                  : progressEvent.target.getResponseHeader("content-length") ||
                    progressEvent.target.getResponseHeader(
                       "x-decompressed-content-length"
                    );
               setUploadProgress(
                  Math.round((progressEvent.loaded * 100) / totalLength)
               );
            },
         });
         await mainAPI.patch(`/videos/${video._id}`, {
            status: "waiting",
         });
         getVideos(true);
         showScreen("");
         dispatch({
            type: "SELECT_TOOL",
            data: 2,
         });
         dispatch({
            type: "SHOW_PREVIEW",
            data: {
               element: "video",
            },
         });
      } catch (err) {
         const code = err.response && err.response.data;
         if (code === "Upload.incorrectFiletype") {
            setError(
               "Incorrect file type, Please use an accepted format (webm, mp4, avi, mov)"
            );
         }
      }
   };

   const updateUploadingVideo = async () => {
      if (!uploadingVideo) return false;
      const { data } = await mainAPI(`/videos/${uploadingVideo._id}`);
      console.log(data, " From CampaignId Page");
      setUploadingVideo(data);
      setLoadingPopup({ show: true, progress: data.statusProgress });
      if (data.status === "done") {
         setLoadingPopup({ show: false, progress: 0 });
         setUploadingVideo(false);
      }
   };

   useDebounce(updateUploadingVideo, 4000, [uploadingVideo]);

   const renderCreatePanel = () => {
      return (
         <div className={styles.createPanel}>
            <table
               onDrop={(e, f, g) => {
                  e.preventDefault();
                  setType("video");
                  showPopup({
                     display: "UPLOAD_VIDEO",
                     data: e.dataTransfer.files[0],
                     from: "import",
                  });
                  e.target.value = null;
               }}
               onDragOver={(e) => e.preventDefault()}
            >
               <tbody>
                  <tr>
                     <td onClick={() => showVideoRecorder(true)}>
                        <img src="/assets/campaign/record_video.svg"></img>
                        <p>Record a video</p>
                     </td>
                     <td>
                        <ImportButton
                           onChange={(e) => {
                              e.preventDefault();
                              setType("video");
                              showPopup({
                                 display: "UPLOAD_VIDEO",
                                 data: e.target.files[0],
                                 from: "import",
                              });
                              e.target.value = null;
                           }}
                        >
                           <img src="/assets/campaign/upload_video.svg"></img>
                           <p>Upload a video or drag it here</p>
                        </ImportButton>
                     </td>
                  </tr>
                  <tr>
                     <td
                        onClick={() => {
                           showScreen("MEDIA");
                        }}
                     >
                        <img src="/assets/campaign/library.svg"></img>
                        <p>Choose from Library</p>
                     </td>
                     <td onClick={createTemplate}>
                        <img src="/assets/campaign/create_template.svg"></img>
                        <p>Create template</p>
                     </td>
                  </tr>
               </tbody>
            </table>
            {displayVideoRecorder && (
               <VideoRecorder
                  onClose={() => showVideoRecorder(false)}
                  onDone={(file) => {
                     setType("record");
                     showPopup({
                        display: "UPLOAD_VIDEO",
                        data: file,
                        from: "record",
                     });
                     showVideoRecorder(false);
                  }}
               />
            )}
         </div>
      );
   };

   return (
      <div className={styles.dashboardCampaign} ref={ref}>
         <Head>
            <title>Edit my video campaign | FOMO</title>
         </Head>

         {popup.display === "UPLOAD_VIDEO" && (
            <PopupUploadVideo
               onDone={(video) => {
                  const data = addToContents(video);
                  dispatch({
                     type: "SHOW_PREVIEW",
                     data: {
                        element: "video",
                     },
                  });
                  selectVideo(data[data.length - 1], data);
                  dispatch({ type: "SET_VIDEO", data });
                  dispatch({ type: "CALC_VIDEOS_OFFSET", data });
                  dispatch({ type: "SET_VIDEOS_REF" });
                  showVideoRecorder(false);
                  getVideos(true, true);
                  showScreen("");
                  dispatch({
                     type: "SELECT_TOOL",
                     data: 2,
                  });
               }}
               loading={loadingPopup}
               type={type}
            />
         )}
         {popup.display === "DELETE_VIDEO" && (
            <PopupDeleteVideo
               onDone={() => {
                  getVideos();
                  hidePopup();
               }}
            />
         )}

         {/* Main screen */}
         <div className={styles.container}>
            <SidebarLeftCreate
               screen={screen}
               renderScreen={(s) => showScreen(s)}
            />
            {screen !== "" && screen !== "CREATE" && (
               <Tools me={me} screen={screen} />
            )}
            <div className={styles.rightSide}>
               {renderHeader()}
               <div
                  className={styles.main}
                  style={{
                     height: "auto",
                  }}
               >
                  {screen !== "CREATE" && (
                     <div>
                        <Player />
                     </div>
                  )}
                  {screen === "CREATE" && renderCreatePanel()}
               </div>
            </div>
         </div>

         <div className={styles.footer}>
            <Timeline handlecreate={() => showScreen("CREATE")} />
         </div>

         {displayPreview && (
            <Preview campaign={campaign} onClose={() => showPreview(false)} />
         )}
         {popup.display === "CREATE_CAMPAIGN" && <PopupCreateCampaign />}
         {displayShare && (
            <Share
               campaignId={router.query.campaignId}
               me={me}
               onClose={() => showShare(false)}
               onCreateCampaignClicked={() => {
                  showPopup({ display: "CREATE_CAMPAIGN" });
               }}
               onPreviewClicked={async (campaign) => {}}
               onDone={() => {
                  toast.success("Campaign sent.");
                  router.push("/app/campaigns");
               }}
               backText="Back"
            />
         )}
      </div>
   );
};

export default Campaign;
export const getServerSideProps = withAuthServerSideProps(
   async ({ params }, user) => {
      const reduxStore = initializeStore();
      const { dispatch } = reduxStore;

      const { data: campaign } = await mainAPI.get(
         `/campaigns/${params.campaignId}`
      );
      const { data: templateList } = await mainAPI.get("/users/me/templates");
      const { data: videos } = await mainAPI.get("/users/me/videos");
      const { data: endScreenList } = await mainAPI.get("/users/me/endScreens");
      const { data: helloScreenList } = await mainAPI.get(
         "/users/me/helloScreens"
      );
      try {
         dispatch({
            type: "SET_CAMPAIGN",
            data: {
               ...campaign,
               contents: campaign.contents.map((c) => {
                  return c.type === "screen" ? { ...c, status: "done" } : c;
               }),
            },
         });
         dispatch({
            type: "SET_VIDEO_LIST",
            data: videos,
         });
         dispatch({
            type: "SET_TEMPLATE_LIST",
            data: templateList,
         });
         dispatch({
            type: "SET_END_SCREEN_LIST",
            data: endScreenList,
         });
         dispatch({
            type: "SET_HELLO_SCREEN_LIST",
            data: helloScreenList,
         });
         dispatch({ type: "CALC_DURATION" });
         dispatch({ type: "CALC_VIDEOS_OFFSET", data: campaign.contents });
      } catch (err) {
         console.log(err);
      }
      resetServerContext();

      return {
         initialReduxState: reduxStore.getState(),
      };
   }
);
