import PopupDeleteText from "@/components/Popups/PopupDeleteText";
// import styles from "@/styles/components/Campaign/Tools.module.sass";
import styles from "@/styles/components/Campaign/Elements.module.sass";
import { useEffect, useRef, useState } from "react";
import { ObjectID } from "bson";
import { useDispatch, useSelector } from "react-redux";
import { ChromePicker } from "react-color";
import styled from "styled-components";
import InputRange from "react-input-range";
import { textPresets } from "../../Presets";
import GoogleFontLoader from "react-google-font-loader";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { textFamilies, textSizes } from "data/fonts";
import { mainAPI } from "@/plugins/axios";
// import TextVariables from "../../TextVariables";

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

// const animatedComponents = makeAnimated()

const ToolItemText = () => {
   // States
   const [filterFontFamiles, setFilterFontFamiles] = useState(textFamilies);

   const textareaRef = useRef(null);
   const colorpickerRef = useRef(null);
   useEffect(() => {
      function handleClickOutside(event) {
         if (
            textareaRef.current &&
            !textareaRef.current.contains(event.target) &&
            colorpickerRef.current &&
            !colorpickerRef.current.contains(event.target)
         ) {
            setOptionSelected({ id: null, option: null });
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [textareaRef, colorpickerRef]);

   const dispatch = useDispatch();
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });

   const txtColor = "#898989";
   const txtSize = 1;

   const [textFocused, setTextFocused] = useState(false);
   const [showContentTxt, setShowContentTxt] = useState(false);
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

   const handleOnChange = async (event, id) => {
      const { value } = event.target;
      const obj = { ...selectedContent };
      const index = obj.texts.findIndex((text) => text._id === id);
      if (index !== -1) {
         obj.texts[index].value = value;
      }
      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
      let array = contents.slice();

      if (indexArr !== -1) {
         array[indexArr] = obj;
         dispatch({
            type: "SET_VIDEO",
            data: array,
         });
         dispatch({
         type: "DRAG_ITEM",
         data: true,
      });
      }
   };

   const handleOnBlur = async (event, id) => {
      const { value } = event.target;
      const obj = { ...selectedContent };
      const index = obj.texts.findIndex((text) => text._id === id);
      if (index !== -1) {
         obj.texts[index].value = value;
      }
      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);
   };

   const handleChangeSize = async (value) => {
      const obj = { ...selectedContent };
      console.log(obj);
      const index = obj.texts.findIndex((text) => text._id === textFocused._id);
      if (index < 0) return;
      obj.texts[index].fontSize = value;

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
      let array = contents.slice();
      array[indexArr] = obj;

      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
      dispatch({
         type: "DRAG_ITEM",
         data: true,
      });
   };

   const handleChangeFont = async (value) => {
      const obj = { ...selectedContent };
      const index = obj.texts.findIndex((text) => text._id === textFocused._id);
      obj.texts[index].fontFamily = value;

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
      let array = contents.slice();
      array[indexArr] = obj;

      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
      dispatch({
         type: "DRAG_ITEM",
         data: true,
      });
   };

   const toggleStyle = async (type) => {
      const obj = { ...selectedContent };
      const index = obj.texts.findIndex((text) => text._id === textFocused._id);

      const target = obj.texts[index][type];

      if (target) obj.texts[index][type] = false;
      else obj.texts[index][type] = true;

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
      let array = contents.slice();
      array[indexArr] = obj;

      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
      dispatch({
         type: "DRAG_ITEM",
         data: true,
      });
   };

   const textAlign = async (align) => {
      const obj = { ...selectedContent };
      const index = obj.texts.findIndex((text) => text._id === textFocused._id);

      // const target = obj.texts[index].textAlign;

      // if (target) obj.texts[index].textAlign = align;
      // else obj.texts[index].textAlign = align;
      const position = obj.texts[index].position;
      switch (align) {
         case "right":
            obj.texts[index].position = { x: 90, y: position.y };
            break;
         case "left":
            obj.texts[index].position = { x: 10, y: position.y };
            break;
         case "center":
            obj.texts[index].position = { x: 50, y: position.y };
            break;
      }

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
      let array = contents.slice();
      array[indexArr] = obj;

      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
      dispatch({
         type: "DRAG_ITEM",
         data: true,
      });
   };

   const handleAddVariables = async (value, id) => {
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

   const handleChangeColor = async (value, id) => {
      const obj = { ...selectedContent };
      const index = obj.texts.findIndex((text) => text._id === id);
      if (index < 0) return;
      obj.texts[index].color = value;

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
      let array = contents.slice();
      array[indexArr] = obj;

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
      dispatch({
         type: "DRAG_ITEM",
         data: true,
      });
   };

   const handleRemove = async (id) => {
      const obj = { ...selectedContent };
      const index = obj.texts.findIndex((text) => text._id === id);
      if (index < 0) return;
      obj.texts.splice(index, 1);

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
      let array = contents.slice();
      array[indexArr] = obj;

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
      dispatch({
         type: "DRAG_ITEM",
         data: true,
      });
   };

   const handleAdd = async () => {
      const _id = new ObjectID().toString();
      const obj = { ...selectedContent, texts: selectedContent.texts || [] };
      const newText = {
         _id,
         value: "",
         fontSize: txtSize,
         color: txtColor,
         preset: 0,
         position: { x: 50, y: 50 },
      };
      setTextFocused(newText);
      obj.texts.push(newText);
      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);
      dispatch({
         type: "SET_SELECTED_CONTENT",
         data: obj,
      });
      setShowContentTxt(true);
   };

   const toggleAdd = (show = null) => {
      if (show !== null) {
         setShowContentTxt(show);
      }
      setShowContentTxt(!showContentTxt);
   };

   useEffect(() => {
      if (selectedContent.texts.length) {
         setShowContentTxt(true);
         setTextFocused(selectedContent.texts[0]);
      }
   }, [selectedContent]);

   const handleOptionSelect = (id, option) => {
      if (optionSelected.id === id && optionSelected.option === option) {
         setOptionSelected({ id: null, option: null });
      } else {
         setOptionSelected({ id, option });
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
      dispatch({
         type: "DRAG_ITEM",
         data: true,
      });
   };

   const renderStyleOption = (text) => (
      <div className={styles.styleOption}>
         <div className={styles.styles}>
            {/* <div className={styles.subtitle}>Styles</div> */}
            <div className={styles.content}>
               {textPresets.map((preset, i) => (
                  <div
                     style={{ display: "none" }}
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
         {/* <div className={styles.fontSize}>
        <div className={styles.subtitle}>Size</div>
        <div className={styles.content}>
          <RangeSliderContainer color={"#5F59F7"}>
            <InputRange
              maxValue={5}
              minValue={0.4}
              step={0.2}
              value={parseFloat(text.fontSize).toFixed(2)}
              // value={selectedContent.screen.duration}
              onChange={(value) => {
                handleChangeSize(value, text._id);
              }}
            />
          </RangeSliderContainer>
        </div>
      </div> */}

         <div className={styles.color}>
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
      // return (
      //   <div className={styles.styleOption}>
      //     <div className={styles.variables}>
      //       <TextVariables
      //         onChange={({ variable }) => handleAddVariables(variable, text._id)}
      //       />
      //     </div>
      //   </div>
      // );
   };

   const renderText = (text, index) => {
      return (
         <div
            key={index}
            className={`${styles.listItem} ${
               text._id === textFocused._id ? styles.focused : ""
            }`}
         >
            <div className={styles.textMain}>
               <div
                  className={styles.toolItemOption}
                  onClick={() => {
                     showPopup({ display: "DELETE_TEXT", data: text._id });
                  }}
               >
                  <img
                     className={styles.removeText}
                     src="/assets/campaign/removeText.svg"
                  />
               </div>
               <textarea
                  ref={textareaRef}
                  onFocus={() => setTextFocused(text)}
                  placeholder={"Add text..."}
                  onChange={(e) => {
                     handleOnChange(e, text._id);
                  }}
                  onBlur={(e) => {
                     handleOnBlur(e, text._id);
                  }}
                  value={text.value}
                  required
               />
            </div>
            {/* {optionSelected.index === index &&
          optionSelected.option === "variables" && (
            <div className={styles.toolItemOptionContent}>
              {renderVariablesOption(text)}
            </div>
          )} */}
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
               className={`${styles.toolItemName} ${
                  showContentTxt &&
                  selectedContent.links &&
                  selectedContent.links.length > 0
                     ? styles.expand
                     : ""
               }`}
               onClick={
                  selectedContent.texts && selectedContent.texts.length > 0
                     ? toggleAdd
                     : handleAdd
               }
            >
               <img src="/assets/campaign/timeline_add.svg" />
               <span>Add text</span>
            </div>
            {showContentTxt && (
               <>
                  <div className={styles.toolItemContent}>
                     <div className={styles.listItems}>
                        {selectedContent.texts &&
                           selectedContent.texts.length > 0 && (
                              <div className={styles.toolItemOptions}>
                                 <div className={styles.styleOption}>
                                    <div
                                       className={`${styles.styleOptionItem} ${styles.fontFamily}`}
                                    >
                                       <select
                                          onChange={(e) =>
                                             handleChangeFont(e.target.value)
                                          }
                                          value={textFocused.fontFamily}
                                          className={styles.select}
                                          disabled={!textFocused}
                                       >
                                          {filterFontFamiles.map((f) => (
                                             <option value={f.value}>
                                                {f.label}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                    <div
                                       className={`${styles.styleOptionItem} `}
                                    >
                                       <select
                                          onChange={(e) => {
                                             handleChangeSize(e.target.value);
                                          }}
                                          value={textFocused.fontSize}
                                          className={styles.select}
                                          disabled={!textFocused}
                                       >
                                          {textSizes.map((f) => (
                                             <option value={f.value}>
                                                {f.label}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                    <div
                                       className={`${styles.styleOptionItem} ${styles.textStyle}`}
                                    >
                                       <button
                                          onClick={() => toggleStyle("bold")}
                                          className={styles.textOptionBtn}
                                       >
                                          B
                                       </button>
                                       <button
                                          onClick={() => toggleStyle("italic")}
                                          className={styles.textOptionBtn}
                                       >
                                          /
                                       </button>
                                       <button
                                          onClick={() =>
                                             toggleStyle("underline")
                                          }
                                          className={`${styles.textOptionBtn} ${styles.underlineTxt}`}
                                       >
                                          U
                                       </button>
                                    </div>
                                    <div
                                       className={`${styles.styleOptionItem} ${styles.textAlign}`}
                                    >
                                       <button
                                          onClick={() => textAlign("left")}
                                          className={`${styles.textOptionBtn} ${
                                             textFocused.position &&
                                             textFocused.position.x === 10
                                                ? styles.active
                                                : ""
                                          }`}
                                       >
                                          <img src="/assets/campaign/alignLeft.svg"></img>
                                       </button>
                                       <button
                                          onClick={() => textAlign("center")}
                                          className={`${styles.textOptionBtn} ${
                                             textFocused.position &&
                                             textFocused.position.x === 50
                                                ? styles.active
                                                : ""
                                          }`}
                                       >
                                          <img src="/assets/campaign/alignCenter.svg"></img>
                                       </button>
                                       <button
                                          onClick={() => textAlign("right")}
                                          className={`${styles.textOptionBtn} ${
                                             textFocused.position &&
                                             textFocused.position.x === 90
                                                ? styles.active
                                                : ""
                                          }`}
                                       >
                                          <img src="/assets/campaign/alignRight.svg"></img>
                                       </button>
                                       <button className={styles.textOptionBtn}>
                                          <img src="/assets/campaign/alignJustify.svg"></img>
                                       </button>
                                    </div>
                                    <div
                                       className={`${styles.styleOptionItem} ${styles.fontColor}`}
                                    >
                                       <div
                                          className={styles.styleColor}
                                          style={{
                                             background: textFocused
                                                ? textFocused.color
                                                : txtColor,
                                          }}
                                          onClick={() => {
                                             handleOptionSelect(
                                                textFocused
                                                   ? textFocused._id
                                                   : 0,
                                                "style"
                                             );
                                          }}
                                       ></div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        {selectedContent.texts &&
                        selectedContent.texts.length > 0
                           ? selectedContent.texts.map((text, i) =>
                                renderText(text, i)
                             )
                           : ""}
                     </div>
                     {textFocused &&
                        optionSelected.id === textFocused._id &&
                        optionSelected.option === "style" && (
                           <div
                              className={styles.toolItemOptionContent}
                              ref={colorpickerRef}
                           >
                              {renderStyleOption(textFocused)}
                           </div>
                        )}
                     {/* <div onClick={handleAdd} className={styles.addTextBtn}>
              <img src={"/assets/common/addRounded.svg"} />
            </div> */}
                  </div>
                  {selectedContent.texts && selectedContent.texts.length > 0 ? (
                     <div className={styles.toolItemAdd} onClick={handleAdd}>
                        <img src="/assets/campaign/addTextOrange.svg" />
                     </div>
                  ) : (
                     ""
                  )}
               </>
            )}
         </div>
      </>
   );
};

export default ToolItemText;
