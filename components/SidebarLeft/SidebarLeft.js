import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import styles from "../../styles/components/SidebarLeft/SidebarLeft.module.sass";
import { toast } from "react-toastify";

import Share from "@/components/Campaign/Share";
import useCampaign from "hooks/campaign";

const SidebarLeft = () => {
   const router = useRouter();
   const dispatch = useDispatch();
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });
   const { create: createCampaign, isLoading } = useCampaign();
   const [displayShare, showShare] = useState(false);

   const handleCreateNewVideo = () => {
      createCampaign("", (campaign) => {
         router.push(`/app/campaigns/${campaign._id}`);
      });
   };

   return (
      <aside className={`menu ${styles.menu}`}>
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
         <div className={`${styles.top_group}`}>
            <Link href="/app">
               <a
                  className={
                     `menu-item ${styles.menu_item} ` +
                     (router.route === "/app" ? styles.active : "")
                  }
               >
                  <span className={`${styles.orange_border}`}></span>
                  <span className={`${styles.tooltip}`}>Dashboard</span>
                  <img
                     src={`/assets/common/${
                        router.route === "/app"
                           ? "dashboard-orange"
                           : "dashboard"
                     }.png`}
                  />
               </a>
            </Link>
            <button
               className={`menu-item ${styles.menu_item} ${styles.new_video}`}
               onClick={handleCreateNewVideo}
               disabled={isLoading}
            >
               <span className={`${styles.orange_border}`}></span>
               <span className={`${styles.tooltip}`}>New</span>
               <img src="/assets/common/videos-grey.svg" />
            </button>
            <Link href="/app/campaigns">
               <a
                  className={
                     `menu-item ${styles.menu_item} ` +
                     (router.route === "/app/campaigns" ? styles.active : "")
                  }
               >
                  <span className={`${styles.orange_border}`}></span>
                  <span className={`${styles.tooltip}`}>Library</span>
                  <img
                     src={`/assets/common/${
                        router.route === "/app/campaigns"
                           ? "menu_lib_orange"
                           : "menu_lib"
                     }.svg`}
                  />
               </a>
            </Link>
            {/* <Link href={'javascript:void(0);'} style={{ pointerEvents: 'none' }}>
                <a className={`menu-item ${styles.menu_item}`}>
                    <span className={`${styles.orange_border}`}></span>
                    <span className={`${styles.tooltip}`}>Share</span>
                    <img src="/assets/common/menu_share.svg" />
                </a>
            </Link> */}
            <button
               className={`menu-item ${styles.menu_item}`}
               onClick={() => showShare(true)}
            >
               <span className={`${styles.orange_border}`}></span>
               <span className={`${styles.tooltip}`}>Share</span>
               <img src="/assets/common/menu_share.svg" />
            </button>
         </div>
         <div className={`${styles.bottom_group}`}>
            <Link href={"/app/upgrade"}>
               <a
                  className={
                     `menu-item ${styles.menu_item} ${styles.menu_item_orange} ${styles.no_tooltip} ` +
                     (router.route === "/app/upgrade" ? styles.active : "")
                  }
               >
                  <span className={`${styles.orange_border}`}></span>
                  <p>Upgrade</p>
               </a>
            </Link>
            <Link href={"mailto:contact@myfomo.io"}>
               <a className={`menu-item ${styles.menu_item}`}>
                  <span className={`${styles.orange_border}`}></span>
                  <span className={`${styles.tooltip}`}>Help</span>
                  <img src="/assets/common/menu_help.svg" />
               </a>
            </Link>
         </div>
      </aside>
   );
};

export default SidebarLeft;
