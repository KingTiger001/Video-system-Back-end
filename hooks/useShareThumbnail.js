import { mainAPI, mediaAPI } from "@/plugins/axios";
import { useCallback } from "react";

const useShareThumbnail = () => {
   const deleteThumbnail = useCallback(async (campaign, id, url, callback) => {
      await mediaAPI.delete("/", {
         data: {
            url,
         },
      });
      const { data: campaignUpdated } = await mainAPI.patch(
         `/campaigns/${id}`,
         {
            share: {
               ...campaign.share,
               thumbnail: null,
            },
         }
      );
      if (campaignUpdated && callback) callback(campaignUpdated);
   }, []);
   return { deleteThumbnail };
};

export default useShareThumbnail;
