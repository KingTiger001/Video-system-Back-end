import { useRef, useState } from "react";
import Recorder from "react-video-recorder";

import { useVideoResize } from "hooks";

import Actions from "./Actions";

import styles from "@/styles/components/Campaign/VideoRecorder/index.module.sass";

const VideoRecorder = ({ onClose, onDone }) => {
   const ref = useRef();
   const [videoBlob, setVideoBlob] = useState(null);
   const { height } = useVideoResize({ ref, autoHeight: true });

   const onSave = () => {
      // onClose()
      onDone(new File([videoBlob], "record.webm"));
   };

   return (
      <div className={styles.videoRecorder}>
         <div className={styles.videoRecorderBackground} />
         <div
            ref={ref}
            className={styles.videoRecorderContent}
            style={{ height: "88%" }}
         >
            <Recorder
               constraints={{
                  audio: true,
                  video: {
                     width: 1280,
                     height: 720,
                  },
               }}
               isOnInitially={true}
               onRecordingComplete={(videoBlob) => setVideoBlob(videoBlob)}
               renderActions={(props) => Actions({ ...props, onClose, onSave })}
               timeLimit={90000}
            />
         </div>
      </div>
   );
};

export default VideoRecorder;
