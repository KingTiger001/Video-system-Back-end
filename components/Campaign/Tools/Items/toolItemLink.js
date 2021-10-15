import PopupDeleteLink from "@/components/Popups/PopupDeleteText";
import styles from "@/styles/components/Campaign/Tools.module.sass";
import { useState } from "react";
import { ObjectID } from "bson";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { ChromePicker } from "react-color";
import { linkPresets } from "../../Presets";
import InputRange from "react-input-range";

const RangeSliderContainer = styled.div`
  .input-range__track--active,
  .input-range__slider {
    background: ${(props) => props.color};
    border-color: ${(props) => props.color};
  }
  .input-range {
    border: 50px;
  }
`;

const ToolItemText = () => {
  const dispatch = useDispatch();
  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const [showContent, setShowContent] = useState(false);
  const [optionSelected, setOptionSelected] = useState({
    index: null,
    option: null,
  });

  const popup = useSelector((state) => state.popup);
  const selectedContent = useSelector(
    (state) => state.campaign.selectedContent
  );
  const contents = useSelector((state) => state.campaign.contents);
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });

  const handleOnChange = (event, id) => {
    const { value } = event.target;
    const obj = { ...selectedContent };
    const index = obj.links.findIndex((link) => link._id === id);
    if (index < 0) return;
    obj.links[index].value = value;

    const indexArr = contents.findIndex(
      (content) => content._id === selectedContent._id
    );
    let array = contents.slice();
    array[indexArr] = obj;

    dispatch({
      type: "SET_VIDEO",
      data: array,
    });
  };

  const handleRemove = (id) => {
    const obj = { ...selectedContent };
    const index = obj.links.findIndex((link) => link._id === id);
    if (index < 0) return;
    obj.links.splice(index, 1);

    const indexArr = contents.findIndex(
      (content) => content._id === selectedContent._id
    );
    let array = contents.slice();
    array[indexArr] = obj;

    dispatch({
      type: "SET_VIDEO",
      data: array,
    });
  };

  const handleAdd = () => {
    const _id = new ObjectID().toString();
    const obj = { ...selectedContent };
    obj.links.push({
      _id,
      value: "",
      url: "",
      fontSize: 1,
      color: "#898989",
      preset: 0,
      position: { x: 50, y: 50 },
    });
    dispatch({
      type: "SET_SELECTED_CONTENT",
      data: obj,
    });
  };

  const handleOptionSelect = (index, option) => {
    if (optionSelected.index === index && optionSelected.option === option) {
      setOptionSelected({ index: null, option: null });
    } else {
      setOptionSelected({ index, option });
    }
  };

  const handleOnChangeUrl = (event, id) => {
    const { value } = event.target;
    const obj = { ...selectedContent };
    const index = obj.links.findIndex((link) => link._id === id);
    if (index < 0) return;
    obj.links[index].url = value;

    const indexArr = contents.findIndex(
      (content) => content._id === selectedContent._id
    );
    let array = contents.slice();
    array[indexArr] = obj;

    dispatch({
      type: "SET_VIDEO",
      data: array,
    });
  };

  const handleChangeSize = (value, id) => {
    const obj = { ...selectedContent };
    const index = obj.links.findIndex((text) => text._id === id);
    if (index < 0) return;
    obj.links[index].fontSize = value;

    const indexArr = contents.findIndex(
      (content) => content._id === selectedContent._id
    );
    let array = contents.slice();
    array[indexArr] = obj;

    dispatch({
      type: "SET_VIDEO",
      data: array,
    });
  };

  const handleChangeColor = (value, id) => {
    const obj = { ...selectedContent };
    const index = obj.links.findIndex((links) => links._id === id);
    if (index < 0) return;
    obj.links[index].color = value;

    const indexArr = contents.findIndex(
      (content) => content._id === selectedContent._id
    );
    let array = contents.slice();
    array[indexArr] = obj;

    dispatch({
      type: "SET_VIDEO",
      data: array,
    });
  };

  const selectPreset = (value, id) => {
    const obj = { ...selectedContent };
    const index = obj.links.findIndex((link) => link._id === id);
    if (index < 0) return;
    obj.links[index].preset = value;

    const indexArr = contents.findIndex(
      (content) => content._id === selectedContent._id
    );
    let array = contents.slice();
    array[indexArr] = obj;

    dispatch({
      type: "SET_VIDEO",
      data: array,
    });
  };

  const renderStyleOption = (link) => (
    <div className={styles.styleOption}>
      <div className={styles.styles}>
        <div className={styles.subtitle}>Styles</div>
        <div className={styles.content}>
          {linkPresets.map((preset) => (
            <div
              className={`${styles.presetBtn} ${
                link.preset === preset ? styles.selected : null
              }`}
              onClick={() => selectPreset(preset, link._id)}
            >
              Preset {preset + 1}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.fontSize}>
        <div className={styles.subtitle}>Size</div>
        <div className={styles.content}>
          <RangeSliderContainer color={"#5F59F7"}>
            <InputRange
              maxValue={3}
              minValue={1}
              step={0.5}
              value={link.fontSize}
              // value={selectedContent.screen.duration}
              onChange={(value) => {
                handleChangeSize(value, link._id);
              }}
            />
          </RangeSliderContainer>
        </div>
      </div>

      {(link.preset === 0 || link.preset === 4) && (
        <div className={styles.color}>
          <div className={styles.subtitle}>Color</div>
          <div className={styles.content}>
            <ChromePicker
              className={styles.colorPicker}
              disableAlpha={true}
              color={link.color}
              onChange={(color) => handleChangeColor(color.hex, link._id)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderUrlOption = (link) => {
    return (
      <div className={styles.styleOption}>
        <div className={styles.url}>
          <input
            placeholder={"insert url"}
            onChange={(e) => {
              handleOnChangeUrl(e, link._id);
            }}
            value={link.url}
            required
          />
        </div>
      </div>
    );
  };

  const renderLink = (link, index) => {
    return (
      <div key={index} className={styles.listItem}>
        <span className={styles.subtitle}>Text</span>
        <input
          placeholder={"enter link"}
          onChange={(e) => {
            handleOnChange(e, link._id);
          }}
          value={link.value}
        />
        <span className={styles.subtitle}>Url</span>
        <input
          placeholder={"https://..."}
          onChange={(e) => {
            handleOnChangeUrl(e, link._id);
          }}
          value={link.url}
        />
        <div className={styles.toolItemOptions}>
          <div
            className={styles.toolItemOption}
            onClick={() => {
              handleOptionSelect(index, "style");
            }}
          >
            style
            <img src="/assets/campaign/toolItemPaint.svg" />
          </div>
          {/* <div
            className={styles.toolItemOption}
            onClick={() => {
              handleOptionSelect(index, "url");
            }}
          >
            url
            <img src="/assets/campaign/toolItemLink.svg" />
          </div> */}

          <div
            className={styles.toolItemOption}
            onClick={() => {
              showPopup({ display: "DELETE_LINK", data: link._id });
            }}
          >
            remove
            <img src="/assets/campaign/toolItemDelete.svg" />
          </div>
        </div>
        {optionSelected.index === index && (
          <div className={styles.toolItemOptionContent}>
            {optionSelected.option === "style" && renderStyleOption(link)}
          </div>
        )}
        {/* {optionSelected.index === index && (
          <div className={styles.toolItemOptionContent}>
            {optionSelected.option === "url" && renderUrlOption(link)}
          </div>
        )} */}
      </div>
    );
  };

  return (
    <>
      {popup.display === "DELETE_LINK" && (
        <PopupDeleteLink
          onDelete={() => {
            handleRemove(popup.data);
            hidePopup();
          }}
        />
      )}
      <div className={`${styles.toolItem} ${styles.links}`}>
        <div
          className={styles.toolItemName}
          onClick={() => setShowContent(!showContent)}
        >
          <p>Links</p>
          <img src="/assets/campaign/toolLink.svg" />
        </div>
        {showContent && (
          <div className={styles.toolItemContent}>
            <div className={styles.listItems}>
              {selectedContent.links.length > 0 ? (
                selectedContent.links.map((link, i) => renderLink(link, i))
              ) : (
                <span>no link for the moment...</span>
              )}
            </div>
            <div onClick={handleAdd} className={styles.addLinkBtn}>
              <img src={"/assets/common/addRounded.svg"} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ToolItemText;
