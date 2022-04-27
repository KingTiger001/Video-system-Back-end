import { useRouter } from "next/router";

import styles from "@/styles/components/Campaign/Player.module.sass";
import { useEffect, useRef, useState } from "react";
import { renderPresetElement } from "./Presets";
import { calcPositionPersent } from "utils";

import { mainAPI } from "@/plugins/axios";

const Overlays = ({
   contact,
   contents,
   activeContent,
   playerWidth,
   fromPlayer,
   containerRef,
}) => {
   const router = useRouter();
   const offsetX = 1;
   const offsetY = 1;

   const createLinkAnalytic = (linkId) => {
      const campaignId = router.query.campaignId;
      const contactId = router.query.c;
      mainAPI.post(
         `/analytics/${campaignId}/clickedLink?c=${contactId}&l=${linkId}`
      );
   };
   const replaceVariables = (text) => {
      if (!contact) {
         return text;
      }
      const matches = text.match(/(?:\{\{)(.*?)(?:\}\})/gi);
      if (!matches || matches.length <= 0) {
         return text;
      }
      matches.map((match) => {
         text = text.replace(match, contact[match.replace(/{|}/g, "")] || "");
      });
      return text;
   };

   const convertToUrl = (url) => {
      // return url;
      return url.includes("https://") || url.includes("http://")
         ? url
         : `https://${url}`;
   };

   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      if (
         navigator &&
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
         )
      ) {
         // console.log("user agent is mobile");
         setIsMobile(true);
      } else {
         // console.log("user agent is not mobile");
         setIsMobile(false);
      }
   }, []);

   useEffect(() => {
      console.count("Render22");
      console.log(contents);
   }, [contents]);

   const renderElement = (elem, type) => {
      let obj = { ...elem };
      obj.value = replaceVariables(obj.value);

      return (
         <Dragable
            position={elem.position}
            onClick={() =>
               type === "link"
                  ? obj.url.length
                     ? window.open(convertToUrl(obj.url), "_blank")
                     : "" && createLinkAnalytic(obj._id)
                  : null
            }
         >
            <div
               className={
                  type === "text" ? styles.textDraggable : styles.linkDraggable
               }
            >
               {renderPresetElement(obj, type)}
            </div>
         </Dragable>
      );
   };

   const Dragable = ({ children, position: defaultPosition, ...rest }) => {
      const ref = useRef();
      const [position, setPosition] = useState({ x: 0, y: 0 });

      useEffect(() => {
         setPosition(defaultPosition);
      }, [defaultPosition]);

      useEffect(() => {
         console.count("Render00");
      }, []);

      return (
         <div
            ref={ref}
            style={calcPositionPersent(
               offsetX,
               offsetY,
               position.x,
               position.y,
               ref.current,
               containerRef
            )}
            className={styles.draggable}
            {...rest}
         >
            {children}
         </div>
      );
   };

   if (fromPlayer) {
      return (
         <div
            className="xxxx"
            style={{
               width: "100%",
               height: "100%",
               position: "absolute",
               inset: 0,
               zIndex: 1,
               background: contents.screen.background.color,
            }}
         >
            {contents.texts.map((text) => renderElement(text, "text"))}
            {contents.links.map((link) => renderElement(link, "link"))}
         </div>
      );
   }
   if (
      !fromPlayer &&
      activeContent !== -1 &&
      contents &&
      Object.keys(contents).length > 0
   ) {
      return (
         <>
            {contents.texts.map((text) => renderElement(text, "text"))}
            {contents.links.map((link) => renderElement(link, "link"))}
         </>
      );
   } else {
      return null;
   }
};

export default React.memo(Overlays);
