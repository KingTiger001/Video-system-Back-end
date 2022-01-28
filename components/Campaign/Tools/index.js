import { useDispatch, useSelector } from "react-redux";

import styles from "@/styles/components/Campaign/Tools.module.sass";

import ToolEndScreen from "./ToolEndScreen";
import ToolHelloScreen from "./ToolHelloScreen";
import ToolLogo from "./ToolLogo";
import ToolRecord from "./ToolRecord";
import ToolVideos from "./ToolVideos";
import ToolItems from "./ToolItems";
import ToolScreens from "./ToolScreens";

const Tools = ({ me }) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.campaign.isPlaying);
  const tool = useSelector((state) => state.campaign.tool);
  const videosRef = useSelector((state) => state.campaign.videosRef);
  const contents = useSelector((state) => state.campaign.contents);
  const currentVideo = useSelector((state) => state.campaign.currentVideo);

  const selectTool = (clickedTool, element) => {
    dispatch({
      type: "SET_SELECTED_CONTENT",
      data: {},
    });

    dispatch({
      type: "SELECT_TOOL",
      data: tool === clickedTool ? 0 : clickedTool,
    });
    if (isPlaying) {
      dispatch({ type: "PAUSE" });
      videosRef[getVideoIndex(currentVideo)]?.pause();
    }
    if (!element) {
      dispatch({ type: "HIDE_PREVIEW" });
    } else {
      // dispatch({ type: "SHOW_PREVIEW", data: { element } });
    }
  };

  const closeToolbox = () => {
    dispatch({ type: "SELECT_TOOL", data: 0 });
    setTimeout(() => dispatch({ type: "HIDE_PREVIEW" }), 0);
  };

  const getVideoIndex = (max) => {
    let count = -1;
    for (let i = 0; i <= max; i++) {
      if (contents[i].type === "video") count++;
    }
    return count;
  };

  return (
    <div className={styles.tools}>
      <ul className={styles.toolList}>
        <li
          className={`${styles.tool} ${tool === 1 ? styles.toolSelected : ""}`}
          onClick={() => selectTool(1, "record")}
        >
          <img src="/assets/video/video-camera-1.svg" width='28px' height='28px' />
          <p>Record/</p>
          <p>Import</p>
        </li>
        <li
          className={`${styles.tool} ${tool === 2 ? styles.toolSelected : ""}`}
          onClick={() => {
            dispatch({ type: "SET_PREVIEW_VIDEO", data: {} });
            selectTool(2, "video");
          }}
        >
          <img src={`/assets/campaign/toolVideosWhite.svg`} />
          <p>Video</p>
        </li>

        <li
          className={`${styles.tool} ${tool === 3 ? styles.toolSelected : ""}`}
          onClick={() => selectTool(3, "endScreen")}
        >
          <img src={`/assets/campaign/toolScreenWhite.svg`} />
          <p>Screen</p>
        </li>

        <li
          className={`${styles.tool} ${tool === 5 ? styles.toolSelected : ""}`}
          onClick={() => selectTool(5, "logo")}
        >
          <img src={`/assets/campaign/toolLogoWhite.svg`} />
          <p>Logo</p>
        </li>
      </ul>
      {tool !== 0 && (
        <div className={styles.toolBox}>
          {tool === 1 && (
            <img
              className={styles.close}
              onClick={closeToolbox}
              src="/assets/common/close.svg"
            />
          )}
          <ToolRecord />
          <ToolVideos />
          {/* <ToolItems me={me} /> */}
          <ToolScreens me={me} />
          <ToolLogo />
        </div>
      )}
    </div>
  );
};

export default Tools;
