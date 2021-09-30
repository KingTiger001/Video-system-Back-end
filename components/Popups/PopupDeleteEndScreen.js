import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mainAPI } from "@/plugins/axios";

import Button from "../Button";
import Popup from "./Popup";

import styles from "@/styles/components/Popups/Popup.module.sass";

const PopupDeleteEndScreen = ({ onDone }) => {
  const dispatch = useDispatch();
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });

  const [loading, setLoading] = useState(false);

  const popup = useSelector((state) => state.popup);

  const deleteEndScreen = async (e) => {
    e.preventDefault();
    if (!loading) {
      try {
        setLoading(true);
        await mainAPI.delete(`/endScreens/${popup.data._id}`);
        onDone();
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
  };

  return (
    <Popup title="Delete a end screen">
      <p>Are you sure you want to delete this screen?</p>
      <div className={styles.actions}>
        <Button outline={true} onClick={hidePopup}>
          Cancel
        </Button>
        <Button onClick={deleteEndScreen} loading={loading}>
          Confirm
        </Button>
      </div>
    </Popup>
  );
};

export default PopupDeleteEndScreen;
