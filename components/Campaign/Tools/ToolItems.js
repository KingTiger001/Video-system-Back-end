import { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { mainAPI } from "@/plugins/axios";

import Button from "@/components/Button";
import InputWithTools from "@/components/Campaign/InputWithTools";
import PopupDeleteHelloScreen from "@/components/Popups/PopupDeleteHelloScreen";
import PopupDeleteDraftHelloScreen from "@/components/Popups/PopupDeleteDraftHelloScreen";

import styles from "@/styles/components/Campaign/Tools.module.sass";
import ToolTemplate from "./Items/ToolTemplate";

const ToolItems = ({ me }) => {
  const dispatch = useDispatch();
  const popup = useSelector((state) => state.popup);
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const tool = useSelector((state) => state.campaign.tool);
  const toolItem = useSelector((state) => state.campaign.toolItem);
  const helloScreen = useSelector((state) => state.campaign.helloScreen);
  const helloScreenList = useSelector(
    (state) => state.campaign.helloScreenList
  );
  const preview = useSelector((state) => state.campaign.preview);
  const previewHelloScreen = useSelector(
    (state) => state.campaign.previewHelloScreen
  );

  const [displayFormHelloScreen, showFormHelloScreen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showOptions, setShowOptions] = useState({
    display: false,
    data: null,
  });

  useEffect(() => {
    return () => {
      dispatch({
        type: "SELECT_TOOL_ITEM",
        data: 0,
      });
    };
  }, []);

  const getHelloScreenList = async () => {
    const { data } = await mainAPI.get("/users/me/helloScreens");
    dispatch({
      type: "SET_HELLO_SCREEN_LIST",
      data,
    });
  };

  const selectToolItem = (clickedTool, element) => {
    dispatch({
      type: "SELECT_TOOL_ITEM",
      data: clickedTool,
    });
    // if (isPlaying) {
    //   dispatch({ type: "PAUSE" });
    //   videosRef[currentVideo]?.pause();
    // }
    if (clickedTool != 5) dispatch({ type: "SHOW_PREVIEW", data: { element } });
  };

  return (
    tool === 3 && (
      <div
        className={styles.toolItems}
        onClick={() => {
          if (!preview.show) {
            dispatch({ type: "SHOW_PREVIEW" });
          }
        }}
      >
        {popup.display === "DELETE_DRAFT_HELLO_SCREEN" && (
          <PopupDeleteDraftHelloScreen
            onConfirm={() => {
              dispatch({ type: "RESET_HELLO_SCREEN" });
              hidePopup();
            }}
          />
        )}
        {popup.display === "DELETE_HELLO_SCREEN" && (
          <PopupDeleteHelloScreen
            onDone={() => {
              getHelloScreenList();
              toast.success("Start screen deleted.");
              hidePopup();
            }}
          />
        )}

        {toolItem === 0 && (
          <div className={styles.toolSection}>
            <p className={styles.toolTitle}>Items</p>
            <div className={styles.toolItems}>
              <div
                className={styles.toolItem}
                onClick={() => selectToolItem(1, "endScreen")}
              >
                <p>Template</p>
                <img src="/assets/campaign/toolTemplate.svg" />
              </div>
            </div>
          </div>
        )}

        <ToolTemplate me={me} />
      </div>
    )
  );
};
const PopupOptions = ({ setAction, children }) => {
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setAction({ display: false });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className={styles.popupOptions}>
      {children}
    </div>
  );
};

export default ToolItems;
