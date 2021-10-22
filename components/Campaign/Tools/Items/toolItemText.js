import PopupDeleteText from "@/components/Popups/PopupDeleteText";
import styles from "@/styles/components/Campaign/Tools.module.sass";
import { useState } from "react";
import { ObjectID } from "bson";
import { useDispatch, useSelector } from "react-redux";
import { ChromePicker } from "react-color";
import styled from "styled-components";
import InputRange from "react-input-range";
import { textPresets } from "../../Presets";
import TextVariables from "../../TextVariables";

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
    const index = obj.texts.findIndex((text) => text._id === id);
    if (index < 0) return;
    obj.texts[index].value = value;

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
    const index = obj.texts.findIndex((text) => text._id === id);
    if (index < 0) return;
    obj.texts[index].fontSize = value;

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

  const handleAddVariables = (value, id) => {
    const obj = { ...selectedContent };
    const index = obj.texts.findIndex((text) => text._id === id);
    if (index < 0) return;
    obj.texts[index].value = obj.texts[index].value + " " + value;

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
    const index = obj.texts.findIndex((text) => text._id === id);
    if (index < 0) return;
    obj.texts[index].color = value;

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
    const index = obj.texts.findIndex((text) => text._id === id);
    if (index < 0) return;
    obj.texts.splice(index, 1);

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
    obj.texts.push({
      _id,
      value: "",
      fontSize: 2,
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

  const selectPreset = (value, id) => {
    const obj = { ...selectedContent };
    const index = obj.texts.findIndex((text) => text._id === id);
    if (index < 0) return;
    obj.texts[index].preset = value;

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

  const renderStyleOption = (text) => (
    <div className={styles.styleOption}>
      <div className={styles.styles}>
        <div className={styles.subtitle}>Styles</div>
        <div className={styles.content}>
          {textPresets.map((preset, i) => (
            <div
              key={i}
              className={`${styles.presetBtn} ${
                text.preset === preset ? styles.selected : null
              }`}
              onClick={() => selectPreset(preset, text._id)}
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
              maxValue={5}
              minValue={1}
              step={0.5}
              value={text.fontSize}
              // value={selectedContent.screen.duration}
              onChange={(value) => {
                handleChangeSize(value, text._id);
              }}
            />
          </RangeSliderContainer>
        </div>
      </div>

      <div className={styles.color}>
        <div className={styles.subtitle}>Color</div>
        <div className={styles.content}>
          <ChromePicker
            className={styles.colorPicker}
            disableAlpha={true}
            color={text.color}
            onChange={(color) => handleChangeColor(color.hex, text._id)}
          />
        </div>
      </div>
    </div>
  );

  const renderVariablesOption = (text) => {
    return (
      <div className={styles.styleOption}>
        <div className={styles.variables}>
          <TextVariables
            onChange={({ variable }) => handleAddVariables(variable, text._id)}
          />
        </div>
      </div>
    );
  };

  const renderText = (text, index) => {
    return (
      <div key={index} className={styles.listItem}>
        <input
          placeholder={"Add text..."}
          onChange={(e) => {
            handleOnChange(e, text._id);
          }}
          value={text.value}
          required
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
          <div
            className={styles.toolItemOption}
            onClick={() => {
              handleOptionSelect(index, "variables");
            }}
          >
            variables
            <img src="/assets/campaign/toolItemVariable.svg" />
          </div>

          <div
            className={styles.toolItemOption}
            onClick={() => {
              showPopup({ display: "DELETE_TEXT", data: text._id });
            }}
          >
            remove
            <img src="/assets/campaign/toolItemDelete.svg" />
          </div>
        </div>
        {optionSelected.index === index &&
          optionSelected.option === "style" && (
            <div className={styles.toolItemOptionContent}>
              {renderStyleOption(text)}
            </div>
          )}
        {optionSelected.index === index &&
          optionSelected.option === "variables" && (
            <div className={styles.toolItemOptionContent}>
              {renderVariablesOption(text)}
            </div>
          )}
      </div>
    );
  };

  return (
    <>
      {popup.display === "DELETE_TEXT" && (
        <PopupDeleteText
          onDelete={() => {
            handleRemove(popup.data);
            hidePopup();
          }}
        />
      )}
      <div className={`${styles.toolItem} ${styles.texts}`}>
        <div
          className={styles.toolItemName}
          onClick={() => setShowContent(!showContent)}
        >
          <p>Texts</p>
          <img src="/assets/campaign/toolFont.svg" />
        </div>

        {showContent && (
          <div className={styles.toolItemContent}>
            <div className={styles.listItems}>
              {selectedContent.texts.length > 0 ? (
                selectedContent.texts.map((text, i) => renderText(text, i))
              ) : (
                <span>no text for the moment...</span>
              )}
            </div>
            <div onClick={handleAdd} className={styles.addTextBtn}>
              <img src={"/assets/common/addRounded.svg"} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ToolItemText;
