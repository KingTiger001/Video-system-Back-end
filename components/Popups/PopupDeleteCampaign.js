import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mainAPI } from "@/plugins/axios";

import Button from "../Button";
import Popup from "./Popup";

import styles from "@/styles/components/Popups/Popup.module.sass";
import useCampaign from "hooks/campaign";

const PopupDeleteCampaign = ({ onDone }) => {
   const dispatch = useDispatch();
   const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
   const [loading, setLoading] = useState(false);
   const popup = useSelector((state) => state.popup);
   const { remove } = useCampaign();

   const deleteCampaign = async (e) => {
      e.preventDefault();
      if (!loading) {
         setLoading(true);
         remove(
            popup.data._id,
            () => {
               onDone();
            },
            (err) => {
               setLoading(false);
               console.log(err);
            }
         );
      }
   };

   return (
      <Popup title="Delete a campaign">
         <div className={styles.body}>
            <p>Are you sure you want to delete this campaign?</p>
         </div>
         <div className={styles.actions}>
            <Button onClick={deleteCampaign} loading={loading}>
               Confirm
            </Button>
            <Button outline={true} onClick={hidePopup}>
               Cancel
            </Button>
         </div>
      </Popup>
   );
};

export default PopupDeleteCampaign;
