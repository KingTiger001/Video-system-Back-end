import { useEffect, useRef } from "react";

const VideoScreenshot = ({ onTakeScreenShot, video, height, width }) => {
   const videoRef = useRef();
   const canvasRef = useRef();

   useEffect(() => {
      setTimeout(() => {
         if (canvasRef && videoRef) {
            canvasRef.current
               .getContext("2d")
               .drawImage(videoRef.current, 0, 0, width, height);
            if (onTakeScreenShot)
               onTakeScreenShot(canvasRef.current.toDataURL());
         }
      }, 3000);
   }, [video]);
   return (
      <div>
         <video ref={videoRef} src={video}></video>
         <canvas ref={canvasRef}></canvas>
      </div>
   );
};

export default VideoScreenshot;
