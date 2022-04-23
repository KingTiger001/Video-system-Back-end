import { mediaAPI } from "@/plugins/axios";

export const calcPositionPersent = (
   offsetX,
   offsetY,
   x,
   y,
   element,
   container
) => {
   if (!element || !container) return;
   const widthOfContainer = container.offsetWidth;
   const heightOfContainer = container.offsetHeight;
   console.log("Width Player", widthOfContainer);
   console.log("Height Player", heightOfContainer);
   const width = element.offsetWidth;
   const height = element.offsetHeight;
   const widthWithPresent = (width / widthOfContainer) * 100;
   const heightWithPresent = (height / heightOfContainer) * 100;
   const isBiggerThanX = offsetX + widthWithPresent / 2;
   const isSmallerThanX = 100 - offsetX - widthWithPresent / 2;
   const isBiggerThanY = offsetY + heightWithPresent / 2;
   const isSmallerThanY = 100 - offsetY - heightWithPresent / 2;

   return {
      left: `${
         isBiggerThanX > x
            ? isBiggerThanX
            : isSmallerThanX < x
            ? isSmallerThanX
            : x
      }%`,
      top: `${
         isBiggerThanY > y
            ? isBiggerThanY
            : isSmallerThanY < y
            ? isSmallerThanY
            : y
      }%`,
   };
};

export const uploadThumbnailFile = async (file) => {
   return new Promise((res, rej) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "thumbnails");
      formData.append("width", 800);
      mediaAPI
         .post("/images", formData)
         .then(({ data: url }) => {
            res({ url });
         })
         .catch((err) => {
            rej(err);
         });
   });
};
