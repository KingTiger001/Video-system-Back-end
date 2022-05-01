import styles from "@/styles/components/Campaign/Tools.module.sass";
import { useEffect, useState } from "react";
import InputRange from "react-input-range";
import dayjs from "@/plugins/dayjs";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
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

const ToolItemDuration = () => {
   const selectedContent = useSelector(
      (state) => state.campaign.selectedContent
   );
   const dispatch = useDispatch();
   const [showContent, setShowContent] = useState(false);
   const [duration, setDuration] = useState("");
   const contents = useSelector((state) => state.campaign.contents);

   const displayDuration = (value) => {
      if (!value) {
         return "00:00";
      }
      const t = dayjs.duration(parseInt(value, 10));
      const m = t.minutes();
      const s = t.seconds();
      return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
   };

   const handleChangeDuration = async (value) => {
      const duration = parseInt(value, 10);
      const obj = { ...selectedContent };
      obj.screen.duration = duration;

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
      dispatch({ type: "CALC_VIDEOS_OFFSET", data: array });
   };

   function increase() {
      handleChangeDuration(selectedContent.screen.duration + 1);
   }
   function decrease() {
      handleChangeDuration(selectedContent.screen.duration - 1);
   }
   return (
      <div
         className={`${styles.toolItem}`}
         style={{
            position: "relative",
            width: "100%",
            paddingInline: "15px 10px",
         }}
      >
         <div
            style={{
               display: "flex",
               width: "100%",
               justifyContent: "space-between",
               alignItems: "center",
            }}
         >
            {selectedContent.screen ? (
               <p>{selectedContent.screen.duration} sec</p>
            ) : (
               ""
            )}
            <div
               className="arrows"
               style={{
                  width: "10px",
                  height: "15px",
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  marginLeft: "5px",
               }}
            >
               <i class={styles.arrowUp} onClick={increase}></i>
               <i class={styles.arrowDown} onClick={decrease}></i>
            </div>
         </div>

         {/* need to enable */}
         {/* {showContent && (
            <div className={styles.toolItemContent}>
               <label className={styles.toolLabel}>Duration</label>
               <div className={styles.toolSlider}>
                  <RangeSliderContainer color={"#5F59F7"}>
                     <InputRange
                        maxValue={10}
                        minValue={1}
                        value={selectedContent.screen.duration}
                        onChange={(value) => {
                           handleChangeDuration(value);
                        }}
                     />
                  </RangeSliderContainer>
               </div>
            </div>
         )} */}
      </div>
   );
};

export default ToolItemDuration;
