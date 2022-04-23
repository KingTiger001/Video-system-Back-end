import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mainAPI, mediaAPI } from "@/plugins/axios";

import Button from "../Button";
import Popup from "./Popup";

import styles from "@/styles/components/Popups/Popup.module.sass";

const PopupDeleteLink = ({ onDelete }) => {
   const dispatch = useDispatch();
   const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
   return (
      <Popup title="Delete call to action">
         <div className={styles.body}>
            <p>Are you sure you want to delete this call to action ?</p>
         </div>
         <div className={styles.actions}>
            <Button onClick={onDelete}>Delete</Button>
            <Button outline={true} onClick={hidePopup}>
               Cancel
            </Button>
         </div>
      </Popup>
   );
};

export default PopupDeleteLink;
