import { useDispatch, useSelector } from "react-redux";

import styles from "@/styles/components/Campaign/Player.module.sass";
import { useState, useRef, useEffect } from "react";
import { renderPresetElement } from "./Presets";
import { textSizes } from "data/fonts";
import { calcPositionPersent } from "utils";

const offsetX = 1;
const offsetY = 1;

const Overlays = ({ playerRef }) => {
  const dispatch = useDispatch();
  const contents = useSelector((state) => state.campaign.contents);
  const currentOverlay = useSelector((state) => state.campaign.currentOverlay);

  const updateContents = (id, position, type) => {
    const obj = { ...contents[currentOverlay] };

    const index =
      type === "text"
        ? obj.texts.findIndex((text) => text._id === id)
        : obj.links.findIndex((link) => link._id === id);
    if (index < 0) return;

    if (type === "link") {
      const linkPosition = obj.links[index].position;
      if (
        !(
          position.x === 0 &&
          position.y === 0 &&
          position.x !== linkPosition.x &&
          linkPosition.y !== position.y
        )
      ) {
        obj.links[index].position = position;
      }
    } else {
      const textPosition = obj.texts[index].position;
      if (
        !(
          position.x === 0 &&
          position.y === 0 &&
          position.x !== textPosition.x &&
          textPosition.y !== position.y
        )
      ) {
        obj.texts[index].position = position;
      }
    }

    const indexArr = contents.findIndex((content) => content._id === obj._id);
    let array = contents.slice();
    array[indexArr] = obj;
    dispatch({
      type: "DRAG_ITEM",
      data: true,
    });
    dispatch({
      type: "SET_VIDEO",
      data: array,
    });
  };

  const renderElement = (elem, type) => {
    return (
      <Draggable
        key={elem._id}
        playerRef={playerRef}
        defaultPosition={elem.position}
        onMouseUp={(position) => updateContents(elem._id, position, type)}
      >
        <div
          className={
            type === "text" ? styles.textDraggable : styles.linkDraggable
          }
        >
          {renderPresetElement(elem, type)}
        </div>
      </Draggable>
    );
  };
  if (currentOverlay !== -1 && contents[currentOverlay]) {
    return (
      <>
        {contents[currentOverlay].texts.map((text) =>
          renderElement(text, "text")
        )}
        {contents[currentOverlay].links.map((link) =>
          renderElement(link, "link")
        )}
      </>
    );
  } else {
    return null;
  }
};

export default Overlays;

const Draggable = ({ children, playerRef, defaultPosition, onMouseUp }) => {
  const ref = useRef();

  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    setPosition((s) => {
      return { ...s, ...defaultPosition };
    });
  }, [defaultPosition]);

  const handleMouseDown = (e) => {
    setDragging(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (dragging) {
      setDragging(false);
      e.stopPropagation();
      e.preventDefault();

      onMouseUp(positionRef.current);
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    let { x, y } = { x: e.clientX, y: e.clientY };

    if (playerRef.offsetWidth > 0) {
      const offsetLeft = playerRef.getBoundingClientRect().x;
      if (
        x > offsetLeft + playerRef.offsetWidth / 2 - 20 &&
        x < offsetLeft + playerRef.offsetWidth / 2 + 20
      ) {
        x = 50;

        y = Math.min(
          Math.max(
            ((y - playerRef.getBoundingClientRect().y) /
              playerRef.offsetHeight) *
              100,
            0 + offsetY
          ),
          100 - offsetY
        );
      } else {
        x = Math.min(
          Math.max(
            ((x - playerRef.getBoundingClientRect().x) /
              playerRef.offsetWidth) *
              100,
            0 + offsetX
          ),
          100 - offsetX
        );
        y = Math.min(
          Math.max(
            ((y - playerRef.getBoundingClientRect().y) /
              playerRef.offsetHeight) *
              100,
            0 + offsetY
          ),
          100 - offsetY
        );
      }
      positionRef.current = { x, y };
      setPosition({ x, y });
    }

    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      ref={ref}
      style={calcPositionPersent(
        offsetX,
        offsetY,
        position.x,
        position.y,
        ref.current,
        playerRef
      )}
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
