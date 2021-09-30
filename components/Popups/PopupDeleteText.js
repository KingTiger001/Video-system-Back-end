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
    <Popup title="Delete a video">
      <p>Are you sure you want to delete this text?</p>
      <div className={styles.actions}>
        <Button outline={true} onClick={hidePopup}>
          Cancel
        </Button>
        <Button onClick={onDelete}>Confirm</Button>
      </div>
    </Popup>
  );
};

export default PopupDeleteLink;
