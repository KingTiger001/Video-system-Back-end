import { mainAPI } from "@/plugins/axios";
import styles from "@/styles/components/Campaign/Tools.module.sass";
import { useState } from "react";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";

const ToolItemSave = () => {
  const dispatch = useDispatch();
  const [showContent, setShowContent] = useState(false);
  const contents = useSelector((state) => state.campaign.contents);
  const endScreenList = useSelector((state) => state.campaign.endScreenList);

  const selectedContent = useSelector(
    (state) => state.campaign.selectedContent
  );

  const handleOnChange = (event) => {
    const { value } = event.target;
    const obj = { ...selectedContent };
    obj.screen.name = value;

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

  const getScreenList = async () => {
    const { data } = await mainAPI.get("/users/me/endScreens");
    dispatch({
      type: "SET_END_SCREEN_LIST",
      data,
    });
  };

  const addScreenToLibrary = async () => {
    try {
      const { data } = await mainAPI.post(`/endScreens`, selectedContent);
      toast.success(`Screen added to the library.`);
    } catch (err) {
      console.log(err);
    }
    getScreenList();
  };

  const updateScreenInLibrary = async () => {
    try {
      await mainAPI.patch(
        `/endScreens/${selectedContent._id}`,
        selectedContent
      );
      toast.success(`Screen ${selectedContent.screen.name} updated.`);
    } catch (err) {
      console.log(err);
    }
    getScreenList();
  };

  return (
    <div className={`${styles.toolItem} ${styles.save}`}>
      <div
        className={styles.toolItemName}
        onClick={() => setShowContent(!showContent)}
      >
        <p>Save</p>
        <img src="/assets/campaign/toolSave.svg" />
      </div>

      {/* need to enable */}
      {showContent && (
        <div className={styles.toolItemContent}>
          <span className={styles.subtitle}>Change name</span>
          <div className={styles.nameInput}>
            <input
              placeholder={"enter text"}
              onChange={handleOnChange}
              value={selectedContent.screen.name}
              required
            />
          </div>
          <div className={styles.saveTemplate}>
            {!endScreenList.some(
              (elem) =>
                elem.type === "screen" && elem._id === selectedContent._id
            ) ? (
              <div onClick={addScreenToLibrary} className={styles.saveBtn}>
                Save as preset
              </div>
            ) : (
              <div onClick={updateScreenInLibrary} className={styles.saveBtn}>
                Update preset
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolItemSave;
