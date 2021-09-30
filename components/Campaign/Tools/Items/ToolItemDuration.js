import styles from "@/styles/components/Campaign/Tools.module.sass";
import { useState } from "react";
import InputRange from "react-input-range";

import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

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
  const dispatch = useDispatch();
  const [showContent, setShowContent] = useState(false);
  const contents = useSelector((state) => state.campaign.contents);
  const selectedContent = useSelector(
    (state) => state.campaign.selectedContent
  );

  const handleChangeDuration = (value) => {
    const duration = parseInt(value, 10);
    const obj = { ...selectedContent };
    obj.screen.duration = duration;

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

  return (
    <div className={`${styles.toolItem} ${styles.duration}`}>
      <div
        className={styles.toolItemName}
        onClick={() => setShowContent(!showContent)}
      >
        <p>Duration</p>
        <img src="/assets/campaign/toolDuration.svg" />
      </div>

      {/* need to enable */}
      {showContent && (
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
      )}
    </div>
  );
};

export default ToolItemDuration;
