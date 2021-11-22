import { useRouter } from "next/router";

import styles from "@/styles/components/Campaign/Player.module.sass";
import { useState } from "react";
import { renderPresetElement } from "./Presets";

import { mainAPI } from "@/plugins/axios";

const Overlays = ({ contact, contents, activeContent, playerWidth }) => {
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
          transform: "translate(-50%,-50%)",
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
  if (
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
