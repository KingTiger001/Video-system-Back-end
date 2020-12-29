import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { ChromePicker } from 'react-color'
import { toast } from 'react-toastify'

import { useDebounce } from '@/hooks'

import { mainAPI, mediaAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import ImportButton from '@/components/Campaign/ImportButton'
import InputNumber from '@/components/InputNumber'
import InputStyle from '@/components/Campaign/InputStyle'
import PopupDeleteEndScreen from '@/components/Popups/PopupDeleteEndScreen'
import PopupDeleteDraftEndScreen from '@/components/Popups/PopupDeleteDraftEndScreen'
import PopupDeleteHelloScreen from '@/components/Popups/PopupDeleteHelloScreen'
import PopupDeleteDraftHelloScreen from '@/components/Popups/PopupDeleteDraftHelloScreen'
import VideoRecorder from '@/components/Campaign/VideoRecorder/index'

import styles from '@/styles/components/Campaign/ToolBox.module.sass'

const ToolBox = ({ saveCampaign }) => {
  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const videoList = useSelector(state => state.campaign.videoList)
  const tool = useSelector(state => state.campaign.tool)
  
  const endScreen = useSelector(state => state.campaign.endScreen)
  const endScreenList = useSelector(state => state.campaign.endScreenList)
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const helloScreenList = useSelector(state => state.campaign.helloScreenList)
  const logo = useSelector(state => state.campaign.logo)
  const preview = useSelector(state => state.campaign.preview)
  const video = useSelector(state => state.campaign.video)

  const [displayVideoRecorder, showVideoRecorder] = useState(false)
  const [displayFormEndScreen, showFormEndScreen] = useState(false)
  const [displayFormHelloScreen, showFormHelloScreen] = useState(false)

  const secondsToMs = (d) => {
    d = Number(d);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const mDisplay = m > 0 ? `${m}m` : '';
    const sDisplay = s > 0 ? `${s}s` : '';
    return `${mDisplay}${sDisplay}`; 
  }

  const updateProcessingVideos = async () => {
    const processingVideos = videoList.filter(video => video.status === 'processing' || video.status === 'waiting')
    if (processingVideos.length > 0) {
      const newVideosPromise = await Promise.all(processingVideos.map(video => mainAPI(`/videos/${video._id}`)))
      const newVideos = newVideosPromise.flat().map(video => video.data)
      dispatch({
        type: 'SET_VIDEO_LIST',
        data: videoList.map(video => {
          const videoProcessingFound = newVideos.find(newVideo => newVideo._id === video._id)
          return videoProcessingFound || video
        }),
      })
    }
  }

  useDebounce(updateProcessingVideos, 3000, [videoList])

  const addEndScreenToLibrary = async () => {
    try {
      const data = { ...endScreen }
      delete data._id
      await mainAPI.post('/endScreens', data)
      toast.success('End screen added to the library.')
      getEndScreenList()
    } catch (err) {
      console.log(err)
    }
  }

  const addHelloScreenToLibrary = async () => {
    try {
      const data = { ...helloScreen }
      delete data._id
      await mainAPI.post('/helloScreens', data)
      toast.success('Start screen added to the library.')
      getHelloScreenList()
    } catch (err) {
      console.log(err)
    }
  }

  const closeToolbox = () => {
    dispatch({ type: 'SELECT_TOOL', data: 0 })
    setTimeout(() => dispatch({ type: 'HIDE_PREVIEW' }), 0)
  }

  const getEndScreenList = async () => {
    const { data } = await mainAPI.get('/users/me/endScreens')
    dispatch({
      type: 'SET_END_SCREEN_LIST',
      data,
    })
  }

  const getHelloScreenList = async () => {
    const { data } = await mainAPI.get('/users/me/helloScreens')
    dispatch({
      type: 'SET_HELLO_SCREEN_LIST',
      data,
    })
  }

  const saveEndScreen = async () => {
    await saveCampaign()
    toast.success('End screen saved.')
  }

  const saveHelloScreen = async () => {
    await saveCampaign()
    toast.success('Start screen saved.')
  }

  const saveLogo = async () => {
    await saveCampaign()
    toast.success('Logo saved.')
  }

  const uploadLogo = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'logos')
    formData.append('height', 300)
    formData.append('width', 300)
    const { data: url } = await mediaAPI.post('/images', formData)
    dispatch({
      type: 'CHANGE_LOGO',
      data: {
        value: url
      }
    })
    await mainAPI.patch('/users/me', {
      data: {
        logo: url,
      },
    })
  }

  return (
    tool !== 0 &&
    <div className={styles.toolBox}>
      { displayVideoRecorder &&
        <VideoRecorder
          onClose={() => showVideoRecorder(false)}
          onDone={(file) => showPopup({
            display: 'UPLOAD_VIDEO',
            data: file,
          })}
        />
      }
      { popup.display === 'DELETE_DRAFT_END_SCREEN' && 
        <PopupDeleteDraftEndScreen
          onConfirm={() => {
            dispatch({ type: 'RESET_END_SCREEN' })
            hidePopup()
          }}
        />
      }
      { popup.display === 'DELETE_END_SCREEN' && 
        <PopupDeleteEndScreen
          onDone={() => {
            getEndScreenList()
            toast.success('End screen deleted.')
            hidePopup()
          }}
        />
      }
      { popup.display === 'DELETE_DRAFT_HELLO_SCREEN' && 
        <PopupDeleteDraftHelloScreen
          onConfirm={() => {
            dispatch({ type: 'RESET_HELLO_SCREEN' })
            hidePopup()
          }}
        />
      }
      { popup.display === 'DELETE_HELLO_SCREEN' && 
        <PopupDeleteHelloScreen
          onDone={() => {
            getHelloScreenList()
            toast.success('Start screen deleted.')
            hidePopup()
          }}
        />
      }

      <img
        className={styles.close}
        onClick={closeToolbox}
        src="/assets/common/close.svg"
      />

      {/* RECORD TOOL */}
      { tool === 1 &&
        <div
          className={styles.toolRecord}
          onClick={() => {
            if (!preview.show) {
              dispatch({ type: 'SHOW_PREVIEW' })
            }
          }}
        >
          <img
            className={styles.toolRecordImage}
            src="/assets/campaign/record.svg"
          />
          <p className={styles.toolRecordName}>Record</p>
          <p className={styles.toolRecordText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor </p>
          <Button onClick={() => showVideoRecorder(true)}>
            Start recording
          </Button>
          <ImportButton onChange={(e) => {
            showPopup({
              display: 'UPLOAD_VIDEO',
              data: e.target.files[0],
            })
            e.target.value = null
          }}>
            Import video
          </ImportButton>
        </div>
      }

      {/* VIDEOS TOOL */}
      { tool === 2 &&
        <div
          className={styles.toolVideos}
          onClick={() => {
            if (!preview.show) {
              dispatch({ type: 'SHOW_PREVIEW' })
            }
          }}
        >
          <p className={styles.toolTitle}>Videos</p>
          <div className={styles.videosList}>
            {
              videoList.map(vd => 
                <div
                  key={vd._id}
                  className={`${styles.toolLibraryItem} ${styles.videosItem} ${vd._id === video._id ? styles.selected : ''}`}
                >
                  <p
                    className={styles.toolLibraryItemName}
                    onClick={() => dispatch({ type: 'SET_PREVIEW_VIDEO', data: vd })}
                  >
                    {vd.name}
                  </p>
                  { vd.status === 'done'
                    ?
                    <p className={`${styles.videosItemStatus}`}>{secondsToMs(vd.metadata.duration)} - {Math.round(vd.metadata.size / 1000000)} mb</p>
                    :
                    <p className={`${styles.videosItemStatus} ${styles[vd.status]}`}>{vd.status}... {vd.status === 'processing' && vd.statusProgress > 0 ? `${vd.statusProgress || 0}%` : ''}</p>
                  }

                  <div className={styles.toolLibraryItemEdit}>
                    {
                      vd._id !== video._id &&
                      <div
                        onClick={() => {
                          dispatch({ type: 'SET_VIDEO', data: vd })
                          dispatch({ type: 'SET_PROGRESSION', data: 0 })
                        }}
                      >
                        <img src="/assets/campaign/select.svg"/>
                        <p>Select</p>
                      </div>
                    }
                  </div>
                  <div
                    className={styles.toolLibraryItemDelete}
                    onClick={() => showPopup({ display: 'DELETE_VIDEO', data: vd })}
                  >
                    <img src="/assets/campaign/delete.svg" />
                    <p>Delete</p>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      }

      {/* HELLO SCREEN TOOL */}
      { tool === 3 &&
        <div
          className={styles.toolHelloScreen}
          onClick={() => {
            if (!preview.show) {
              dispatch({ type: 'SHOW_PREVIEW' })
            }
          }}
        >
          { displayFormHelloScreen
              ?
              <div>
                <p
                  onClick={() => showFormHelloScreen(false)}
                  className={styles.toolBack}
                >
                  &lt; Back to my library
                </p>
                <p className={styles.toolTitle}>Edit a Start Screen</p>
                <p className={styles.toolSubtitle}>Your start screen</p>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Template Name *</label>
                  <input
                    className={styles.toolInput}
                    onChange={(e) => dispatch({
                      type: 'CHANGE_HELLO_SCREEN',
                      data: {
                        name: e.target.value
                      },
                    })}
                    value={helloScreen.name}
                    required
                  />
                </div>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Background Color</label>
                  <ChromePicker
                    className={styles.colorPicker}
                    disableAlpha={true}
                    color={helloScreen.background}
                    onChange={(color) => dispatch({
                      type: 'CHANGE_HELLO_SCREEN',
                      data: {
                        background: color.hex,
                      },
                    })}
                  />
                </div>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Title</label>
                  <InputStyle
                    dispatchType="CHANGE_HELLO_SCREEN"
                    object={helloScreen}
                    property="title"
                  />
                </div>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Text</label>
                  <InputStyle
                    dispatchType="CHANGE_HELLO_SCREEN"
                    object={helloScreen}
                    property="subtitle"
                  />
                </div>
                <Button onClick={saveHelloScreen}>Save changes</Button>
                <Button
                  onClick={addHelloScreenToLibrary}
                  outline={true}
                  type="div"
                >
                  Add to my library
                </Button>
              </div>
              :
              <div className={styles.toolSection}>
                <p className={styles.toolTitle}>Start Screen</p>
                <div
                  className={styles.toolAdd}
                  onClick={() => {
                    dispatch({ type: 'ADD_HELLO_SCREEN' })
                    dispatch({
                      type: 'SET_PREVIEW_HELLO_SCREEN',
                      data: {},
                    })
                    dispatch({ type: 'CALC_DURATION' })
                    showFormHelloScreen(true)
                  }}
                >
                  <img src="/assets/campaign/add.svg" />
                  <p>Create a Start Screen</p>
                </div>
                {
                  Object.keys(helloScreen).length > 1 &&
                  <div>
                    <p className={styles.toolSubtitle}>Currently Selected</p>
                    <div className={styles.toolDraftItem}>
                      <p
                        className={styles.toolDraftItemName}
                        // onClick={() => {
                        //   dispatch({
                        //     type: 'SET_PREVIEW_HELLO_SCREEN',
                        //     data: {},
                        //   })
                        // }}
                      >
                        {helloScreen.name}
                      </p>
                      <div
                        className={styles.toolLibraryItemEdit}
                        onClick={() => {
                          dispatch({
                            type: 'SET_PREVIEW_HELLO_SCREEN',
                            data: {},
                          })
                          showFormHelloScreen(true)
                        }}
                      >
                        <img src="/assets/campaign/edit.svg" />
                        <p>Edit</p>
                      </div>
                      <div
                        className={styles.toolLibraryItemDelete}
                        onClick={() => showPopup({ display: 'DELETE_DRAFT_HELLO_SCREEN' })}
                      >
                        <img src="/assets/campaign/delete.svg" />
                        <p>Delete</p>
                      </div>
                    </div>
                  </div>
                }
                <p className={styles.toolSubtitle}>Your Library</p>
                {
                  helloScreenList.length > 0
                    ?
                    <div className={styles.toolLibrary}>
                      {
                        helloScreenList.map((hs) => (
                          <div
                            key={hs._id}
                            className={styles.toolLibraryItem}
                          >
                            <p
                              className={styles.toolLibraryItemName}
                              onClick={() => {
                                dispatch({ type: 'DISPLAY_ELEMENT', data: 'helloScreen' })
                                dispatch({
                                  type: 'SET_PREVIEW_HELLO_SCREEN',
                                  data: hs,
                                })
                              }}
                            >
                              {hs.name}
                            </p>
                            <div className={styles.toolLibraryItemEdit}>
                              <img
                                src="/assets/campaign/select.svg"
                                onClick={() => {
                                  dispatch({ type: 'DISPLAY_ELEMENT', data: 'helloScreen' })
                                  dispatch({
                                    type: 'CHANGE_HELLO_SCREEN',
                                    data: hs,
                                  })
                                  dispatch({
                                    type: 'SET_PREVIEW_HELLO_SCREEN',
                                    data: {},
                                  })
                                  showFormHelloScreen(true)
                                }}
                              />
                              <p>Select</p>
                            </div>
                            <div className={styles.toolLibraryItemDelete}>
                              <img
                                src="/assets/campaign/delete.svg"
                                onClick={() => showPopup({
                                  display: 'DELETE_HELLO_SCREEN',
                                  data: hs,
                                })}
                              />
                              <p>Delete</p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    :
                    <p className={styles.toolLibraryEmptyText}>Here you will find your first screens created. Start by creating one by clicking just above!</p>
                }
              </div>
          }
        </div>
      }

      {/* END SCREEN TOOL */}
      { tool === 4 &&
        <div
          className={styles.toolEndScreen}
          onClick={() => {
            if (!preview.show) {
              dispatch({ type: 'SHOW_PREVIEW' })
            }
          }}
        >
          { displayFormEndScreen
              ?
              <div>
                <p
                  onClick={() => showFormEndScreen(false)}
                  className={styles.toolBack}
                >
                  &lt; Back to my library
                </p>
                <p className={styles.toolTitle}>Edit an End Screen</p>
                <p className={styles.toolSubtitle}>Your End screen</p>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Template Name *</label>
                  <input
                    className={styles.toolInput}
                    onChange={(e) => dispatch({
                      type: 'CHANGE_END_SCREEN',
                      data: {
                        name: e.target.value
                      },
                    })}
                    value={endScreen.name}
                    required
                  />
                </div>
              
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Background</label>
                  <ChromePicker
                    className={styles.colorPicker}
                    disableAlpha={true}
                    color={endScreen.background}
                    onChange={(color) => dispatch({
                      type: 'CHANGE_END_SCREEN',
                      data: {
                        background: color.hex,
                      },
                    })}
                  />
                </div>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Title</label>
                  <InputStyle
                    dispatchType="CHANGE_END_SCREEN"
                    object={endScreen}
                    property="title"
                  />
                </div>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Text</label>
                  <InputStyle
                    dispatchType="CHANGE_END_SCREEN"
                    object={endScreen}
                    property="subtitle"
                  />
                </div>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Link Button</label>
                  <div className={styles.toolInputGrid}>
                    <input
                      className={styles.toolInput}
                      onChange={(e) => dispatch({
                        type: 'CHANGE_END_SCREEN',
                        data: {
                          button: {
                            ...endScreen.button,
                            value: e.target.value,
                          }
                        },
                      })}
                      placeholder="Text"
                      value={endScreen.button.value}
                    />
                    <input
                      className={styles.toolInput}
                      onChange={(e) => dispatch({
                        type: 'CHANGE_END_SCREEN',
                        data: {
                          button: {
                            ...endScreen.button,
                            href: e.target.value,
                          }
                        },
                      })}
                      placeholder="Copy link"
                      value={endScreen.button.href}
                    />
                  </div>
                </div>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Email</label>
                  <InputStyle
                    dispatchType="CHANGE_END_SCREEN"
                    object={endScreen}
                    property="email"
                  />
                </div>
                <div className={styles.toolSection}>
                  <label className={styles.toolLabel}>Phone</label>
                  <InputStyle
                    dispatchType="CHANGE_END_SCREEN"
                    object={endScreen}
                    property="phone"
                  />
                </div>
                <Button onClick={saveEndScreen}>Save changes</Button>
                <Button
                  onClick={addEndScreenToLibrary}
                  outline={true}
                  type="div"
                >
                  Add to my library
                </Button>
              </div>
              :
              <div className={styles.toolSection}>
                <p className={styles.toolTitle}>End Screen</p>
                <div
                  className={styles.toolAdd}
                  onClick={() => {
                    dispatch({ type: 'ADD_END_SCREEN' })
                    dispatch({
                      type: 'SET_PREVIEW_END_SCREEN',
                      data: {},
                    })
                    dispatch({ type: 'CALC_DURATION' })
                    showFormEndScreen(true)
                  }}
                >
                  <img src="/assets/campaign/add.svg" />
                  <p>Create an End Screen</p>
                </div>
                {
                  Object.keys(endScreen).length > 1 &&
                  <div>
                    <p className={styles.toolSubtitle}>Currently Selected</p>
                    <div className={styles.toolDraftItem}>
                      <p
                        className={styles.toolDraftItemName}
                        // onClick={() => {
                        //   dispatch({
                        //     type: 'SET_PREVIEW_HELLO_SCREEN',
                        //     data: {},
                        //   })
                        // }}
                      >
                        {endScreen.name}
                      </p>
                      <div
                        className={styles.toolLibraryItemEdit}
                        onClick={() => {
                          dispatch({
                            type: 'SET_PREVIEW_END_SCREEN',
                            data: {},
                          })
                          showFormEndScreen(true)
                        }}
                      >
                        <img src="/assets/campaign/edit.svg" />
                        <p>Edit</p>
                      </div>
                      <div
                        className={styles.toolLibraryItemDelete}
                        onClick={() => showPopup({ display: 'DELETE_DRAFT_END_SCREEN' })}
                      >
                        <img src="/assets/campaign/delete.svg" />
                        <p>Delete</p>
                      </div>
                    </div>
                  </div>
                }
                <p className={styles.toolSubtitle}>Your Library</p>
                {
                  endScreenList.length > 0
                    ?
                    <div className={styles.toolLibrary}>
                      {
                        endScreenList.map((es) => (
                          <div
                            key={es._id}
                            className={styles.toolLibraryItem}
                          >
                            <p
                              className={styles.toolLibraryItemName}
                              onClick={() => {
                                dispatch({ type: 'DISPLAY_ELEMENT', data: 'endScreen' })
                                dispatch({
                                  type: 'SET_PREVIEW_END_SCREEN',
                                  data: es,
                                })
                              }}
                            >
                              {es.name}
                            </p>
                            <div className={styles.toolLibraryItemEdit}>
                              <img
                                src="/assets/campaign/select.svg"
                                onClick={() => {
                                  dispatch({ type: 'DISPLAY_ELEMENT', data: 'endScreen' })
                                  dispatch({
                                    type: 'CHANGE_END_SCREEN',
                                    data: es,
                                  })
                                  dispatch({
                                    type: 'SET_PREVIEW_END_SCREEN',
                                    data: {},
                                  })
                                  showFormEndScreen(true)
                                }}
                              />
                              <p>Select</p>
                            </div>
                            <div className={styles.toolLibraryItemDelete}>
                              <img
                                src="/assets/campaign/delete.svg"
                                onClick={() => showPopup({
                                  display: 'DELETE_END_SCREEN',
                                  data: es,
                                })}
                              />
                              <p>Delete</p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    :
                    <p className={styles.toolLibraryEmptyText}>Here you will find your end screens created. Start by creating one by clicking just above!</p>
                }
              </div>
          }
        </div>
      }

      {/* LOGO TOOL */}
      { tool === 5 &&
        <div
          className={styles.toolLogo}
          onClick={() => {
            if (!preview.show) {
              dispatch({ type: 'SHOW_PREVIEW' })
            }
          }}
        >
          <p className={styles.toolTitle}>Logo</p>
          <div className={styles.toolSection}>
          { logo.value && 
            <div className={styles.logo}>
              <img src={logo.value} />
            </div>
          }
          <input
            accept="image/*"
            type="file"
            onChange={(e) => uploadLogo(e.target.files[0])}
          />
          </div>
          <div className={styles.toolSection}>
            <label className={styles.toolLabel}>Size</label>
            <InputNumber
              initialValue={logo.size}
              className={styles.toolInput}
              onChange={(value) => dispatch({
                type: 'CHANGE_LOGO',
                data: {
                  size: parseInt(value, 10),
                },
              })}
            />
          </div>
          <div className={styles.toolSection}>
            <label className={styles.toolLabel}>Placement</label>
            <div className={styles.placement}>
              <div
                className={`${logo.placement === 'top-left' ? styles.selected : ''}`}
                onClick={() => dispatch({
                  type: 'CHANGE_LOGO',
                  data: {
                    placement: 'top-left'
                  }
                })}
              />
              <div 
                className={`${logo.placement === 'top-right' ? styles.selected : ''}`}
                onClick={() => dispatch({
                  type: 'CHANGE_LOGO',
                  data: {
                    placement: 'top-right'
                  }
                })}
              />
              <div 
                className={`${logo.placement === 'bottom-left' ? styles.selected : ''}`}
                onClick={() => dispatch({
                  type: 'CHANGE_LOGO',
                  data: {
                    placement: 'bottom-left'
                  }
                })}
              />
              <div 
                className={`${logo.placement === 'bottom-right' ? styles.selected : ''}`}
                onClick={() => dispatch({
                  type: 'CHANGE_LOGO',
                  data: {
                    placement: 'bottom-right'
                  }
                })}
              />
            </div>
          </div>
          <Button onClick={saveLogo}>Save</Button>
        </div>
      }
    </div>

  )
}

export default ToolBox