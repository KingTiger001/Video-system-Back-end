import styles from "./style.module.css";
import dayjs from "dayjs";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";

const CampaignListItem = ({
   campaign,
   renderActions,
   renderDropdownActions,
   dark,
}) => {
   const [displayDropdown, showDropdown] = useState(false);
   const [thumbnail, setThumbnail] = useState(null);
   const dropdownRef = useRef();

   const router = useRouter();
   const dispatch = useDispatch();
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });

   const displayDuration = (value) => {
      if (!value) {
         return "0:00";
      }
      const t = dayjs.duration(parseInt(Math.round(value), 10));
      const m = t.minutes();
      const s = t.seconds();
      return `${m}:${s < 10 ? `0${s}` : s}`;
   };

   useEffect(() => {
      const thereIsVideos = campaign.contents.find((c) => c.type === "video");
      const thereIsTemplates = campaign.contents.filter(
         (c) => c.type === "screen"
      );
      if (campaign.share.thumbnail) {
         setThumbnail({ type: "image", data: campaign.share.thumbnail });
      } else if (thereIsVideos) {
         setThumbnail({ type: "image", data: thereIsVideos.video.thumbnail });
      } else if (thereIsTemplates.length) {
         if (getTemplateHasMoreContents(thereIsTemplates)) {
            if (getTemplateHasMoreContents(thereIsTemplates).thumbnail)
               setThumbnail({
                  type: "image",
                  data: getTemplateHasMoreContents(thereIsTemplates).thumbnail,
               });
            else
               setThumbnail({
                  type: "bg",
                  data: getTemplateHasMoreContents(thereIsTemplates).screen
                     .background.color,
               });
         }
      }
   }, [campaign]);

   // Close click outside text style
   useEffect(() => {
      function handleClickOutside(event) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
         ) {
            showDropdown(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [dropdownRef]);

   const getTemplateHasMoreContents = (templates) => {
      return templates.reduce((prev, cur) => {
         return prev.texts.length + prev.links.length >
            cur.texts.length + cur.links.length
            ? prev
            : cur;
      });
   };

   return (
      <div className={`${styles.root} ${dark ? styles.dark : ""}`}>
         <div className={styles.image}>
            {thumbnail && thumbnail.type === "image" ? (
               <img src={thumbnail && thumbnail.data} alt={campaign.name} />
            ) : thumbnail && thumbnail.type === "bg" ? (
               <div style={{ backgroundColor: thumbnail.data }}></div>
            ) : (
               ""
            )}
         </div>
         <div className={styles.content}>
            <div className={styles.name}>
               {campaign.name ? campaign.name : "No Name"}
            </div>
            <div className={styles.duration}>
               {displayDuration(campaign.duration)}
            </div>
            <div className={styles.date}>
               {dayjs(
                  campaign.status === "draft"
                     ? campaign.createdAt
                     : campaign.sentAt
               ).format("MM/DD/YYYY")}
            </div>
            <div className={styles.actions}>
               <div className={styles.buttons}>{renderActions}</div>
               <div className={styles.more}>
                  {renderDropdownActions && (
                     <div
                        className={styles.more}
                        onClick={() => showDropdown(!displayDropdown)}
                     >
                        <span className={styles.dots}>...</span>
                        {displayDropdown && (
                           <div className={styles.dropdown} ref={dropdownRef}>
                              {renderDropdownActions}
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default CampaignListItem;
