import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mainAPI, mediaAPI } from "@/plugins/axios";

import Button from "../Button";
import Input from "../Input";
import Popup from "./Popup";

import styles from "@/styles/components/Popups/PopupUploadVideo.module.sass";
import { useDebounce } from "@/hooks";

const PopupUploadVideo = ({ onDone, loading, type }) => {
   const dispatch = useDispatch();
   const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
   const popup = useSelector((state) => state.popup);

   const [error, setError] = useState("");
   const [isFinished, setIsFinished] = useState(false);
   const [isUploading, setIsUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);
   const [videoName, setVideoName] = useState(null);
   const [video, setVideo] = useState(null);

   const upload = async (e = false) => {
      if (e) {
         e.preventDefault();
      }

      if (popup.from === "import" && !loading.show) {
         onDone(video, popup.data);
         setIsFinished(true);
         hidePopup();
      }

      try {
         setError("");
         setIsUploading(true);
         // create a video
         const { data: video } = await mainAPI.post("/videos", {
            name:
               popup.from === "import"
                  ? popup.data.name.split(".")[0]
                  : videoName,
            status: "uploading",
            type,
         });

         setVideo(video);

         // upload for encoding
         const formData = new FormData();
         formData.append("file", popup.data);
         formData.append("folder", "videos");
         formData.append("videoId", video._id);
         try {
            const rsp = await mediaAPI.post(
               "/videos",
               formData /* , {
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
        } */
            );
         } catch (err) {
            setError("Network Error.");
            setIsUploading(false);
            return false;
         }
         await mainAPI.patch(`/videos/${video._id}`, {
            status: "waiting",
         });
         // onDone();
         // setIsFinished(true);
         // hidePopup();
      } catch (err) {
         const code = err.response && err.response.data;
         if (code === "Upload.incorrectFiletype") {
            setError(
               "Incorrect file type, Please use an accepted format (webm, mp4, avi, mov)"
            );
         }
      } finally {
         // setIsUploading(false);
         // setUploadProgress(0);
      }
   };

   const updateProcessingVideos = async () => {
      if (video) {
         const { data } = await mainAPI(`/videos/${video._id}`);
         setUploadProgress(data.statusProgress);
         setVideo(data);
         if (data.status === "done") {
            setIsUploading(false);
            onDone(data);
            setIsFinished(true);
            hidePopup();
         }
      }
   };

   useDebounce(updateProcessingVideos, 4000);

   useEffect(() => {
      if (popup.from === "import" && !isUploading) {
         upload();
      }
   }, []);

   return (
      <Popup
         allowBackdropClose={false}
         showCloseIcon={false}
         title={
            !isUploading && popup.from !== "import" ? "Save recorded video" : ""
         }
         bgcolor="light"
      >
         {error && <p className={styles.error}>{error}</p>}
         {popup.from !== "import" && !isUploading && !isFinished && (
            <form onSubmit={upload} className={styles.form}>
               {/* {popup.from === "recorder" && (
            <p className={styles.message}>
              You just recorded a video. To save the video give it a name.
            </p>
          )} */}
               <Input
                  onChange={(e) => setVideoName(e.target.value)}
                  style={{
                     height: "37.48px",
                     background: "#F4F7F9",
                     border: "1.24944px solid rgba(76, 74, 96, 0.5)",
                     borderRadius: "4.99777px",
                     fontWeight: "400",
                     fontSize: "16.2428px",
                     marginBottom: "19px",
                     letterSpacing: "-0.0124944px",
                     color: "rgba(45, 71, 94, 0.7)",
                  }}
                  placeholder="Video Name"
                  type="text"
                  required
               />
               <button className={styles.save}>Save</button>
               <p onClick={() => hidePopup()} className={styles.cancel}>
                  Cancel
               </p>
            </form>
         )}
         {isUploading && !isFinished && (
            <div className={`${styles.progress} ${styles.loading}`}>
               <div className={styles.progressBar}>
                  <span style={{ width: `${uploadProgress}%` }} />
               </div>
               <p className={styles.progressNumber}>Converting video</p>
               <img
                  className={styles.progressIcon}
                  src="/assets/campaign/uploading.svg"
               />
            </div>
         )}
         {/* {!isUploading && isFinished && (
        <div className={styles.finish}>
          <p>Your video has been uploaded</p>
          <Button onClick={hidePopup}>Ok</Button>
        </div>
      )} */}
      </Popup>
   );
};

export default PopupUploadVideo;
