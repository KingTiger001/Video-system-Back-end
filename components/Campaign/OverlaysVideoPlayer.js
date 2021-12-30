import { useRouter } from "next/router";

import styles from "@/styles/components/Campaign/Player.module.sass";
import { useState } from "react";
import { renderPresetElement } from "./Presets";

import { mainAPI } from "@/plugins/axios";

const Overlays = ({ contact, contents, activeContent, playerWidth,fromPlayer }) => {
  const router = useRouter();

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

  const convertToRelative = (fontSize) => {
    return playerWidth / (25 / fontSize);
  };

  const renderElement = (elem, type) => {
    let obj = { ...elem };
    obj.value = replaceVariables(obj.value);
    obj.fontSize = convertToRelative(obj.fontSize);
    return (
      <div
        onClick={() =>
          type === "link"
            ? window.open(convertToUrl(obj.url), "_blank") &&
              createLinkAnalytic(obj._id)
            : null
        }
        key={obj._id}
        style={{
          left: `${obj.position.x}%`,
          top: `${obj.position.y}%`,
          position: "absolute",
          transform: (obj.fontSize>60)? "translate(-46%, -43%)": "translate(-50%,-50%)",
          // width: (obj.fontSize>60)? "100%": "",
          // textAlign: (obj.fontSize>60)? "center": "",
          width: "100%",
          textAlign: "center",
          zIndex:99
        }}
      >
        <div
          className={
            type === "text" ? styles.textDraggable : styles.linkDraggable
          }
        >
          {renderPresetElement(obj, type)}
        </div>
      </div>
    );
  };
  
  if(fromPlayer){
    return (
    <div
      className="xxxx"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: contents[0].screen.background.color,
      }}
    >
      
        {contents[activeContent].texts.map((text) =>
          renderElement(text, "text")
        )}
        {contents[activeContent].links.map((link) =>
          renderElement(link, "link")
        )}
      </div>
      
      )
  }
  if (
    !fromPlayer
    &&
    activeContent !== -1 &&
    contents[activeContent] &&
    Object.keys(contents[activeContent]).length > 0
  ) {
   
    
    return (
      <>
        {contents[activeContent].texts.map((text) =>
          renderElement(text, "text")
        )}
        {contents[activeContent].links.map((link) =>
          renderElement(link, "link")
        )}
      </>
    );
  } else {
    return null;
  }
};

export default Overlays;
