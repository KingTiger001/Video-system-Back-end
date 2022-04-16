import { handleProgression } from "@/hooks";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const useSelectScreen = () => {
   const dispatch = useDispatch();
   const contents = useSelector((state) => state.campaign.contents);
   const videosOffset = useSelector((state) => state.campaign.videosOffset);
   const currentVideo = useSelector((state) => state.campaign.currentVideo);
   const selectedContent = useSelector(
      (state) => state.campaign.selectedContent
   );
   const preview = useSelector((state) => state.campaign.preview);
   const videosRef = useSelector((state) => state.campaign.videosRef);

   const selectScreenWithId = useCallback(
      (elem, updatedArray = contents.slice()) => {
         dispatch({
            type: "SET_SELECTED_CONTENT",
            data: elem,
         });
         dispatch({
            type: "SET_PREVIEW_VIDEO",
            data: elem,
         });
         const index = updatedArray.findIndex(
            (c) => c.type === "screen" && c._id === elem._id
         );

         if (index !== -1) {
            const position = updatedArray[index].position;
            const timePosition = videosOffset[position] || 0;
            dispatch({
               type: "SET_PROGRESSION",
               data: timePosition * 1000 + 10,
            });
            handleProgression(
               updatedArray,
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
      },
      [contents, videosOffset, currentVideo, preview, videosRef]
   );
   return { selectScreenWithId };
};
export default useSelectScreen;
