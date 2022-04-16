import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mainAPI, mediaAPI } from "@/plugins/axios";

import Button from "../Button";
import Popup from "./Popup";

import styles from "@/styles/components/Popups/Popup.module.sass";

const PopupDeleteVideo = ({ onDone }) => {
   const dispatch = useDispatch();
   const hidePopup = () => dispatch({ type: "HIDE_POPUP" });

   const [loading, setLoading] = useState(false);

   const popup = useSelector((state) => state.popup);
   const contents = useSelector((state) => state.campaign.contents);
   const templateList = useSelector((state) => state.campaign.templateList);

   const deleteVideo = async (e) => {
      e.preventDefault();
      if (!loading) {
         try {
            setLoading(true);
            if (popup.data.url) {
               await mediaAPI.delete("/", {
                  data: {
                     url: popup.data.url,
                  },
               });
            }
            await mainAPI.delete(`/videos/${popup.data._id}`);
            onDone();
         } catch (err) {
            setLoading(false);
            console.log(err);
         }
      }
   };

   const deleteScreen = async () => {
      try {
         await mainAPI.delete(`/templates/${popup.data._id}`);
         const data = templateList.filter(
            (temp) => temp._id !== popup.data._id
         );
         const contentsData = contents.filter(
            (temp) => temp._id !== popup.data._id
         );
         dispatch({
            type: "SET_TEMPLATE_LIST",
            data,
         });
         dispatch({ type: "SET_VIDEO", data: contentsData });
         onDone();
      } catch (err) {
         setLoading(false);
         console.log(err);
      }
   };

   const label = popup.data.type === "screen" ? "screen" : "video";
   return (
      <Popup title={`Delete a ${label}`}>
         <div className={styles.body}>
            <p>Are you sure you want to delete this {label}?</p>
         </div>
         <div className={styles.actions}>
            <Button
               onClick={popup.target === "screen" ? deleteScreen : deleteVideo}
               loading={loading}
            >
               Delete
            </Button>
            <Button outline={true} onClick={hidePopup}>
               Cancel
            </Button>
         </div>
      </Popup>
   );
};

export default PopupDeleteVideo;
