import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentEditable from "react-contenteditable";
import { toast } from "react-toastify";

import withAuthServerSideProps from "@/hocs/withAuthServerSideProps";

import { initializeStore } from "@/store";

import { mainAPI } from "@/plugins/axios";

import Button from "@/components/Button";
import PopupDeleteVideo from "@/components/Popups/PopupDeleteVideo";
import PopupUploadVideo from "@/components/Popups/PopupUploadVideo";
import Timeline from "@/components/Campaign/Timeline";
import Tools from "@/components/Campaign/Tools/index";
import Player from "@/components/Campaign/Player";
import Preview from "@/components/Campaign/Preview";
import Share from "@/components/Campaign/Share";

import styles from "@/styles/pages/app/[campaignId].module.sass";

// test
import { resetServerContext } from "react-beautiful-dnd";

const Campaign = ({ me }) => {
  const router = useRouter();

  const dispatch = useDispatch();
  const popup = useSelector((state) => state.popup);
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });

  const campaign = useSelector((state) => state.campaign);
  const duration = useSelector((state) => state.campaign.duration);
  const endScreen = useSelector((state) => state.campaign.endScreen);
  const helloScreen = useSelector((state) => state.campaign.helloScreen);
  const logo = useSelector((state) => state.campaign.logo);
  const name = useSelector((state) => state.campaign.name);
  const preview = useSelector((state) => state.campaign.preview);
  const timelineDraggable = useSelector(
    (state) => state.campaign.timelineDraggable
  );
  const video = useSelector((state) => state.campaign.contents);
  const videoRef = useSelector((state) => state.campaign.videoRef);
  const [inputNameWidth, setInputNameWidth] = useState(0);
  const [displayMenu, showMenu] = useState(false);
  const [displayPreview, showPreview] = useState(false);
  const [displayShare, showShare] = useState(false);

  const ref = useRef();
  const headerMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        showMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headerMenuRef]);

  // mounted
  useEffect(() => {
    if (me.logo && !logo.value) {
      dispatch({
        type: "CHANGE_LOGO",
        data: {
          value: me.logo,
        },
      });
    }
    setInputNameWidth((name.length + 1) * 16);
  }, []);

  // Save campaign
  useEffect(() => {
    const saveCampaign = async () => {
      await mainAPI.patch(`/campaigns/${router.query.campaignId}`, {
        duration,
        endScreen,
        helloScreen,
        logo,
        name,
        contents: video.length > 0 ? video : null,
      });
    };
    saveCampaign();
    dispatch({
      type: "HAS_CHANGES",
      data: false,
    });
  }, [duration, endScreen, helloScreen, logo, name, video]);

  const checkBeforeStartShare = () => {
    if (Object.keys(video).length <= 0) {
      return toast.error(
        "You need to add a video before sharing your campaign."
      );
    }
    showShare(true);
  };

  const getVideos = async () => {
    const { data } = await mainAPI("/users/me/videos");
    dispatch({
      type: "SET_VIDEO_LIST",
      data,
    });
  };

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const progression = (position / ref.current.offsetWidth) * duration;
    dispatch({ type: "SET_PROGRESSION", data: progression });
    if (Object.keys(videoRef).length > 0) {
      const currentTime = (progression - helloScreen.duration) / 1000;
      videoRef.currentTime = currentTime > 0 ? currentTime : 0;
    }
    if (preview.show) {
      dispatch({ type: "HIDE_PREVIEW" });
    }
  };

  return (
    <div
      className={styles.dashboardCampaign}
      // onMouseUp={() => dispatch({ type: "TIMELINE_DRAGGABLE", data: false })}
      // onMouseMove={(e) => timelineDraggable && seekTo(e)}
      ref={ref}
    >
      <Head>
        <title>Edit my video campaign | FOMO</title>
      </Head>

      {popup.display === "UPLOAD_VIDEO" && (
        <PopupUploadVideo
          onDone={() => {
            getVideos();
            dispatch({
              type: "SELECT_TOOL",
              data: 2,
            });
            dispatch({
              type: "SHOW_PREVIEW",
              data: {
                element: "video",
              },
            });
          }}
        />
      )}
      {popup.display === "DELETE_VIDEO" && (
        <PopupDeleteVideo
          onDone={() => {
            getVideos();
            hidePopup();
          }}
        />
      )}

      <div className={styles.header}>
        <div className={styles.headerMenu}>
          <div
            className={styles.headerMenuButton}
            onClick={() => showMenu(true)}
          >
            <img src="/assets/common/menu.svg" />
            <p>Menu</p>
          </div>
          {displayMenu && (
            <div className={styles.headerMenuDropdown} ref={headerMenuRef}>
              <div
                className={styles.headerMenuClose}
                onClick={() => showMenu(false)}
              >
                <img src="/assets/common/close.svg" />
                <p>Close menu</p>
              </div>
              <img className={styles.headerMenuLogo} src="/logo-simple.svg" />
              <ul>
                <li>
                  <Link href="/app">
                    <a>Dashboard</a>
                  </Link>
                </li>
                <li>
                  <Link href="/app/campaigns">
                    <a>My videos campaigns</a>
                  </Link>
                </li>
                <li>
                  <Link href="/app/analytics">
                    <a>Analytics</a>
                  </Link>
                </li>
                <li>
                  <Link href="/app/contacts">
                    <a>Contacts</a>
                  </Link>
                </li>
              </ul>
              <ul>
                <li>
                  <a href="mailto:contact@myfomo.io">Need help ?</a>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className={styles.headerVideoTitle}>
          <div>
            <ContentEditable
              onChange={(e) =>
                dispatch({ type: "SET_NAME", data: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              placeholder="Name your video here"
              html={name}
              className={styles.headerVideoInput}
            />
            <img src="/assets/campaign/pen.svg" />
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button
            color="white"
            onClick={() => showPreview(true)}
            textColor="dark"
          >
            Preview mode
          </Button>
          <Button onClick={checkBeforeStartShare}>Share</Button>
        </div>
      </div>

      <div className={styles.main}>
        <Tools me={me} />

        {/* <Player /> */}
      </div>

      <div className={styles.footer}>
        <Timeline />
      </div>

      {displayPreview && (
        <Preview campaign={campaign} onClose={() => showPreview(false)} />
      )}
      {displayShare && (
        <Share
          campaignId={router.query.campaignId}
          me={me}
          onClose={() => showShare(false)}
          onDone={() => {
            toast.success("Campaign sent.");
            router.push("/app/campaigns");
          }}
        />
      )}
    </div>
  );
};

export default Campaign;
export const getServerSideProps = withAuthServerSideProps(
  async ({ params }, user) => {
    const reduxStore = initializeStore();
    const { dispatch } = reduxStore;

    const { data: campaign } = await mainAPI.get(
      `/campaigns/${params.campaignId}`
    );
    const { data: videos } = await mainAPI.get("/users/me/videos");
    const { data: endScreenList } = await mainAPI.get("/users/me/endScreens");
    const { data: helloScreenList } = await mainAPI.get(
      "/users/me/helloScreens"
    );
    try {
      dispatch({
        type: "SET_VIDEO_LIST",
        data: videos,
      });
      dispatch({
        type: "SET_END_SCREEN_LIST",
        data: endScreenList,
      });
      dispatch({
        type: "SET_HELLO_SCREEN_LIST",
        data: helloScreenList,
      });
      dispatch({
        type: "SET_CAMPAIGN",
        data: campaign,
      });
      dispatch({ type: "CALC_DURATION" });
      dispatch({ type: "CALC_VIDEOS_OFFSET", data: campaign.contents });
    } catch (err) {
      console.log(err);
    }
    resetServerContext();

    return {
      initialReduxState: reduxStore.getState(),
    };
  }
);
