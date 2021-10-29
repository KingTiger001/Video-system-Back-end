import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { mainAPI, mediaAPI } from "@/plugins/axios";

import Button from "@/components/Button";
import InputNumber from "@/components/InputNumber";

import styles from "@/styles/components/Campaign/Tools.module.sass";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
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

const ToolLogo = () => {
  const closeToolbox = () => {
    dispatch({ type: "SELECT_TOOL", data: 0 });
    setTimeout(() => dispatch({ type: "HIDE_PREVIEW" }), 0);
  };

  const dispatch = useDispatch();

  const tool = useSelector((state) => state.campaign.tool);

  const logo = useSelector((state) => state.campaign.logo);
  const preview = useSelector((state) => state.campaign.preview);

  const [error, setError] = useState("");
  const [uploadloading, setUploadloading] = useState(false);

  const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "logos");
    formData.append("width", 300);
    try {
      setUploadloading(true);
      const { data: url } = await mediaAPI.post("/images", formData);
      dispatch({
        type: "CHANGE_LOGO",
        data: {
          value: url,
        },
      });
      await mainAPI.patch("/users/me", {
        data: {
          logo: url,
        },
      });
    } catch (err) {
      const code = err.response && err.response.data;
      if (code === "Upload.incorrectFiletype") {
        setError("Only .jpg and .png images are accepted.");
      } else {
        setError("Upload failed.");
      }
    } finally {
      setUploadloading(false);
      setTimeout(() => setError(""), 5000);
    }
  };

  const removeLogo = async () => {
    await mediaAPI.delete("/", {
      data: {
        url: logo.value,
      },
    });
    await mainAPI.patch("/users/me", {
      data: {
        logo: null,
      },
    });
    dispatch({
      type: "CHANGE_LOGO",
      data: {
        value: null,
      },
    });
  };

  return (
    tool === 5 && (
      <div
        className={styles.toolLogo}
        onClick={() => {
          if (!preview.show) {
            // dispatch({ type: "SHOW_PREVIEW" });
          }
        }}
      >
        <span className={styles.toolTitleSection}>
          <div onClick={closeToolbox} className={styles.backArrow}>
            <img src="/assets/campaign/backArrow.svg" />{" "}
          </div>
          <p className={styles.toolTitle}>Logo</p>
        </span>
        <div className={styles.toolSection}>
          <label className={styles.toolLabel}>Add Logo</label>
          <div className={styles.content}>
            <label className={styles.logo} htmlFor="logo">
              {!uploadloading && !logo.value && (
                <img className={styles.add} src="/assets/common/add.svg" />
              )}
              {uploadloading && (
                <div className={styles.loading}>
                  <img src="/assets/common/loader.svg" />
                </div>
              )}
              {logo.value && <img className={styles.image} src={logo.value} />}
            </label>
            <input
              accept="image/*"
              id="logo"
              type="file"
              onChange={(e) => uploadLogo(e.target.files[0])}
              className={styles.logoInput}
            />
            {logo.value && (
              <p className={styles.logoRemove} onClick={removeLogo}>
                Remove
              </p>
            )}
            {/* <p className={styles.logoRecoSize}>(Recommended size: 300x300)</p> */}
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
        <div className={styles.toolSection}>
          <label className={styles.toolLabel}>Size</label>
          <div className={styles.toolSlider}>
            <RangeSliderContainer color={"#5F59F7"}>
              <InputRange
                maxValue={100}
                minValue={0}
                step={10}
                formatLabel={(value) => value / 10}
                value={logo.size}
                onChange={(value) => {
                  dispatch({
                    type: "CHANGE_LOGO",
                    data: {
                      size: parseInt(value, 10),
                    },
                  });
                }}
              />
            </RangeSliderContainer>
          </div>
        </div>
        <div className={styles.toolSection}>
          <label className={styles.toolLabel}>Position</label>
          <div className={styles.placement}>
            <div
              className={`${
                logo.placement === "top-left" ? styles.selected : ""
              }`}
              onClick={() => {
                dispatch({
                  type: "CHANGE_LOGO",
                  data: {
                    placement: "top-left",
                  },
                });
              }}
            />
            <div
              className={`${
                logo.placement === "top-right" ? styles.selected : ""
              }`}
              onClick={() => {
                dispatch({
                  type: "CHANGE_LOGO",
                  data: {
                    placement: "top-right",
                  },
                });
              }}
            />
            <div
              className={`${
                logo.placement === "bottom-left" ? styles.selected : ""
              }`}
              onClick={() => {
                dispatch({
                  type: "CHANGE_LOGO",
                  data: {
                    placement: "bottom-left",
                  },
                });
              }}
            />
            <div
              className={`${
                logo.placement === "bottom-right" ? styles.selected : ""
              }`}
              onClick={() => {
                dispatch({
                  type: "CHANGE_LOGO",
                  data: {
                    placement: "bottom-right",
                  },
                });
              }}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default ToolLogo;
