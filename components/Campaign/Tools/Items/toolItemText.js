import PopupDeleteText from "@/components/Popups/PopupDeleteText";
import styles from "@/styles/components/Campaign/Tools.module.sass";
import { useState } from "react";
import { ObjectID } from "bson";
import { useDispatch, useSelector } from "react-redux";

const ToolItemText = () => {
  const dispatch = useDispatch();
  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const [showContent, setShowContent] = useState(false);

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
    obj.texts.push({ _id, value: "", position: { x: 0, y: 0 } });
    dispatch({
      type: "SET_SELECTED_CONTENT",
      data: obj,
    });
  };

  const renderText = (text, index) => {
    return (
      <div key={index} className={styles.listItem}>
        <input
          placeholder={"enter text"}
          onChange={(e) => {
            handleOnChange(e, text._id);
          }}
          value={text.value}
          required
        />
        <div className={styles.toolItemOptions}>
          <div className={styles.toolItemOption} onClick={() => {}}>
            <img src="/assets/campaign/toolItemPaint.svg" />
          </div>
          <div className={styles.toolItemOption} onClick={() => {}}>
            <img src="/assets/campaign/toolItemVariable.svg" />{" "}
            {/* variables */}
          </div>

          <div
            className={styles.toolItemOption}
            onClick={() => {
              showPopup({ display: "DELETE_TEXT", data: text._id });
            }}
          >
            <img src="/assets/campaign/toolItemDelete.svg" />
          </div>
        </div>
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
            <div onClick={handleAdd} className={styles.addTextBtn}>
              <span>Add text</span>
              <img src={"/assets/common/add.svg"} />
            </div>
            <span className={styles.subtitle}>Elements</span>
            <div className={styles.listItems}>
              {selectedContent.texts.length > 0 ? (
                selectedContent.texts.map((text, i) => renderText(text, i))
              ) : (
                <span>no text for the moment...</span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ToolItemText;
