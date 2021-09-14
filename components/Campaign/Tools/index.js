import { useDispatch, useSelector } from "react-redux";

import styles from "@/styles/components/Campaign/Tools.module.sass";

import ToolEndScreen from "./ToolEndScreen";
import ToolHelloScreen from "./ToolHelloScreen";
import ToolLogo from "./ToolLogo";
import ToolRecord from "./ToolRecord";
import ToolVideos from "./ToolVideos";

const Tools = ({ me }) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.campaign.isPlaying);
  const tool = useSelector((state) => state.campaign.tool);
  const videosRef = useSelector((state) => state.campaign.videosRef);
  const currentVideo = useSelector((state) => state.campaign.currentVideo);

  const selectTool = (clickedTool, element) => {
    dispatch({
      type: "SELECT_TOOL",
      data: tool === clickedTool ? 0 : clickedTool,
    });
    if (isPlaying) {
      dispatch({ type: "PAUSE" });
      videosRef[currentVideo]?.pause();
    }
    if (clickedTool != 5) dispatch({ type: "SHOW_PREVIEW", data: { element } });
  };

  const closeToolbox = () => {
    dispatch({ type: "SELECT_TOOL", data: 0 });
    setTimeout(() => dispatch({ type: "HIDE_PREVIEW" }), 0);
  };

  return (
    <div className={styles.tools}>
      <ul className={styles.toolList}>
        <li
          className={`${styles.tool} ${tool === 1 ? styles.toolSelected : ""}`}
          onClick={() => selectTool(1, "record")}
        >
          <img src="/assets/campaign/record.svg" />
          <p>Record</p>
        </li>
        <li
          className={`${styles.tool} ${tool === 2 ? styles.toolSelected : ""}`}
          onClick={() => {
            dispatch({ type: "SET_PREVIEW_VIDEO", data: {} });
            selectTool(2, "video");
          }}
        >
          <img
            src={`/assets/campaign/${
              tool === 2 ? "toolVideosSelected" : "toolVideos"
            }.svg`}
          />
          <p>Video</p>
        </li>
        <li
          className={`${styles.tool} ${tool === 3 ? styles.toolSelected : ""}`}
          onClick={() => selectTool(3, "helloScreen")}
        >
          <img
            src={`/assets/campaign/${
              tool === 3 ? "toolHelloScreenSelected" : "toolHelloScreen"
            }.svg`}
          />
          <p>Start Screen</p>
        </li>
        <li
          className={`${styles.tool} ${tool === 4 ? styles.toolSelected : ""}`}
          onClick={() => selectTool(4, "endScreen")}
        >
          <img
            src={`/assets/campaign/${
              tool === 4 ? "toolEndScreenSelected" : "toolEndScreen"
            }.svg`}
          />
          <p>End Screen</p>
        </li>
        <li
          className={`${styles.tool} ${tool === 5 ? styles.toolSelected : ""}`}
          onClick={() => selectTool(5, "logo")}
        >
          <img
            src={`/assets/campaign/${
              tool === 5 ? "toolLogoSelected" : "toolLogo"
            }.svg`}
          />
          <p>Add logo</p>
        </li>
      </ul>
      {tool !== 0 && (
        <div className={styles.toolBox}>
          <img
            className={styles.close}
            onClick={closeToolbox}
            src="/assets/common/close.svg"
          />
          <ToolRecord />
          <ToolVideos />
          <ToolHelloScreen me={me} />
          <ToolEndScreen me={me} />
          <ToolLogo />
        </div>
      )}
    </div>
  );
};

export default Tools;
