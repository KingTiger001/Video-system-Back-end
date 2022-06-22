import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import withAuthServerSideProps from "@/hocs/withAuthServerSideProps";

import { mainAPI, mediaAPI } from "@/plugins/axios";
import dayjs from "@/plugins/dayjs";

import AppLayout from "@/layouts/AppLayout";

import Button from "@/components/Button";
import ListHeader from "@/components/ListHeader";
import ListItem from "@/components/ListItem";
import Preview from "@/components/Campaign/Preview";
import Stat from "@/components/Stat";
import PercentStat from "@/components/PercentStat";
import Share from "@/components/Campaign/Share";

import styles from "@/styles/pages/app/dashboard.module.sass";
import stylesCampains from "@/styles/pages/app/campaigns.module.sass";

import PopupDeleteCampaign from "@/components/Popups/PopupDeleteCampaign";
import CampaignListItem from "@/components/global/ListItem";

const Dashboard = ({
  campaignsDraft = [],
  campaignsShared = [],
  contactsCount = 0,
  campaignsCount = 0,
  me,
  stats = {},
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const [previewLoading, setPreviewLoading] = useState(null);
  const [campaignPreviewed, setCampaignPreviewed] = useState(null);

  const [displayShare, showShare] = useState(false);

  const [campaignShared, setCampaignShared] = useState(null);
  const [shareLoading, setShareLoading] = useState(null);

  const [campaignsDraftList, setCampaignsDraft] = useState(campaignsDraft);
  const [campaignsSharedList, setCampaignsShared] = useState(campaignsShared);

  const popup = useSelector((state) => state.popup);
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });

  const displayDuration = (value) => {
    if (!value) {
      return "0:00";
    }
    const t = dayjs.duration(parseInt(Math.round(value), 10));
    const m = t.minutes();
    const s = t.seconds();
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  const getCampaigns = async () => {
    const CAMPAIGNS_LIMIT = 5;
    const { data: campaignsDraftUpdated } = await mainAPI.get(
      `/users/me/campaigns?status=draft&limit=${CAMPAIGNS_LIMIT}`
    );
    const { data: campaignsSharedUpdated } = await mainAPI.get(
      `/users/me/campaigns?status=shared&limit=${CAMPAIGNS_LIMIT}`
    );

    setCampaignsDraft(campaignsDraftUpdated);
    setCampaignsShared(campaignsSharedUpdated);
  };

  const sendEmailConfirmation = async () => {
    if (
      !me.emailConfirmationExpires ||
      dayjs(me.emailConfirmationExpires).diff(dayjs(), "minute") > 5
    ) {
      await mainAPI.post("/auth/email/confirmation/new", { userId: me._id });
    }
    toast.success("Email sent.");
  };

  const checkBeforeStartShare = async (campaign) => {
    if (!campaign && !campaign.contents)
      return toast.error(
        "You need to add a video before sharing your campaign."
      );

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

  const renderCampaignsHeader = ({ draft = false }) => (
    <ListHeader
      className={`${stylesCampains.campaignsHeader} ${
        draft ? stylesCampains.draft : ""
      }`}
    >
      <p className={stylesCampains.firstHeader}>Video name</p>
      <p>Creation date</p>
      <p>Duration</p>
    </ListHeader>
  );

  const renderCampaignsItem = (campaign = {}) => {
    return (
      <CampaignListItem
        campaign={campaign}
        renderActions={
          <>
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
                {previewLoading === campaign._id ? "Processing..." : "Preview"}
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
          </>
        }
        renderDropdownActions={
          <ul>
            <li
              onClick={() =>
                showPopup({
                  display: "DELETE_CAMPAIGN",
                  data: campaign,
                })
              }
            >
              <p>Delete</p>
            </li>
          </ul>
        }
      />
    );
  };

  // <ListItem
  //          className={`${stylesCampains.campaignsItem} ${
  //             campaign.status === "draft" ? stylesCampains.draft : ""
  //          }`}
  //          empty={Object.keys(campaign).length > 0 ? false : true}
  //          key={campaign._id}
  //          renderActions={() => (

  //          )}
  //          renderDropdownActions={() => (
  //             <ul>
  //                <li
  //                   onClick={() =>
  //                      showPopup({
  //                         display: "DELETE_CAMPAIGN",
  //                         data: campaign,
  //                      })
  //                   }
  //                >
  //                   <p>Delete</p>
  //                </li>
  //             </ul>
  //          )}
  //          renderEmpty={() => <p>No videos found.</p>}
  //       >
  //          <p className={stylesCampains.campaignName}>
  //             {campaign.name.length ? campaign.name : "No name"}
  //          </p>
  //          <p>
  //             {dayjs(
  //                campaign.status === "draft"
  //                   ? campaign.createdAt
  //                   : campaign.sentAt
  //             ).format("MM/DD/YYYY")}
  //          </p>

  //          <p>{displayDuration(campaign.duration)}</p>
  //       </ListItem>

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

  const handlePreviewMode = async (campaign) => {
    if (previewLoading !== null) {
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

  return (
    <AppLayout>
      <Head>
        <title>Dashboard | FOMO</title>
      </Head>

      <div className={styles.container}>
        {/* <h1 className={styles.title}>Hello {me.firstName}</h1> */}
        {(!me.emailConfirmed || contactsCount <= 0) && (
          <div className={styles.welcome}>
            <p className={styles.welcomeTitle}>Welcome to your dasboard !</p>
            {/*<p className={styles.welcomeSubtitle}>*/}
            {/*  To send your first video campaign, you will have to:*/}
            {/*</p>*/}
            <ul className={styles.welcomeList}>
              {!me.emailConfirmed && (
                <li className={styles.welcomeListItem}>
                  <div>
                    <span />
                  </div>
                  <p className={styles.welcomeVerify}>
                    Verify your email address
                  </p>
                  <span>
                    We sent an email with a confirmation link to your email
                    address. In order to complete the sign-up process, please
                    click on the confirmation link. If you didn't receive it,{" "}
                    <a onClick={sendEmailConfirmation}>
                      click here to resend activation link
                    </a>
                  </span>
                </li>
              )}
              {/*{contactsCount <= 0 && (*/}
              {/*  <li className={styles.welcomeListItem}>*/}
              {/*    <div>*/}
              {/*      <span />*/}
              {/*    </div>*/}
              {/*    <Link href="/app/contacts">*/}
              {/*      <p className={styles.welcomeContact}>*/}
              {/*        Import your first contacts*/}
              {/*      </p>*/}
              {/*    </Link>*/}
              {/*    <span>You can import your contacts now or later.</span>*/}
              {/*  </li>*/}
              {/*)}*/}
            </ul>
          </div>
        )}

        {displayShare && (
          <Share
            campaignId={false}
            me={{}}
            onClose={() => showShare(false)}
            onCreateCampaignClicked={() => {
              showPopup({ display: "CREATE_CAMPAIGN" });
            }}
            onPreviewClicked={async (campaign) => {}}
            onDone={() => {
              toast.success("Campaign sent.");
              router.push("/app/campaigns");
            }}
            backText="Back"
          />
        )}

        <div className={styles.stats}>
          <p className={`${styles.campaignsTitle} ${styles.campaignsTitleDb}`}>
            Your analytics
          </p>
          {/*<Stat text="Contacts" value="0" value={contactsCount} />*/}
          <Stat text="Videos" value={campaignsCount} />
          <div className={styles.share}>
            <Button
              color="primary"
              onClick={() => showShare(true)}
              type="button"
              style={{ width: "120px", height: "38px" }}
            >
              Share
            </Button>
          </div>
          {/*<PercentStat*/}
          {/*  text="Video opening rate"*/}
          {/*  value={stats.videoOpeningRate}*/}
          {/*/>*/}
          {/* <Stat
            text="Average view duration"
            unit="%"
            value={stats.averageViewDuration ? stats.averageViewDuration * 1000 : 0}
          /> */}
        </div>
        <div className={styles.campaignsAndButtons}>
          <div className={styles.campaigns}>
            <p className={styles.campaignsTitle}>Library</p>
            <div className={styles.campaignsListContainer}>
              {renderCampaignsHeader({ draft: true })}
              <div className={stylesCampains.campaignsList}>
                {campaignsDraftList.length > 0 &&
                  campaignsDraftList.map((campaign) => {
                    console.log(campaign);
                    return renderCampaignsItem(campaign);
                  })}
              </div>
            </div>
            {/* <div className={styles.campaignsFooter}>
              <Link href="/app/campaigns">
                <a>All videos</a>
              </Link>
            </div> */}
          </div>
          {/* <div className={styles.createCampaign}>
            <Button
              color="white"
              onClick={() => showPopup({ display: "CREATE_CAMPAIGN" })}
            >
              Create a video
            </Button>
          </div> */}
          {/*<div className={styles.importContacts}>*/}
          {/*  <Button href="/app/contacts" outline={true} type="link">*/}
          {/*    Import contacts*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
        {/*<div className={styles.campaigns}>*/}
        {/*  <p className={styles.campaignsTitle}>Videos Sent </p>*/}
        {/*  {renderCampaignsHeader({ draft: false })}*/}
        {/*  <div>*/}
        {/*    {campaignsShared.length > 0 &&*/}
        {/*      campaignsShared.map((campaign) => renderCampaignsItem(campaign))}*/}
        {/*  </div>*/}
        {/*  <div className={styles.campaignsFooter}>*/}
        {/*    <Link href="/app/campaigns">*/}
        {/*      <a>All videos</a>*/}
        {/*    </Link>*/}
        {/*  </div>*/}
        {/*</div>*/}

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
        {popup.display === "DELETE_CAMPAIGN" && (
          <PopupDeleteCampaign
            onDone={() => {
              getCampaigns();
              hidePopup();
            }}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
export const getServerSideProps = withAuthServerSideProps(async () => {
  const CAMPAIGNS_LIMIT = 5;
  const { data: campaignsDraft } = await mainAPI.get(
    `/users/me/campaigns?status=draft&limit=${CAMPAIGNS_LIMIT}`
  );
  const { data: campaignsShared } = await mainAPI.get(
    `/users/me/campaigns?status=shared&limit=${CAMPAIGNS_LIMIT}`
  );
  const { data: contactsCount } = await mainAPI.get("/users/me/contacts/count");
  const { data: campaignsCount } = await mainAPI.get(
    "/users/me/campaigns/count"
  );
  const { data: stats } = await mainAPI.get("/users/me/analytics/stats");

  return {
    campaignsDraft,
    campaignsShared,
    contactsCount,
    campaignsCount,
    stats,
  };
});
