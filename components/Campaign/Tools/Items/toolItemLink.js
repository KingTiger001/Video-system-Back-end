import PopupDeleteLink from "@/components/Popups/PopupDeleteLink";
import styles from "@/styles/components/Campaign/Elements.module.sass";
import { useEffect, useRef, useState } from "react";
import { ObjectID } from "bson";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { ChromePicker } from "react-color";
import { linkPresets } from "../../Presets";
import InputRange from "react-input-range";
import { mainAPI } from "@/plugins/axios";

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

const textSizes = [
   { value: 20, label: "1" },
   { value: 24, label: "2" },
   { value: 28, label: "3" },
   { value: 32, label: "4" },
   { value: 36, label: "5" },
];

const ToolItemText = () => {
   const dispatch = useDispatch();
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });

   const [linkFocused, setLinkFocused] = useState(false);
   const [showContentLink, setShowContentLink] = useState(false);
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
      const index = obj.links.findIndex((link) => link._id === linkFocused._id);
      if (index < 0) return;
      obj.links[index].value = value;

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
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

   const handleOnBlur = async (event) => {
      const { value } = event.target;
      const obj = { ...selectedContent };
      const index = obj.links.findIndex((link) => link._id === linkFocused._id);
      if (index < 0) return;
      obj.links[index].value = value;
      // Create Thumbnail
      dispatch({ type: "SET_CREATE_TEMPLATE_THUMBNAIL", data: true });
      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);
   };

   const handleRemove = async (id) => {
      const obj = { ...selectedContent };
      const index = obj.links.findIndex((link) => link._id === id);
      if (index < 0) return;
      obj.links.splice(index, 1);

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
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
      
            // Create Thumbnail
      dispatch({ type: "SET_CREATE_TEMPLATE_THUMBNAIL", data: true });
   };

   const handleAdd = async () => {
      const _id = new ObjectID().toString();
      const obj = { ...selectedContent };
      const newLink = {
         _id,
         value: "",
         url: "",
         fontSize: textSizes[0], // Set default button size
         color: "#898989",
         preset: 0,
         position: { x: 50, y: 50 },
      };
      setLinkFocused(newLink);
      obj.links.push(newLink);

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

      dispatch({
         type: "SET_SELECTED_CONTENT",
         data: obj,
      });
      setShowContentLink(true);
      
            // Create Thumbnail
      dispatch({ type: "SET_CREATE_TEMPLATE_THUMBNAIL", data: true });
   };

   const toggleAdd = (show = null) => {
      if (show !== null) {
         setShowContentLink(show);
      }
      setShowContentLink(!showContentLink);
   };

   useEffect(() => {
      if (
         selectedContent &&
         selectedContent.links &&
         selectedContent.links.length
      ) {
         setShowContentLink(true);
      }
   }, [selectedContent]);

   const handleOptionSelect = (index, option) => {
      if (optionSelected.index === index && optionSelected.option === option) {
         setOptionSelected({ index: null, option: null });
      } else {
         setOptionSelected({ index, option });
      }
   };

   const handleOnBlurUrl = async (event, id) => {
      const { value } = event.target;
      const obj = { ...selectedContent };
      const index = obj.links.findIndex((link) => link._id === id);
      if (index < 0) return;
      obj.links[index].url = value;

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);
   };

   const handleOnChangeUrl = async (event, id) => {
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
         type: "DRAG_ITEM",
         data: true,
      });
      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
   };

   const handleChangeSize = async (value, id) => {
      const obj = { ...selectedContent };
      const index = obj.links.findIndex((text) => text._id === id);
      if (index < 0) return;
      obj.links[index].fontSize = value;

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

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
      
            // Create Thumbnail
      dispatch({ type: "SET_CREATE_TEMPLATE_THUMBNAIL", data: true });
   };

   const handleChangeColor = async (value, id) => {
      const obj = { ...selectedContent };
      const index = obj.links.findIndex((links) => links._id === id);
      if (index < 0) return;
      obj.links[index].color = value;

      if (obj.type === "screen")
         await mainAPI.patch(`/templates/${obj._id}`, obj);

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
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

   const selectPreset = (value, id) => {
      const obj = { ...selectedContent };
      const index = obj.links.findIndex((link) => link._id === linkFocused._id);
      if (index < 0) return;
      obj.links[index].preset = value;

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
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

   const colorpickerRef = useRef(null);

   useEffect(() => {
      function handleClickOutside(event) {
         if (
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
   }, [colorpickerRef]);

   // const renderStyleOption = (link) => (
   //    <div className={styles.styleOption}>
   //       <div className={styles.styles}>
   //          <div className={styles.subtitle}>Styles</div>
   //          <div className={styles.content}>
   //             {linkPresets.map((preset) => (
   //                <>
   //                   {preset !== 2 && (
   //                      <div
   //                         className={`${styles.presetBtn} ${
   //                            link.preset === linkFocused.preset
   //                               ? styles.selected
   //                               : null
   //                         }`}
   //                         onClick={() => selectPreset(preset, link._id)}
   //                      >
   //                         Preset {preset <= 1 ? preset + 1 : preset}
   //                      </div>
   //                   )}
   //                </>
   //             ))}
   //          </div>
   //       </div>
   //       <div className={styles.fontSize}>
   //          <div className={styles.subtitle}>Size</div>
   //          <div className={styles.content}>
   //             <RangeSliderContainer color={"#5F59F7"}>
   //                <InputRange
   //                   maxValue={3}
   //                   minValue={0}
   //                   step={0.2}
   //                   value={parseFloat(link.fontSize).toFixed(2)}
   //                   // value={selectedContent.screen.duration}
   //                   onChange={(value) => {
   //                      handleChangeSize(value, link._id);
   //                   }}
   //                />
   //             </RangeSliderContainer>
   //          </div>
   //       </div>

   //       <div className={styles.color}>
   //          <div className={styles.subtitle}>Color</div>
   //          <div className={styles.content}>
   //             <ChromePicker
   //                className={styles.colorPicker}
   //                disableAlpha={true}
   //                color={link.color}
   //                onChange={(color) => handleChangeColor(color.hex, link._id)}
   //             />
   //          </div>
   //       </div>
   //    </div>
   // );
   const renderStyleOption = (link) => (
      <div className={styles.styleOption}>
         <div className={styles.styles}>
            {/* <div className={styles.subtitle}>Styles</div> */}
            <div className={styles.content}>
               {linkPresets.map((preset, i) => (
                  <div
                     style={{ display: "none" }}
                     key={i}
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
                  color={link.color}
                  onChange={(color) => handleChangeColor(color.hex, link._id)}
               />
            </div>
         </div>
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
                  onBlur={(e) => {
                     handleOnBlur(e, link._id);
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
         <div
            key={index}
            className={`${styles.listItem} ${
               link._id === linkFocused._id ? styles.focused : ""
            }`}
         >
            {/* <div className={styles.toolSize}>
               <label className={styles.toolLabel}>Size</label>
               <div className={styles.toolSlider}>
                  <RangeSliderContainer color={"#FF5C00"}>
                     <InputRange
                        maxValue={3}
                        minValue={0}
                        step={0.2}
                        value={parseFloat(link.fontSize).toFixed(2)}
                        // value={selectedContent.screen.duration}
                        onChange={(value) => {
                           handleChangeSize(value, link._id);
                        }}
                     />
                  </RangeSliderContainer>
               </div>
            </div> */}

            <div className={styles.textMain}>
               <div
                  className={styles.toolItemOption}
                  onClick={() => {
                     showPopup({ display: "DELETE_LINK", data: link._id });
                  }}
               >
                  <img
                     className={styles.removeText}
                     src="/assets/campaign/removeText.svg"
                  />
               </div>
               <input
                  onFocus={() => setLinkFocused(link)}
                  className={styles.first}
                  placeholder={"enter text"}
                  onChange={(e) => {
                     handleOnChange(e, link._id);
                  }}
                  value={link.value}
               />
               <input
                  onFocus={() => setLinkFocused(link)}
                  placeholder={"https://..."}
                  onChange={(e) => {
                     handleOnChangeUrl(e, link._id);
                  }}
                  onBlur={(e) => {
                     handleOnBlurUrl(e, link._id);
                  }}
                  value={link.url}
               />
            </div>
            {/* <div className={styles.toolItemOptions}>
          <div
            className={styles.toolItemOption}
            onClick={() => {
              handleOptionSelect(index, "style");
            }}
          >
            style
            <img src="/assets/campaign/toolItemPaint.svg" />
          </div>
        </div> */}
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
               className={`${styles.toolItemName} ${
                  showContentLink &&
                  selectedContent &&
                  selectedContent.links &&
                  selectedContent.links.length > 0
                     ? styles.expand
                     : ""
               }`}
               onClick={
                  selectedContent &&
                  selectedContent.links &&
                  selectedContent.links.length > 0
                     ? toggleAdd
                     : handleAdd
               }
            >
               <img src="/assets/campaign/timeline_add.svg" />
               <span>Add call to action</span>
            </div>
            {showContentLink && (
               <>
                  <div className={styles.toolItemContent}>
                     <div className={styles.listItems}>
                        {selectedContent &&
                           selectedContent.links &&
                           selectedContent.links.length > 0 && (
                              <>
                                 <div className={styles.toolItemOptions}>
                                    <div className={styles.styleOption}>
                                       {linkPresets.map(
                                          (preset) =>
                                             preset !== 2 && (
                                                <div
                                                   className={`${
                                                      styles.presetBtn
                                                   } ${
                                                      linkFocused.preset ===
                                                      preset
                                                         ? styles.selected
                                                         : null
                                                   }`}
                                                   onClick={() =>
                                                      selectedContent.links.map(
                                                         (link) =>
                                                            selectPreset(
                                                               preset,
                                                               link._id
                                                            )
                                                      )
                                                   }
                                                >
                                                   Preset{" "}
                                                   {preset <= 1
                                                      ? preset + 1
                                                      : preset}
                                                </div>
                                             )
                                       )}
                                    </div>
                                 </div>
                                 <div className={styles.styleOption}>
                                    <div className={`${styles.labelControl}`}>
                                       Size
                                    </div>
                                    <div
                                       className={`${styles.presetBtn} ${styles.selected}`}
                                    >
                                       <div
                                          className={`${styles.styleOptionItem}`}
                                       >
                                          <select
                                             className={styles.select}
                                             onChange={(e) => {
                                                handleChangeSize(
                                                   e.target.value,
                                                   linkFocused._id
                                                );
                                             }}
                                             value={linkFocused.fontSize}
                                             disabled={!linkFocused}
                                          >
                                             {textSizes.map((f) => (
                                                <option value={f.value}>
                                                   {f.label}
                                                </option>
                                             ))}
                                          </select>
                                       </div>
                                    </div>
                                    <div className={`${styles.labelControl}`}>
                                       Color
                                    </div>
                                    <div
                                       className={`${styles.presetBtn} ${styles.selected}`}
                                    >
                                       <div
                                          className={`${styles.styleOptionItem} ${styles.fontColor}`}
                                       >
                                          <div
                                             className={styles.styleColor}
                                             style={{
                                                background: linkFocused
                                                   ? linkFocused.color
                                                   : "white",
                                             }}
                                             onClick={() => {
                                                handleOptionSelect(
                                                   linkFocused
                                                      ? linkFocused._id
                                                      : 0,
                                                   "style"
                                                );
                                             }}
                                          ></div>
                                       </div>
                                    </div>
                                 </div>
                              </>
                           )}
                        {selectedContent &&
                        selectedContent.links &&
                        selectedContent.links.length > 0
                           ? selectedContent.links.map((link, i) =>
                                renderLink(link, i)
                             )
                           : ""}
                     </div>
                     {optionSelected.option === "style" && (
                        <div
                           className={styles.toolItemOptionContent}
                           ref={colorpickerRef}
                        >
                           {renderStyleOption(linkFocused)}
                        </div>
                     )}
                  </div>
                  {selectedContent &&
                  selectedContent.links &&
                  selectedContent.links.length > 0 ? (
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
