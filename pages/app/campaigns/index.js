import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import withAuth from "@/hocs/withAuth";
import withAuthServerSideProps from "@/hocs/withAuthServerSideProps";

import { mainAPI, mediaAPI } from "@/plugins/axios";
import dayjs from "@/plugins/dayjs";

import AppLayout from "@/layouts/AppLayout";

import ListHeader from "@/components/ListHeader";
import ListItem from "@/components/ListItem";
import PopupDeleteCampaign from "@/components/Popups/PopupDeleteCampaign";
import PopupDuplicateCampaign from "@/components/Popups/PopupDuplicateCampaign";
import Preview from "@/components/Campaign/Preview";
import Share from "@/components/Campaign/Share";

import layoutStyles from "@/styles/layouts/App.module.sass";
import styles from "@/styles/pages/app/campaigns.module.sass";
import Button from "@/components/Button";
import VideoImageThumbnail from "react-video-thumbnail-image";

const Campaigns = ({ initialCampaignsDraft, initialCampaignsShared, me }) => {
   const dispatch = useDispatch();
   const popup = useSelector((state) => state.popup);
   const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });

   const [campaignsDraft, setCampaignsDraft] = useState(initialCampaignsDraft);
   const [campaignsShared, setCampaignsShared] = useState(
      initialCampaignsShared
   );

   const [campaignPreviewed, setCampaignPreviewed] = useState(null);
   const [campaignShared, setCampaignShared] = useState(null);
   const [previewLoading, setPreviewLoading] = useState(null);
   const [shareLoading, setShareLoading] = useState(null);

   const getCampaigns = async () => {
      const { data: campaignsDraftUpdated } = await mainAPI.get(
         "/users/me/campaigns?status=draft"
      );
      const { data: campaignsSharedUpdated } = await mainAPI.get(
         "/users/me/campaigns?status=shared"
      );
      setCampaignsDraft(campaignsDraftUpdated);
      setCampaignsShared(campaignsSharedUpdated);
   };

   const displayDuration = (value) => {
      if (!value) {
         return "00:00";
      }
      const t = dayjs.duration(parseInt(Math.round(value), 10));
      const m = t.minutes();
      const s = t.seconds();
      return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
   };

   const handlePreviewMode = async (campaign) => {
      if (shareLoading !== null || previewLoading !== null) {
         toast.error("process is already running");
         return;
      }
      setPreviewLoading(campaign._id);
      const { data: data } = await mainAPI.get(`/campaigns/${campaign._id}`);

      onMerge(data)
         .then((res) => {
            data.finalVideo = res;
            setTimeout(() => {
               setCampaignPreviewed(data);
               setPreviewLoading(null);
            }, 1000);
         })
         .catch((err) => {
            toast.error("The compression failed");
            setPreviewLoading(false);
         });
   };

   const onMerge = async (campaign) => {
      try {
         let { data } = await mediaAPI.post("/renderVideo", {
            campaignId: campaign._id,
            contents: campaign.contents,
         });
         return data;
      } catch (err) {
         const code = err.response && err.response.data;
         if (code) {
            throw new Error(code);
         } else {
            throw new Error(err);
         }
      }
   };

   const checkBeforeStartShare = async (campaign) => {
      if (campaign.contents.length <= 0) {
         return toast.error(
            "You need to add a video before sharing your campaign."
         );
      }

      if (shareLoading !== null || previewLoading !== null) {
         toast.error("process is already running");
         return;
      }
      setShareLoading(campaign._id);
      const { data: data } = await mainAPI.get(`/campaigns/${campaign._id}`);

      onMerge(data)
         .then(() => {
            setTimeout(() => {
               setCampaignShared(data);
               setShareLoading(null);
            }, 1000);
         })
         .catch((err) => {
            toast.error("The compression failed");
            setShareLoading(false);
         });
   };

   const renderListHeader = ({ draft = false }) => (
      <ListHeader
         className={`${styles.campaignsHeader} ${draft ? styles.draft : ""}`}
      >
         <p>Video Image</p>
         <p className={styles.firstHeader}>Video name</p>
         <p>Creation date</p>
         <p>Duration</p>
         <p></p>
         <p></p>
      </ListHeader>
   );

   const renderCampaign = (campaign = {}) => (
      <ListItem
         className={`${styles.campaignsItem} ${
            campaign.status === "draft" ? styles.draft : ""
         }`}
         empty={Object.keys(campaign).length > 0 ? false : true}
         key={campaign._id}
         renderActions={() => (
            <div>
               {campaign.status === "draft" && (
                  <Button
                     color="orange"
                     type="link"
                     href={`/app/campaigns/${campaign._id}`}
                     outline={false}
                  >
                     Edit
                  </Button>
               )}
               {campaign.status === "draft" && (
                  <Button
                     style={{ background: "#4C4A60" }}
                     onClick={() => {
                        handlePreviewMode(campaign);
                     }}
                  >
                     {previewLoading === campaign._id
                        ? "Processing..."
                        : "Preview"}
                  </Button>
               )}
               {campaign.status === "draft" && (
                  <Button
                     color="primary"
                     onClick={() => checkBeforeStartShare(campaign)}
                  >
                     {shareLoading === campaign._id ? "Processing..." : "Share"}
                  </Button>
               )}
               {campaign.status === "shared" && (
                  <Link href={`/app/analytics?c=${campaign._id}`}>
                     <a>Analytics</a>
                  </Link>
               )}
               {campaign.status === "shared" && (
                  <button
                     onClick={() =>
                        showPopup({
                           display: "DUPLICATE_CAMPAIGN",
                           data: campaign,
                        })
                     }
                  >
                     Duplicate
                  </button>
               )}
               {campaign.status === "shared" && (
                  <a href={`/campaigns/${campaign._id}`} target="blank">
                     Preview
                  </a>
               )}
            </div>
         )}
         renderDropdownActions={() => (
            <ul>
               <li
                  onClick={() =>
                     showPopup({ display: "DELETE_CAMPAIGN", data: campaign })
                  }
               >
                  <p>Delete</p>
               </li>
            </ul>
         )}
         renderEmpty={() => <p>No videos found.</p>}
      >
         <p className={styles.videoImg}>
            <img src={campaign.share.thumbnail} />
         </p>
         <p className={styles.campaignName}>
            {campaign.name.length ? campaign.name : "No name"}
         </p>
         <p>
            {dayjs(
               campaign.status === "draft"
                  ? campaign.createdAt
                  : campaign.sentAt
            ).format("MM/DD/YYYY")}
         </p>

         <p>{displayDuration(campaign.duration)}</p>
      </ListItem>
   );

   return (
      <AppLayout>
         <Head>
            <title>Library | FOMO</title>
         </Head>

         {popup.display === "DELETE_CAMPAIGN" && (
            <PopupDeleteCampaign
               onDone={() => {
                  getCampaigns();
                  hidePopup();
               }}
            />
         )}
         {popup.display === "DUPLICATE_CAMPAIGN" && (
            <PopupDuplicateCampaign
               onDone={() => {
                  getCampaigns();
                  hidePopup();
               }}
            />
         )}
         {campaignPreviewed && (
            <Preview
               campaign={campaignPreviewed}
               onClose={() => setCampaignPreviewed(null)}
            />
         )}
         {campaignShared && (
            <Share
               campaignId={campaignShared._id}
               me={me}
               onClose={() => setCampaignShared(null)}
               onDone={() => {
                  toast.success("Campaign sent.");
                  getCampaigns();
                  setCampaignShared(null);
               }}
               onCreateCampaignClicked={() => {
                  showPopup({ display: "CREATE_CAMPAIGN" });
               }}
               onPreviewClicked={async (campaign) => {
                  handlePreviewMode(campaign);
               }}
            />
         )}

         <div className={`${layoutStyles.container} ${layoutStyles.lib}`}>
            {/* <div className={layoutStyles.header}>
                    <div className={layoutStyles.headerTop}>
                        <h1 className={layoutStyles.headerTitle}>My videos</h1>
                    </div>
                </div> */}

            {/*<p className={styles.videosDraftTitle}>Videos drafts</p>*/}

            <div className={styles.campaigns}>
               {renderListHeader({ draft: true })}
               <div className={styles.campaignsList}>
                  {campaignsDraft.length > 0 &&
                     campaignsDraft.map((campaign) => renderCampaign(campaign))}
                  {campaignsDraft.length <= 0 && renderCampaign()}
               </div>
            </div>

            {/*<p className={styles.videosSentTitle}>Videos sent</p>*/}

            {/*<div className={styles.campaigns}>*/}
            {/*  {renderListHeader({})}*/}
            {/*  <div className={styles.campaignsList}>*/}
            {/*    {campaignsShared.length > 0 &&*/}
            {/*      campaignsShared.map((campaign) => renderCampaign(campaign))}*/}
            {/*    {campaignsShared.length <= 0 && renderCampaign()}*/}
            {/*  </div>*/}
            {/*</div>*/}
         </div>
      </AppLayout>
   );
};

export default withAuth(Campaigns);
export const getServerSideProps = withAuthServerSideProps(async (ctx, user) => {
   const { data: initialCampaignsDraft } = await mainAPI.get(
      "/users/me/campaigns?status=draft"
   );
   const { data: initialCampaignsShared } = await mainAPI.get(
      "/users/me/campaigns?status=shared"
   );
   return {
      initialCampaignsDraft,
      initialCampaignsShared,
   };
});
