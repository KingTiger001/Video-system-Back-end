import { useCallback, useState } from "react";
const { mainAPI } = require("@/plugins/axios");

const useVideoImage = () => {
   const getImage = useCallback(async (id) => {
      setIsLoading(true);
      try {
         const { data: video } = await mainAPI.get(`/videos/${id}`);
         setIsLoading(false);
         return video.url;
      } catch (err) {
         setIsLoading(false);
      }
   }, []);

   return { getImage };
};
export default useVideoImage;
