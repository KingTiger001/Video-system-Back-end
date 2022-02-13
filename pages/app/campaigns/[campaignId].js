import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ContentEditable from "react-contenteditable";
import {toast} from "react-toastify";
//import { CookiesProvider, Cookies } from 'react-cookie';
import withAuthServerSideProps from "@/hocs/withAuthServerSideProps";

import {initializeStore} from "@/store";

import {mainAPI, mediaAPI} from "@/plugins/axios";

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
import {resetServerContext} from "react-beautiful-dnd";
import PopupCreateCampaign from "@/components/Popups/PopupCreateCampaign";

const Campaign = ({me}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const popup = useSelector((state) => state.popup);
    const hidePopup = () => dispatch({type: "HIDE_POPUP"});
    const showPopup = (popupProps) =>
        dispatch({type: "SHOW_POPUP", ...popupProps});

    const campaign = useSelector((state) => state.campaign);
    const duration = useSelector((state) => state.campaign.duration);
    const endScreen = useSelector((state) => state.campaign.endScreen);
    const helloScreen = useSelector((state) => state.campaign.helloScreen);
    const logo = useSelector((state) => state.campaign.logo);
    const name = useSelector((state) => state.campaign.name);

    const contents = useSelector((state) => state.campaign.contents);
    const finalVideo = useSelector((state) => state.campaign.finalVideo);

    const [displayMenu, showMenu] = useState(false);
    const [displayPreview, showPreview] = useState(false);
    const [displayShare, showShare] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
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

        setTimeout(() => dispatch({type: "SET_PROGRESSION", data: 1}), 1);
        setTimeout(() => dispatch({type: "SET_PROGRESSION", data: 0}), 2);
    }, []);

    // Save campaign
    useEffect(() => {
        const saveCampaign = async () => {
            const res = await mainAPI
                .patch(`/campaigns/${router.query.campaignId}`, {
                    duration,
                    endScreen,
                    helloScreen,
                    logo,
                    name,
                    contents: contents.length > 0 ? contents : [],
                    finalVideo,
                })
                .catch((err) => console.log("err", err));
        };
        saveCampaign();

        dispatch({
            type: "HAS_CHANGES",
            data: false,
        });
    }, [duration, endScreen, helloScreen, logo, name, contents, finalVideo]);

    const checkBeforeStartShare = () => {
        if (Object.keys(contents).length <= 0) {
            return toast.error(
                "You need to add a video before sharing your campaign."
            );
        }
        setShareLoading(true);
        onMerge()
            .then(() => {
                setTimeout(() => {
                    showShare(true);
                    setShareLoading(false);
                }, 1000);
            })
            .catch((err) => {
                toast.error("The compression failed");
                setShareLoading(false);
            });
    };

    const getVideos = async () => {
        const {data} = await mainAPI("/users/me/videos");
        dispatch({
            type: "SET_VIDEO_LIST",
            data,
        });
    };

    const onMerge = async () => {

        try {
            const {data} = await mediaAPI.post("/renderVideo", {
                campaignId: campaign._id,
                contents: contents,
            });
            dispatch({
                type: "SET_FINALVIDEO",
                data: {url: data.url},
            });
            // Set current video redendered in cookies
            //cookies.set('rendred-video', data, { path: '/' });
            return data.url;
        } catch (err) {
            const code = err.response && err.response.data;
            if (code) {
                throw new Error(code);
            } else {
                throw new Error(err);
            }
        }


    };

    const handlePreviewMode = () => {
        setPreviewLoading(true);
        onMerge()
            .then(() => {
                setTimeout(() => {
                    showPreview(true);
                    setPreviewLoading(false);
                }, 1000);
            })
            .catch((err) => {
                toast.error("The compression failed");
                setPreviewLoading(false);
            });
    };

    return (
        <div className={styles.dashboardCampaign} ref={ref}>
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
                        <img src="/assets/common/menu.svg"/>
                        <p>Menu</p>
                    </div>
                    {displayMenu && (
                        <div className={styles.headerMenuDropdown} ref={headerMenuRef}>
                            <div
                                className={styles.headerMenuClose}
                                onClick={() => showMenu(false)}
                            >
                                <img src="/assets/common/close.svg"/>
                                <p>Close menu</p>
                            </div>
                            {/*<img className={styles.headerMenuLogo} src="/logo-simple.svg"/>*/}
                            <ul>
                                <li>
                                    <Link href="/app">
                                        <a>Dashboard</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/app/campaigns">
                                        <a>My videos</a>
                                    </Link>
                                </li>
                                {/*<li>*/}
                                {/*    <Link href="/app/analytics">*/}
                                {/*        <a>Analytics</a>*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                {/*    <Link href="/app/contacts">*/}
                                {/*        <a>Contacts</a>*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
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
                                dispatch({type: "SET_NAME", data: e.target.value})
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") e.preventDefault();
                            }}
                            placeholder="Name your video here"
                            html={name}
                            className={styles.headerVideoInput}
                        />
                        <img src="/assets/campaign/pen.svg"/>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    {/*<Button*/}
                    {/*    color="white"*/}
                    {/*    // onClick={() => showPreview(true)}*/}
                    {/*    onClick={handlePreviewMode}*/}
                    {/*    textColor="dark"*/}
                    {/*    style={{*/}
                    {/*        boxShadow: "0px 7px 14px -8px rgba(0,0,0,0.5)",*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    {previewLoading ? "Processing..." : "Preview mode"}*/}
                    {/*</Button>*/}
                    <Button
                        style={{
                            boxShadow: "0px 7px 14px -8px rgba(0,0,0,0.5)",
                        }}
                        onClick={checkBeforeStartShare}
                    >
                        {shareLoading ? "Processing..." : "Share"}
                    </Button>
                </div>
            </div>

            <div className={styles.main}>
                <Tools me={me}/>

                <Player/>
            </div>

            <div className={styles.footer}>
                <Timeline/>
            </div>

            {displayPreview && (
                <Preview campaign={campaign} onClose={() => showPreview(false)}/>
            )}
            {popup.display === 'CREATE_CAMPAIGN' && <PopupCreateCampaign/>}
            {displayShare && (
                <Share
                    campaignId={router.query.campaignId}
                    me={me}
                    onClose={() => showShare(false)}
                    onCreateCampaignClicked={() => {
                        showPopup({display: 'CREATE_CAMPAIGN'})
                    }}
                    onDone={() => {
                        toast.success("Campaign sent.");
                        router.push("/app/campaigns");
                    }}
                    backText='Back to video edition'
                />
            )}
        </div>
    );
};

export default Campaign;
export const getServerSideProps = withAuthServerSideProps(
    async ({params}, user) => {
        const reduxStore = initializeStore();
        const {dispatch} = reduxStore;

        const {data: campaign} = await mainAPI.get(
            `/campaigns/${params.campaignId}`
        );
        const {data: videos} = await mainAPI.get("/users/me/videos");
        const {data: endScreenList} = await mainAPI.get("/users/me/endScreens");
        const {data: helloScreenList} = await mainAPI.get(
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
            dispatch({type: "CALC_DURATION"});
            dispatch({type: "CALC_VIDEOS_OFFSET", data: campaign.contents});
        } catch (err) {
            console.log(err);
        }
        resetServerContext();

        return {
            initialReduxState: reduxStore.getState(),
        };
    }
);
