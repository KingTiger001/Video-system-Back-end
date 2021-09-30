import { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { mainAPI } from "@/plugins/axios";

import { ObjectID } from "bson";

import Button from "@/components/Button";
import InputWithTools from "@/components/Campaign/InputWithTools";
import PopupDeleteEndScreen from "@/components/Popups/PopupDeleteEndScreen";
import PopupDeleteDraftEndScreen from "@/components/Popups/PopupDeleteDraftEndScreen";

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

const ToolTemplate = ({ me }) => {
  const dispatch = useDispatch();
  const popup = useSelector((state) => state.popup);
  const hidePopup = () => dispatch({ type: "HIDE_POPUP" });
  const showPopup = (popupProps) =>
    dispatch({ type: "SHOW_POPUP", ...popupProps });

  const toolItem = useSelector((state) => state.campaign.toolItem);

  const endScreen = useSelector((state) => state.campaign.endScreen);
  const endScreenList = useSelector((state) => state.campaign.endScreenList);
  const preview = useSelector((state) => state.campaign.preview);
  const contents = useSelector((state) => state.campaign.contents);
  const previewEndScreen = useSelector(
    (state) => state.campaign.previewEndScreen
  );

  const [displayFormEndScreen, showFormEndScreen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showOptions, setShowOptions] = useState({
    display: false,
    data: null,
  });

  const addEndScreenToLibrary = async () => {
    try {
      if (!editMode) {
        const { data } = await mainAPI.post(`/endScreens`, endScreen);
        dispatch({
          type: "CHANGE_END_SCREEN",
          data,
        });
        toast.success(`End screen added to the library.`);
      } else {
        await mainAPI.patch(`/endScreens/${endScreen._id}`, endScreen);
        toast.success(`End screen ${endScreen.name} updated.`);
      }
      getEndScreenList();
      showFormEndScreen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getEndScreenList = async () => {
    const { data } = await mainAPI.get("/users/me/endScreens");
    dispatch({
      type: "SET_END_SCREEN_LIST",
      data,
    });
  };

  const addNetwork = () => {
    dispatch({
      type: "CHANGE_END_SCREEN",
      data: {
        networks: endScreen.networks
          ? [
              ...endScreen.networks,
              {
                id: endScreen.networks.length + 1,
                link: "",
              },
            ]
          : [
              {
                id: 1,
                link: "",
                site: "",
              },
            ],
      },
    });
  };

  const deleteNetwork = (id) => {
    const newArray = endScreen.networks.filter((network) => network.id !== id);
    dispatch({
      type: "CHANGE_END_SCREEN",
      data: {
        networks: newArray,
      },
    });
  };

  const updateNetwork = ({ index, property, value }) => {
    const newArray = [...endScreen.networks];
    newArray[index][property] = value;
    dispatch({
      type: "CHANGE_END_SCREEN",
      data: {
        networks: newArray,
      },
    });
  };

  const selectToolItem = (clickedTool) => {
    dispatch({
      type: "SELECT_TOOL_ITEM",
      data: clickedTool,
    });
    // if (isPlaying) {
    //   dispatch({ type: "PAUSE" });
    //   videosRef[currentVideo]?.pause();
    // }
    // if (clickedTool != 5) dispatch({ type: "SHOW_PREVIEW", data: { element } });
  };

  const addToContents = (data) => {
    const array = contents.slice();
    const id = new ObjectID();
    array.push({
      _id: id.toString(),
      position: array.length,
      type: "screen",
      screen: data,
    });
    return array;
  };

  return (
    toolItem === 1 && (
      <div
        // className={styles.toolEndScreen}
        onClick={() => {
          if (!preview.show) {
            dispatch({ type: "SHOW_PREVIEW" });
          }
        }}
      >
        {popup.display === "DELETE_DRAFT_END_SCREEN" && (
          <PopupDeleteDraftEndScreen
            onConfirm={() => {
              dispatch({ type: "RESET_END_SCREEN" });
              dispatch({ type: "SET_PROGRESSION", data: 0 });
              dispatch({ type: "CALC_DURATION" });
              hidePopup();
            }}
          />
        )}
        {popup.display === "DELETE_END_SCREEN" && (
          <PopupDeleteEndScreen
            onDone={() => {
              getEndScreenList();
              toast.success("End screen deleted.");
              hidePopup();
            }}
          />
        )}
        {displayFormEndScreen ? (
          <div>
            <p className={styles.toolTitle}>
              {editMode ? "Edit" : "Create"} End Screen
            </p>
            <p
              onClick={() => showFormEndScreen(false)}
              className={styles.toolBack}
            >
              &#8592; Back to my library
            </p>
            <div className={styles.toolAreaScrollable}>
              <div className={styles.toolSection}>
                <label className={styles.toolSubtitleH1}>
                  Name your End Screen*
                </label>
                <input
                  style={{ width: "50%" }}
                  className={styles.toolInput}
                  placeholder={"End Screen name"}
                  onChange={(e) =>
                    dispatch({
                      type: "CHANGE_END_SCREEN",
                      data: {
                        name: e.target.value,
                      },
                    })
                  }
                  value={endScreen.name}
                  required
                />
              </div>

              {/*  */}
              {console.log("endscreen.duration", endScreen.duration)}
              <div className={styles.toolSection}>
                <label className={styles.toolLabel}>Duration</label>
                <div className={styles.toolSlider}>
                  <RangeSliderContainer color={"#5F59F7"}>
                    <InputRange
                      maxValue={20}
                      minValue={1}
                      value={endScreen.duration}
                      onChange={(value) => {
                        dispatch({
                          type: "CHANGE_END_SCREEN",
                          data: {
                            duration: parseInt(value, 10),
                          },
                        });
                      }}
                    />
                  </RangeSliderContainer>
                </div>
              </div>

              {/* <div className={styles.spliter} />
              <div className={styles.toolSection}>
                <label className={styles.toolSubtitle}>Duration</label>
                <label className={styles.toolLabel}>Text line 1</label>
                <div className={styles.toolRange}>
                  <input type="range" />
                </div>
              </div> */}

              {/*  */}
              <div className={styles.spliter} />
              <div className={styles.toolSection}>
                <label className={styles.toolSubtitle}>
                  Background color
                  <div
                    onClick={() => setShowColor(!showColor)}
                    className={styles.toolShowColors}
                  >
                    Show colors
                    <img
                      src={
                        showColor
                          ? "/assets/common/expandLessPrimary.svg"
                          : "/assets/common/expandMorePrimary.svg"
                      }
                    />
                  </div>
                </label>
                {showColor && (
                  <ChromePicker
                    className={styles.colorPicker}
                    disableAlpha={true}
                    color={endScreen.background}
                    onChange={(color) =>
                      dispatch({
                        type: "CHANGE_END_SCREEN",
                        data: {
                          background: color.hex,
                        },
                      })
                    }
                  />
                )}
              </div>

              <div className={styles.spliter} />
              <div className={styles.toolSection}>
                <label className={styles.toolSubtitle}>Content</label>
                <label className={styles.toolLabel}>Text line 1</label>
                <InputWithTools
                  placeholder={"Text line 1"}
                  dispatchType="CHANGE_END_SCREEN"
                  me={me}
                  object={endScreen}
                  objectName="endScreen"
                  property="title"
                  toolStyle={true}
                  toolVariables={true}
                />
              </div>
              <div className={styles.toolSection}>
                <label className={styles.toolLabel}>Text line 2</label>
                <InputWithTools
                  placeholder={"Text line 2"}
                  dispatchType="CHANGE_END_SCREEN"
                  me={me}
                  object={endScreen}
                  objectName="endScreen"
                  property="subtitle"
                  toolStyle={true}
                  toolVariables={true}
                />
              </div>

              <p className={styles.toolSubtitle}>Add links</p>
              {(me.freeTrial || me.subscription.status === "active") && (
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>CTA</label>
                  <div className={styles.toolInputGrid}>
                    <input
                      className={styles.toolInput}
                      onChange={(e) =>
                        dispatch({
                          type: "CHANGE_END_SCREEN",
                          data: {
                            button: {
                              ...endScreen.button,
                              value: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="Text button"
                      value={endScreen.button ? endScreen.button.value : ""}
                    />
                    <input
                      className={styles.toolInput}
                      onChange={(e) =>
                        dispatch({
                          type: "CHANGE_END_SCREEN",
                          data: {
                            button: {
                              ...endScreen.button,
                              href: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="Copy link"
                      value={endScreen.button ? endScreen.button.href : ""}
                    />
                  </div>
                </div>
              )}
              <div className={styles.toolSection}>
                <label className={styles.toolLabel}>Email</label>
                <InputWithTools
                  me={me}
                  placeholder={"Example@domain.com"}
                  dispatchType="CHANGE_END_SCREEN"
                  object={endScreen}
                  objectName="endScreen"
                  property="email"
                  toolStyle={true}
                />
              </div>
              <div className={styles.toolSection}>
                <label className={styles.toolLabel}>Phone</label>
                <InputWithTools
                  me={me}
                  dispatchType="CHANGE_END_SCREEN"
                  object={endScreen}
                  objectName="endScreen"
                  property="phone"
                  toolStyle={true}
                />
              </div>
              {/* //TODO: FINISH THIS */}
              {/* <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Networks</label>
              <div className={styles.networks}>
                {
                  endScreen.networks && endScreen.networks.map((network, index) => (
                    <div
                      className={styles.network}
                      key={network.id}
                    >
                      <select
                        className={styles.networkSelect}
                        onChange={(e) => updateNetwork({ index, property: 'site', value: e.target.value })}
                        required
                        value={network.site}
                      >
                        <option value="facebook">FB</option>
                        <option value="twitter">TW</option>
                        <option value="pinterest">PIB</option>
                        <option value="linkedin">LKD</option>
                      </select>
                      <input
                        className={styles.toolInput}
                        onChange={(e) => updateNetwork({ index, property: 'link', value: e.target.value })}
                        placeholder="Copy profile link"
                        type="text"
                        value={network.link}
                      />
                      <img
                        className={styles.networkDelete}
                        onClick={() => deleteNetwork(network.id)}
                        src="/assets/common/close.svg"
                      />
                    </div>
                  ))
                }
                <p
                  className={styles.networkAdd}
                  onClick={addNetwork}
                >
                  Add more
                </p>
              </div>
            </div> */}
              <Button onClick={addEndScreenToLibrary} width="50%" type="div">
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.toolSection}>
            <p className={styles.toolTitle}>Screen</p>
            <p onClick={() => selectToolItem(0)} className={styles.toolBack}>
              &#8592; Back to items
            </p>
            <Button
              width={"auto"}
              onClick={() => {
                dispatch({ type: "ADD_END_SCREEN" });
                dispatch({
                  type: "SET_PREVIEW_END_SCREEN",
                  data: {},
                });
                dispatch({ type: "CALC_DURATION" });
                showFormEndScreen(true);
                setEditMode(false);
              }}
            >
              <div className={styles.toolAdd}>
                <img src="/assets/common/addW.svg" />
                <p>Create Screen</p>
              </div>
            </Button>
            <p className={styles.toolSubtitle}>Your Library</p>
            {endScreenList.length > 0 ? (
              <div className={styles.toolLibrary}>
                {endScreenList.map((es) => (
                  <div key={es._id} className={styles.toolLibraryItem}>
                    <p
                      className={`${styles.toolLibraryItemName} ${
                        previewEndScreen._id === es._id
                          ? styles.toolLibraryItemPreview
                          : endScreen._id === es._id
                          ? styles.toolLibraryItemSelected
                          : styles.toolLibraryItemNotSelected
                      }`}
                      onClick={() => {
                        console.log("select template", es);
                        dispatch({
                          type: "DISPLAY_ELEMENT",
                          data: "endScreen",
                        });
                        dispatch({
                          type: "SET_PREVIEW_END_SCREEN",
                          data: es,
                        });
                      }}
                    >
                      {es.name}
                    </p>
                    <div
                      className={styles.toolLibraryItemEdit}
                      onClick={() => {
                        const data = addToContents(es);
                        console.log("data", data);
                        dispatch({ type: "SET_VIDEO", data });
                        dispatch({ type: "CALC_VIDEOS_OFFSET", data });
                        dispatch({
                          type: "DISPLAY_ELEMENT",
                          data: "endScreen",
                        });
                        dispatch({
                          type: "CHANGE_END_SCREEN",
                          data: es,
                        });
                        dispatch({
                          type: "SET_PREVIEW_END_SCREEN",
                          data: {},
                        });

                        dispatch({ type: "CALC_DURATION" });
                      }}
                    >
                      <p>Select</p>
                    </div>
                    <div
                      className={styles.toolLibraryItemDelete}
                      onClick={() =>
                        setShowOptions({
                          data: es,
                          display: true,
                        })
                      }
                    >
                      <img src="/assets/common/more.svg" />
                      {showOptions.display && showOptions.data._id == es._id && (
                        <PopupOptions setAction={setShowOptions}>
                          <span
                            className={styles.PopupOption}
                            onClick={() => {
                              setShowOptions({
                                display: false,
                              });
                              dispatch({
                                type: "SET_PREVIEW_HELLO_SCREEN",
                                data: {},
                              });
                              dispatch({
                                type: "CHANGE_END_SCREEN",
                                data: es,
                              });

                              showFormEndScreen(true);
                              setEditMode(true);
                            }}
                          >
                            Edit
                          </span>
                          <span
                            className={styles.PopupOption}
                            onClick={() => {
                              setShowOptions({
                                display: false,
                              });
                              showPopup({
                                display: "DELETE_END_SCREEN",
                                data: es,
                              });
                            }}
                          >
                            Delete
                          </span>
                        </PopupOptions>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.toolDescription}>
                Here you will find your start screens created. Start by creating
                one by clicking just above!
              </p>
            )}
          </div>
        )}
      </div>
    )
  );
};

const PopupOptions = ({ setAction, children }) => {
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setAction({ display: false });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className={styles.popupOptions}>
      {children}
    </div>
  );
};
export default ToolTemplate;
