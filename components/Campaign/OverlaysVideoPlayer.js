import { useSelector } from "react-redux";

import styles from "@/styles/components/Campaign/Player.module.sass";
import { useState } from "react";
import { renderPresetElement } from "./Presets";

const Overlays = ({ contents, activeContent }) => {
  const renderElement = (elem, type) => {
    return (
      <div
        onClick={() =>
          type === "link" ? window.open("https://youtube.com", "_blank") : null
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

const Draggable = ({ children, defaultPosition }) => {
  const [position, setPosition] = useState(defaultPosition);

  return (
    <div
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      className={styles.draggable}
      // draggable
      // onDragEnd={handleDrag}
      // onDrag={handleDrag}

      // ******** do with ***********

      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};
