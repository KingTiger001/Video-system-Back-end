import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { mainAPI } from "@/plugins/axios";

import Button from "@/components/Button";
import VideoPlayer from "@/components/VideoPlayer";

import styles from "@/styles/pages/campaign.module.sass";
import PopupCreateCampaign from "@/components/Popups/PopupCreateCampaign";
import { useSelector } from "react-redux";

const Campaign = ({ campaign }) => {
   const router = useRouter();

   const campaignId = router.query.campaignId;
   const contactId = router.query.c;
   const showthumbnail = router.query.thumbnail;

   const sessionId = useRef();
   const [viewDuration, setViewDuration] = useState(-1);
   const viewDurationRef = useRef();
   const [isPlaying, setIsPlaying] = useState(false);
   const [thumbnailPath, setThumbnailPath] = useState(false);

   let contact = campaign.share.contacts.find((c) => c._id === contactId);

   if (contact == null)
      campaign.share.lists.forEach((item) => {
         if (contact == null)
            contact = item.list.find((c) => c._id === contactId);
      });

   useEffect(() => {
      console.log("show thumbnail param");
      console.log(router.query.thumbnail);
      console.log(showthumbnail);
      console.log("end show");

      sessionId.current = Math.floor(Math.random() * Date.now());
      if (contactId) {
         mainAPI.post(`/analytics/${campaignId}/opened?c=${contactId}`);
      }
      let interval;
      interval = setInterval(() => {
         if (sessionId.current && viewDurationRef.current > 0 && contactId) {
            mainAPI.post(`/analytics/${campaignId}/viewDuration`, {
               sessionId: sessionId.current,
               duration: viewDurationRef.current,
            });
         }
      }, 1000);
      return () => {
         clearInterval(interval);
         if (sessionId.current && viewDurationRef.current > 0 && contactId) {
            mainAPI.post(`/analytics/${campaignId}/viewDuration`, {
               sessionId: sessionId.current,
               duration: viewDurationRef.current,
            });
         }
      };
   }, []);

   useEffect(() => {
      const videoDuration = Math.round(campaign.duration / 1000);
      if (viewDuration > videoDuration) {
         setViewDuration(videoDuration);
         viewDurationRef.current = videoDuration;
         return;
      }
      viewDurationRef.current = viewDuration;
   }, [campaign, viewDuration]);

   useEffect(() => {
      let interval = null;
      if (!isPlaying) {
         clearInterval(interval);
      } else if (isPlaying) {
         interval = setInterval(() => {
            setViewDuration((duration) => duration + 1);
         }, 1000);
      }

      console.log(campaign);
      return () => clearInterval(interval);
   }, [isPlaying]);

   // const getThumbnail = async () => {
   //   // if (showthumbnail) {
   //   //   const { data: campaignthumb } = await mainAPI.get(`/campaigns/${campaignId}/thumbnail`);
   //   //   setThumbnailPath(campaignthumb.share.thumbnail);
   //   //   console.log(campaignthumb);
   //   // }
   //   // else {
   //   //   console.log("Thumbnial is not displayed");
   //   // }
   // };

   // useEffect(() => {
   //   getThumbnail();
   // }, [])

   const reply = () => {
      if (contactId) {
         mainAPI.post(`/analytics/${campaignId}/replied?c=${contactId}`);
      }
      window.location = `mailto:${campaign.user.email}`;
   };

   return (
      <div className={styles.campaign}>
         <Head>
            <title>
               {campaign.user.firstName} from {campaign.user.company} sent you a
               video message | SEEMEE
            </title>
            {/*<meta name="msapplication-TileImage" content={campaign?.share?.thumbnail}/>*/}
            {/*<meta property="og:site_name" content="FOMO"/>*/}
            {/*<meta property="og:title" content={campaign?.name}/>*/}
            {/*<meta property="og:description" content="The best video studio for your campaigns"/>*/}
            {/*<meta property="og:image" itemprop="image" content={campaign?.share?.thumbnail}/>*/}
            {/*<meta property="og:type" content="website"/>*/}
            {/*<meta property="og:image:type" content="image/png"/>*/}
            {/*<meta property="og:image:width" content="300"/>*/}
            {/*<meta property="og:image:height" content="300"/>*/}
            {/*<meta property="og:url" content={`https://test.myfomo.io/campaigns/${campaign?._id}?thumbnail=1`}/>*/}
            {/*<meta property="fb:app_id" content="198021633865294"/>*/}
            {/*<meta property="fb:admins" content="42301029"/>*/}
            <meta name="medium" content="video" />
            <meta name="title" content={campaign?.name} />
            <meta name="description" content="" />
            <meta name="video_type" content="application/x-shockwave-flash" />
            {/*<meta property="fb:app_id" content="198021633865294"/>*/}
            {/*<meta property="fb:admins" content="42301029"/>*/}
            {/*<meta name="slack-app-id" content="A0166HRL7E3"/>*/}
            <meta
               property="og:url"
               content={`https://app.myfomo.io/campaigns/${campaign?._id}?thumbnail=1`}
            />
            <meta property="og:title" content={campaign?.name} />
            <meta property="og:description" content="" />
            <meta property="og:image" content={campaign?.share?.thumbnail} />
            <meta property="og:type" content="video.movie" />
            <meta property="og:video:type" content="text/html" />
            <meta property="og:video:width" content="300" />
            <meta property="og:video:height" content="264" />
            <meta property="og:video" content={campaign?.finalVideo.url} />
            <meta
               property="og:video:secure_url"
               content={campaign?.finalVideo.url}
            />
            <meta
               property="og:video:type"
               content="application/x-shockwave-flash"
            />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:width" content="300" />
            <meta property="og:video:height" content="264" />
            <meta property="og:video" content={campaign?.finalVideo.url} />
            <meta
               property="og:video:secure_url"
               content={campaign?.finalVideo.url}
            />
            <meta
               name="twitter:player:stream"
               content={campaign?.finalVideo.url}
            />
            <meta
               name="twitter:player:stream:content_type"
               content='video/mp4; codecs="avc1.42E01E1, mp4a.40.2"'
            />
            <meta name="twitter:card" content="player" />
            <meta
               name="twitter:url"
               content={`https://app.myfomo.io/campaigns/${campaign?._id}?thumbnail=1`}
            />
            <meta name="twitter:title" content={campaign?.name} />
            <meta name="twitter:description" content="" />
            <meta name="twitter:player:width" content="300" />
            <meta name="twitter:player:height" content="245" />
            <meta name="twitter:player" content={campaign?.finalVideo.url} />
            <meta name="twitter:image" content={campaign?.share?.thumbnail} />
         </Head>

         <div className={styles.header}>
            <Link href="https://app.myfomo.io/">
               <a className={styles.logo}>
                  <img src="/assets/common/dashboard-orange.png" />
               </a>
            </Link>
            {/* <Button href="/" outline={true} type="link">
                  Discover Fomo
               </Button> */}
         </div>
         <div className={styles.content}>
            <div className={styles.reply}>
               <div className={styles.titleContainer}>
                  <h1 className={styles.title}>
                     {campaign.user.firstName} from {campaign.user.company}
                  </h1>
               </div>
               <Button
                  style={{ fontSize: "17px", padding: "10px" }}
                  onClick={reply}
                  color="orange"
                  size="small"
               >
                  <img
                     src="/assets/common/reply.svg"
                     style={{ marginRight: 5 }}
                  />
                  Reply to {campaign.user.firstName}
               </Button>
            </div>
            {/* {campaign} */}
            {/* {campaign.share} */}
            {/* {campaign.share.thumbnail} */}
            <VideoPlayer
               contact={contact}
               data={campaign}
               onPlay={() => setIsPlaying(true)}
               onPause={() => setIsPlaying(false)}
               thumbnail={showthumbnail ? true : false}
            />
         </div>
      </div>
   );
};

export default Campaign;
export const getServerSideProps = async ({ params }) => {
   const { data: campaign } = await mainAPI.get(
      `/campaigns/${params.campaignId}`
   );
   return {
      props: {
         campaign,
      },
   };
};
