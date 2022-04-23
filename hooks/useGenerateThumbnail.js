import html2canvas from "html2canvas";
import { getThumbnails } from "video-metadata-thumbnails";

const useGenerateThumbnail = () => {
   const generateTemplateThumbnail = (idOfSelector) => {
      const selector = document.getElementById(idOfSelector);
      return new Promise((res, rej) => {
         html2canvas(selector, { useCORS: true })
            .then((canvas) => {
               canvas.toBlob((blob) => {
                  const thumbnail = new File([blob], "thumbnail.jpg", {
                     type: "image/jpg",
                  });
                  res({ thumbnail });
               });
            })
            .catch((err) => {
               rej(err);
            });
      });
   };

   const generateVideoThumbnail = async (file) => {
      return new Promise((res, rej) => {
         const blobURL = URL.createObjectURL(file);
         getThumbnails(blobURL)
            .then((thumbnails) => {
               const thumbnail = new File(
                  [thumbnails[1].blob],
                  "thumbnail.jpg",
                  {
                     type: "image/jpg",
                  }
               );
               res({
                  thumbnail,
               });
            })
            .catch((err) => {
               rej(err);
            });
      });
   };

   return { generateTemplateThumbnail, generateVideoThumbnail };
};
export default useGenerateThumbnail;
