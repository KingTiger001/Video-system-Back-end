import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import styles from "../../styles/components/SidebarLeft/SidebarLeft.module.sass";
import { toast } from "react-toastify";

import Share from "@/components/Campaign/Share";

const SidebarLeftCreate = ({ screen, renderScreen }) => {
   const router = useRouter();
   const dispatch = useDispatch();
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });

   const [displayShare, showShare] = useState(false);

   return (
      <aside className={`menu ${styles.menu} ${styles.create}`}>
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
               <a className={`${styles.menu_item} ${styles.withTitle} `}>
                  <span className={`${styles.orange_border}`}></span>
                  <span className={`${styles.tooltip}`}>Dashboard</span>
                  <img src="/assets/common/dashboard.png" />
               </a>
            </Link>
            <button
               className={
                  `${styles.menu_item} ${styles.withTitle} ` +
                  (screen === "CREATE" ? styles.active : "")
               }
               onClick={() => renderScreen("CREATE")}
            >
               <span className={`${styles.orange_border}`}></span>
               <span className={`${styles.tooltip}`}>Create</span>
               <img
                  src={
                     "/assets/common/create" +
                     (screen === "CREATE" ? "Orange" : "") +
                     ".svg"
                  }
               />
            </button>
            <p className={`${styles.menu_title}`}>Create</p>
            <button
               className={
                  `${styles.menu_item} ${styles.withTitle} ` +
                  (screen === "MEDIA" ? styles.active : "")
               }
               onClick={() => renderScreen("MEDIA")}
            >
               <span className={`${styles.orange_border}`}></span>
               <span className={`${styles.tooltip}`}>Media</span>
               <img
                  src={
                     "/assets/common/media" +
                     (screen === "MEDIA" ? "Orange" : "") +
                     ".svg"
                  }
               />
            </button>
            <p className={`${styles.menu_title}`}>Media</p>
            <button
               className={
                  `${styles.menu_item} ${styles.withTitle} ` +
                  (screen === "SCREEN" ? styles.active : "")
               }
               onClick={() => renderScreen("SCREEN")}
            >
               <span className={`${styles.orange_border}`}></span>
               <span className={`${styles.tooltip}`}>Elements</span>
               <img
                  src={
                     "/assets/common/elements" +
                     (screen === "SCREEN" ? "Orange" : "") +
                     ".svg"
                  }
               />
            </button>
            <p className={`${styles.menu_title}`}>Elements</p>
            {/* <button className={`${styles.menu_item} ${styles.withTitle} ` + (screen === 'LOGO' ? styles.active : '')}
                    onClick={() => renderScreen('LOGO')}
                >
                    <span className={`${styles.orange_border}`}></span>
                    <span className={`${styles.tooltip}`}>Media</span>
                    <img src="/assets/common/logo.svg" />
                </button>
                <p className={`${styles.menu_title}`}>Logo</p> */}
         </div>
         <div className={`${styles.bottom_group}`}>
            <Link href={"/app/upgrade"}>
               <a
                  className={
                     `${styles.menu_item} ${styles.menu_item_orange} ${styles.no_tooltip} ` +
                     (router.route === "/app/upgrade" ? styles.active : "")
                  }
               >
                  <span className={`${styles.orange_border}`}></span>
                  <p>Upgrade</p>
               </a>
            </Link>
            <Link href={"mailto:contact@myfomo.io"}>
               <a className={`${styles.menu_item}`}>
                  <span className={`${styles.orange_border}`}></span>
                  <span className={`${styles.tooltip}`}>Help</span>
                  <img src="/assets/common/menu_help.svg" />
               </a>
            </Link>
         </div>
      </aside>
   );
};

export default SidebarLeftCreate;
