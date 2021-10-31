import { useDispatch, useSelector } from "react-redux";

import { getDataByType, handleProgression, useDebounce } from "@/hooks";

import { ObjectID } from "bson";

import { mainAPI } from "@/plugins/axios";
import dayjs from "@/plugins/dayjs";

import styles from "@/styles/components/Campaign/Tools.module.sass";
import { useState, useEffect } from "react";
import ToolItemText from "./Items/toolItemText";
import ToolItemLink from "./Items/toolItemLink";

const ToolVideos = () => {
  const dispatch = useDispatch();

  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const closeToolbox = () => {
    dispatch({ type: "SELECT_TOOL", data: 0 });
    setTimeout(() => {
      dispatch({ type: "HIDE_PREVIEW" });
      dispatch({
        type: "SET_CURRENT_OVERLAY",
        data: currentVideo,
      });
    }, 0);
  };

  const tool = useSelector((state) => state.campaign.tool);

  const currentVideo = useSelector((state) => state.campaign.currentVideo);
  const preview = useSelector((state) => state.campaign.preview);
  const previewVideo = useSelector((state) => state.campaign.previewVideo);
  const contents = useSelector((state) => state.campaign.contents);
  const videoList = useSelector((state) => state.campaign.videoList);
  const selectedContent = useSelector(
    (state) => state.campaign.selectedContent
  );
  const videosRef = useSelector((state) => state.campaign.videosRef);

  const videosOffset = useSelector((state) => state.campaign.videosOffset);

  const [selectedVideos, setSelectedVideos] = useState([]);
  const [unselectedVideos, setUnselectedVideos] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const selected = contents.filter((obj) => obj.type === "video");

    const unSelected = videoList.filter(
      (obj) =>
        !contents.some(
          (elem) => elem.type === "video" && elem.video._id === obj._id
        )
    );

    setSelectedVideos(selected);
    setUnselectedVideos(unSelected);
  }, [contents, videoList]);

  useEffect(() => {
    if (Object.keys(selectedContent).length === 0) {
      setShowEdit(false);
    }
  }, [selectedContent]);

  const selectVideo = (elem, array) => {
    if (!array) {
      array = contents.slice();
    }
    dispatch({
      type: "SET_SELECTED_CONTENT",
      data: elem,
    });
    const index = array.findIndex((content) => content._id === elem._id);
    if (index !== -1) {
      const position = array[index].position;
      let timePosition;
      if (videosOffset[position] !== undefined) {
        timePosition = videosOffset[position];
      } else if (videosOffset[position - 1] !== undefined) {
        timePosition =
          videosOffset[position - 1] +
          getDataByType(array[position - 1]).duration;
      } else {
        timePosition = 0;
      }

      dispatch({
        type: "SET_PROGRESSION",
        data: timePosition * 1000 + 10,
      });
      handleProgression(
        array,
        videosOffset,
        timePosition * 1000 + 10,
        dispatch,
        videosRef,
        currentVideo,
        preview
      );
      dispatch({ type: "HIDE_PREVIEW" });
      dispatch({
        type: "SET_CURRENT_OVERLAY",
        data: index,
      });
    } else {
      dispatch({
        type: "SET_CURRENT_OVERLAY",
        data: -1,
      });
      dispatch({ type: "SHOW_PREVIEW", data: { element: "video", data: {} } });
      // dispatch({ type: "SET_PREVIEW_VIDEO", data: elem.video });
    }
    dispatch({ type: "SET_PREVIEW_VIDEO", data: elem.video });
  };

  const displayDuration = (value) => {
    if (!value) {
      return "00:00";
    }
    const t = dayjs.duration(parseInt(value, 10));
    const m = t.minutes();
    const s = t.seconds();
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  };

  const updateProcessingVideos = async () => {
    const processingVideos = videoList.filter(
      (video) => video.status === "processing" || video.status === "waiting"
    );
    if (processingVideos.length > 0) {
      const newVideosPromise = await Promise.all(
        processingVideos.map((video) => mainAPI(`/videos/${video._id}`))
      );
      const newVideos = newVideosPromise.flat().map((video) => video.data);
      dispatch({
        type: "SET_VIDEO_LIST",
        data: videoList.map((video) => {
          const videoProcessingFound = newVideos.find(
            (newVideo) => newVideo._id === video._id
          );
          return videoProcessingFound || video;
        }),
      });
    }
  };

  useDebounce(updateProcessingVideos, 3000, [videoList]);

  const removeFromContents = (id) => {
    const array = contents.filter((obj) => {
      if (obj.type === "video") {
        return obj.video._id !== id;
      } else {
        return obj;
      }
    });
    array.map((elem, i) => {
      elem.position = i;
    });
    return array;
  };

  const addToContents = (data) => {
    const array = contents.slice();
    const _id = new ObjectID().toString();
    array.push({
      _id,
      position: array.length,
      type: "video",
      video: data,
      texts: [],
      links: [],
    });
    return array;
  };

  const renderVideoItem = (vd) => (
    <div
      key={vd.video._id}
      className={`${styles.toolLibraryItem} ${styles.videosItem} ${
        contents.some(
          (elem) => elem.type === "video" && elem.video._id === vd.video._id
        )
          ? styles.selected
          : ""
      }`}
    >
      <div
        className={`${styles.toolLibraryItemName} ${
          previewVideo.name === vd.video.name
            ? styles.toolLibraryItemPreview
            : ""
        }`}
        onClick={() => {
          const index = contents.findIndex((content) => content._id === vd._id);
          if (index !== -1) {
            const position = contents[index].position;
            const timePosition = videosOffset[position];

            dispatch({
              type: "SET_PROGRESSION",
              data: timePosition * 1000 + 10,
            });
            handleProgression(
              contents,
              videosOffset,
              timePosition * 1000 + 10,
              dispatch,
              videosRef,
              currentVideo,
              preview
            );
            dispatch({ type: "HIDE_PREVIEW" });
            dispatch({
              type: "SET_CURRENT_OVERLAY",
              data: index,
            });
          } else {
            dispatch({
              type: "SET_CURRENT_OVERLAY",
              data: -1,
            });
            dispatch({
              type: "SHOW_PREVIEW",
              data: { element: "video", data: {} },
            });
            // dispatch({ type: "SET_PREVIEW_VIDEO", data: vd.video });
          }
          dispatch({ type: "SET_PREVIEW_VIDEO", data: vd.video });
        }}
      >
        <p>{vd.video.name}</p>
        {vd.video.status === "done" ? (
          <p className={`${styles.videosItemStatus}`}>
            {displayDuration(vd.video.metadata.duration * 1000)}
          </p>
        ) : (
          <p
            className={`${styles.videosItemStatus} ${styles[vd.video.status]}`}
          >
            {vd.video.status}...{" "}
            {vd.video.status === "processing" && vd.video.statusProgress > 0
              ? `${vd.video.statusProgress || 0}%`
              : ""}
          </p>
        )}
      </div>
      <div className={styles.toolLibraryItemOptions}>
        {contents.some(
          (elem) => elem.type === "video" && elem.video._id === vd.video._id
        ) && (
          <div className={styles.toolLibraryItemOption}>
            <div
              onClick={() => {
                setShowEdit(true);
                selectVideo(vd);
              }}
            >
              <img src="/assets/campaign/libraryEdit.svg" />
              <p>Edit</p>
            </div>
          </div>
        )}

        <div className={styles.toolLibraryItemOption}>
          {!contents.some(
            (elem) => elem.type === "video" && elem.video._id === vd.video._id
          ) && (
            <div
              onClick={() => {
                const data = addToContents(vd.video);
                selectVideo(data[data.length - 1], data);
                dispatch({ type: "SET_VIDEO", data });

                dispatch({ type: "CALC_VIDEOS_OFFSET", data });
                dispatch({ type: "SET_VIDEOS_REF" });
                // dispatch({ type: "SET_PROGRESSION", data: 0 });
                // dispatch({
                //   type: "SET_CURRENT_VIDEO",
                //   data: 0,
                // });
              }}
            >
              <img src="/assets/campaign/librarySelect.svg" />
              <p>Select</p>
            </div>
          )}
          {contents.some(
            (elem) => elem.type === "video" && elem.video._id === vd.video._id
          ) && (
            <div
              onClick={() => {
                const data = removeFromContents(vd.video._id);
                dispatch({ type: "SET_VIDEO", data });

                dispatch({ type: "CALC_VIDEOS_OFFSET", data });
                dispatch({ type: "SET_VIDEOS_REF" });
                dispatch({ type: "SET_PROGRESSION", data: 0 });
                dispatch({
                  type: "SET_CURRENT_VIDEO",
                  data: 0,
                });
                dispatch({ type: "SET_CURRENT_OVERLAY", data: 0 });
              }}
            >
              <img src="/assets/campaign/libraryUnselect.svg" />
              <p>Remove</p>
            </div>
          )}
        </div>
        {!contents.some(
          (elem) => elem.type === "video" && elem.video._id === vd.video._id
        ) && (
          <div
            className={styles.toolLibraryItemOption}
            onClick={() =>
              showPopup({ display: "DELETE_VIDEO", data: vd.video })
            }
          >
            <div>
              <img src="/assets/campaign/libraryDelete.svg" />
              <p>Delete</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    tool === 2 && (
      <div
        className={styles.toolVideos}
        onClick={() => {
          if (!preview.show) {
            // dispatch({ type: "SHOW_PREVIEW" });
          }
        }}
      >
        {!showEdit ? (
          <>
            <span className={styles.toolTitleSection}>
              <div onClick={closeToolbox} className={styles.backArrow}>
                <img src="/assets/campaign/backArrow.svg" />{" "}
              </div>
              <p className={styles.toolTitle}>Videos</p>
            </span>

            <p style={{ marginTop: "14px" }} className={styles.toolSubtitle}>
              Timeline
            </p>
            <div className={styles.videosList}>
              {selectedVideos.map((vd) => renderVideoItem(vd))}
            </div>
            <p className={styles.toolSubtitle}>Library</p>
            <div className={styles.videosList}>
              {unselectedVideos.map((vd) => renderVideoItem({ video: vd }))}
            </div>
          </>
        ) : (
          <div className={styles.toolSection}>
            <span className={styles.toolTitleSection}>
              <div
                onClick={() => setShowEdit(false)}
                className={styles.backArrow}
              >
                <img src="/assets/campaign/backArrow.svg" />{" "}
              </div>
              <p className={styles.toolTitle}>Edit</p>
            </span>

            <div className={styles.toolItems}>
              <ToolItemText />
              <ToolItemLink />
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default ToolVideos;
