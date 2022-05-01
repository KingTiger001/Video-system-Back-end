import { useDispatch } from "react-redux";

import Button from "../Button";
import Popup from "./Popup";

import styles from "@/styles/components/Popups/Popup.module.sass";

const PopupDeleteText = ({ onDelete }) => {
   const dispatch = useDispatch();
   const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
   return (
      <Popup title="Delete text">
         <div className={styles.body}>
            <p>Are you sure you want to delete this text?</p>
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

export default PopupDeleteText;
