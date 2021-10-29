import { useRouter } from "next/router";

import styles from "@/styles/components/Campaign/Player.module.sass";
import { useState } from "react";
import { renderPresetElement } from "./Presets";

import { mainAPI } from "@/plugins/axios";

const Overlays = ({ contact, contents, activeContent }) => {
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

  const renderElement = (elem, type) => {
    elem.value = replaceVariables(elem.value);
    return (
      <div
        onClick={() =>
          type === "link"
            ? window.open(convertToUrl(elem.url), "_blank") &&
              createLinkAnalytic(elem._id)
            : null
        }
        key={elem._id}
        style={{
          left: `${elem.position.x}%`,
          top: `${elem.position.y}%`,
          position: "absolute",
          transform: "translate(-50%,-50%)",
        }}
      >
        <div
          className={
            type === "text" ? styles.textDraggable : styles.linkDraggable
          }
        >
          {renderPresetElement(elem, type)}
        </div>
      </div>
    );
  };
  if (activeContent !== -1 && contents[activeContent]) {
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
