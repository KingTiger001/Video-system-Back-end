import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { ChromePicker } from 'react-color'
import { toast } from 'react-toastify'

import { useDebounce } from '@/hooks'

import { mainAPI, mediaAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import ImportButton from '@/components/Campaign/ImportButton'
import InputNumber from '@/components/InputNumber'
import PopupCreateHelloScreen from '@/components/Popups/PopupCreateHelloScreen'
import PopupDeleteHelloScreen from '@/components/Popups/PopupDeleteHelloScreen'
import PopupDeleteDraftHelloScreen from '@/components/Popups/PopupDeleteDraftHelloScreen'
import TextStyle from '@/components/Campaign/TextStyle'
import VideoRecorder from '@/components/Campaign/VideoRecorder/index'

import styles from '@/styles/components/Campaign/ToolDetails.module.sass'

const ToolDetails = () => {
  const router = useRouter()

  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const videoList = useSelector(state => state.campaign.videoList)
  const tool = useSelector(state => state.campaign.tool)
  
  const campaign = useSelector(state => state.campaign)
  const endScreen = useSelector(state => state.campaign.endScreen)
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const helloScreenList = useSelector(state => state.campaign.helloScreenList)
  const logo = useSelector(state => state.campaign.logo)
  const video = useSelector(state => state.campaign.video)

  const [displayVideoRecorder, showVideoRecorder] = useState(false)
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

  const saveCampaign = async () => await mainAPI.patch(`/campaigns/${router.query.campaignId}`, {
    ...campaign,
    video: video._id,
  })

  const saveHelloScreen = async () => {
    saveCampaign()
    toast.success('Hello screen saved.')
  }

  const saveLogo = async () => {
    saveCampaign()
    toast.success('Logo saved.')
  }

  const createOrSaveEndScreen = async () => {
    endScreen._id
      ?
        await mainAPI.patch(`/endScreens/${endScreen._id}`, endScreen)
      :
        await mainAPI.post('/endScreens', {
          ...endScreen,
          name: 'default',
        })
    saveCampaign()
    toast.success('End screen saved.')
  }

  const getHelloScreenList = async () => {
    const { data } = await mainAPI.get('/users/me/helloScreens')
    dispatch({
      type: 'SET_HELLO_SCREEN_LIST',
      data,
    })
  }

  return (
    tool !== 0 &&
    <div className={styles.toolDetails}>
      { displayVideoRecorder &&
        <VideoRecorder
          onClose={() => showVideoRecorder(false)}
          onDone={(file) => showPopup({
            display: 'UPLOAD_VIDEO',
            data: file,
          })}
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
      { popup.display === 'CREATE_HELLO_SCREEN' && 
        <PopupCreateHelloScreen
          onDone={() => {
            getHelloScreenList()
            toast.success('A new hello screen template has been created.')
            hidePopup()
          }}
        />
      }
      { popup.display === 'DELETE_HELLO_SCREEN' && 
        <PopupDeleteHelloScreen
          onDone={() => {
            getHelloScreenList()
            toast.success('Template deleted.')
            hidePopup()
          }}
        />
      }

      {/* RECORD TOOL */}
      { tool === 1 &&
        <div className={styles.toolRecord}>
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
        <div className={styles.toolVideos}>
          <p className={styles.toolName}>Videos</p>
          <div className={styles.videosList}>
            {
              videoList.map(video => 
                <div
                  key={video._id}
                  className={styles.videosItem}
                >
                  <p
                    className={styles.videosItemName}
                    onClick={() => dispatch({ type: 'SET_PREVIEW_VIDEO', data: video.url })}
                  >
                    {video.name}
                  </p>
                  { video.status === 'done'
                    ?
                    <p className={`${styles.videosItemStatus}`}>{secondsToMs(video.metadata.duration)} - {Math.round(video.metadata.size / 1000000)} mb</p>
                    :
                    <p className={`${styles.videosItemStatus} ${styles[video.status]}`}>{video.status}... {video.status === 'processing' && video.statusProgress ? `${video.statusProgress || 0}%` : ''}</p>
                  }
                  <img
                    onClick={() => {
                      dispatch({ type: 'SET_VIDEO', data: video })
                      dispatch({ type: 'SET_PROGRESSION', data: 0 })
                    }}
                    src="/assets/campaign/select.svg"
                  />
                  <img
                    onClick={() => showPopup({ display: 'DELETE_VIDEO', data: video })}
                    src="/assets/campaign/delete.svg"
                  />
                </div>
              )
            }
          </div>
        </div>
      }

      {/* HELLO SCREEN TOOL */}
      { tool === 3 &&
        <div className={styles.toolHelloScreen}>
          <p className={styles.toolName}>Hello Screen</p>
          { displayFormHelloScreen
            ?
            <div>
              <div className={styles.toolSection}>
                <label className={styles.toolLabel}>Background</label>
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
                <div className={styles.toolInputWithOptions}>
                  <input
                    className={styles.toolInput}
                    onChange={(e) => dispatch({
                      type: 'CHANGE_HELLO_SCREEN',
                      data: {
                        title: {
                          ...helloScreen.title,
                          value: e.target.value,
                        }
                      },
                    })}
                    value={helloScreen.title.value}
                  />
                  <img
                    onClick={(e) => dispatch({
                      type: 'CHANGE_HELLO_SCREEN',
                      data: {
                        title: {
                          ...helloScreen.title,
                          displayOptions: !helloScreen.title.displayOptions,
                        }
                      },
                    })}
                    src="/assets/campaign/options.svg"
                    style={{ display: helloScreen.title.displayOptions ? 'block' : ''}}
                  />
                </div>
                { helloScreen.title.displayOptions &&
                  <TextStyle
                    initialValues={helloScreen.title}
                    onChange={(textStyle) => dispatch({
                      type: 'CHANGE_HELLO_SCREEN',
                      data: {
                        title: {
                          ...helloScreen.title,
                          ...textStyle,
                        }
                      },
                    })}
                  />
                }
              </div>
              <div className={styles.toolSection}>
                <label className={styles.toolLabel}>Subtitle</label>
                <div className={styles.toolInputWithOptions}>
                  <input
                    className={styles.toolInput}
                    onChange={(e) => dispatch({
                      type: 'CHANGE_HELLO_SCREEN',
                      data: {
                        subtitle: {
                          ...helloScreen.subtitle,
                          value: e.target.value,
                        }
                      },
                    })}
                    value={helloScreen.subtitle.value}
                  />
                  <img
                    onClick={(e) => dispatch({
                      type: 'CHANGE_HELLO_SCREEN',
                      data: {
                        subtitle: {
                          ...helloScreen.subtitle,
                          displayOptions: !helloScreen.subtitle.displayOptions,
                        }
                      },
                    })}
                    src="/assets/campaign/options.svg"
                    style={{ display: helloScreen.subtitle.displayOptions ? 'block' : ''}}
                  />
                </div>
                { helloScreen.subtitle.displayOptions &&
                  <TextStyle
                    initialValues={helloScreen.subtitle}
                    onChange={(textStyle) => dispatch({
                      type: 'CHANGE_HELLO_SCREEN',
                      data: {
                        subtitle: {
                          ...helloScreen.subtitle,
                          ...textStyle,
                        }
                      },
                    })}
                  />
                }
              </div>
              <Button onClick={saveHelloScreen}>Save</Button>
              <Button
                onClick={() => showPopup({
                  display: 'CREATE_HELLO_SCREEN',
                  data: helloScreen,
                })}
                style="outline"
                type="div"
              >
                Save as template
              </Button>
              <p
                onClick={() => showFormHelloScreen(false)}
                className={styles.helloScreenBack}
              >
                Back
              </p>
            </div>
            :
            <div className={styles.toolSection}>
              {
                Object.keys(helloScreen).length > 1 &&
                <div className={styles.helloScreenDraft}>
                  <div className={styles.helloScreenItem}>
                    <p
                      onClick={() => {
                        dispatch({
                          type: 'SET_PREVIEW_HELLO_SCREEN',
                          data: {},
                        })
                      }}
                    >
                      Draft
                    </p>
                    <img
                      src="/assets/campaign/select.svg"
                      onClick={() => {
                        dispatch({
                          type: 'SET_PREVIEW_HELLO_SCREEN',
                          data: {},
                        })
                        showFormHelloScreen(true)
                      }}
                    />
                    <img
                      src="/assets/campaign/delete.svg"
                      onClick={() => showPopup({ display: 'DELETE_DRAFT_HELLO_SCREEN' })}
                    />
                  </div>
                </div>
              }
              {
                helloScreenList.length > 0 &&
                <div className={styles.helloScreenTemplates}>
                  <p>Templates</p>
                  <div className={styles.helloScreenList}>
                    { 
                      helloScreenList.map((hs) => (
                        <div
                          key={hs._id}
                          className={styles.helloScreenItem}
                        >
                          <p
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
                          <img
                            src="/assets/campaign/delete.svg"
                            onClick={() => showPopup({
                              display: 'DELETE_HELLO_SCREEN',
                              data: hs,
                            })}
                          />
                        </div>
                      ))
                    }
                  </div>
                </div>
              }
              <div
                className={styles.helloScreenAdd}
                onClick={() => {
                  dispatch({ type: 'ADD_HELLO_SCREEN' })
                  dispatch({
                    type: 'SET_PREVIEW_HELLO_SCREEN',
                    data: {},
                  })
                  showFormHelloScreen(true)
                }}
              >
                <img src="/assets/campaign/add.svg" />
                <p>Add hello screen</p>
              </div>
            </div>
          }
        </div>
      }

      {/* END SCREEN TOOL */}
      { tool === 4 &&
        <div className={styles.toolEndScreen}>
          <p className={styles.toolName}>End Screen</p>
          <div>
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
              <div className={styles.toolInputWithOptions}>
                <input
                  className={styles.toolInput}
                  onChange={(e) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      title: {
                        ...endScreen.title,
                        value: e.target.value
                      }
                    },
                  })}
                  value={endScreen.title.value}
                />
                <img
                  onClick={(e) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      title: {
                        ...endScreen.title,
                        displayOptions: !endScreen.title.displayOptions,
                      }
                    },
                  })}
                  src="/assets/campaign/options.svg"
                  style={{ display: endScreen.title.displayOptions ? 'block' : ''}}
                />
              </div>
              { endScreen.title.displayOptions &&
                <TextStyle
                  initialValues={endScreen.title}
                  onChange={(textStyle) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      title: {
                        ...endScreen.title,
                        ...textStyle,
                      }
                    },
                  })}
                />
              }
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Subtitle</label>
              <div className={styles.toolInputWithOptions}>
                <input
                  className={styles.toolInput}
                  onChange={(e) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      subtitle: {
                        ...endScreen.subtitle,
                        value: e.target.value,
                      }
                    },
                  })}
                  value={endScreen.subtitle.value}
                />
                <img
                  onClick={(e) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      subtitle: {
                        ...endScreen.subtitle,
                        displayOptions: !endScreen.subtitle.displayOptions,
                      }
                    },
                  })}
                  src="/assets/campaign/options.svg"
                  style={{ display: endScreen.subtitle.displayOptions ? 'block' : ''}}
                />
              </div>
              { endScreen.subtitle.displayOptions &&
                <TextStyle
                  initialValues={endScreen.subtitle}
                  onChange={(textStyle) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      subtitle: {
                        ...endScreen.subtitle,
                        ...textStyle,
                      }
                    },
                  })}
                />
              }
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Button</label>
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
                  placeholder="Link"
                  value={endScreen.button.href}
                />
              </div>
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Email</label>
              <div className={styles.toolInputWithOptions}>
                <input
                  className={styles.toolInput}
                  onChange={(e) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      email: {
                        ...endScreen.email,
                        value: e.target.value,
                      }
                    },
                  })}
                  value={endScreen.email.value}
                />
                <img
                  onClick={(e) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      email: {
                        ...endScreen.email,
                        displayOptions: !endScreen.email.displayOptions,
                      }
                    },
                  })}
                  src="/assets/campaign/options.svg"
                  style={{ display: endScreen.email.displayOptions ? 'block' : ''}}
                />
              </div>
              { endScreen.email.displayOptions &&
                <TextStyle
                  features={{
                    color: true,
                    fontSize: true,
                    fontWeight: true,
                  }}
                  initialValues={endScreen.email}
                  onChange={(textStyle) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      email: {
                        ...endScreen.email,
                        ...textStyle,
                      }
                    },
                  })}
                />
              }
            </div>
            <div className={styles.toolSection}>
              <label className={styles.toolLabel}>Phone</label>
              <div className={styles.toolInputWithOptions}>
                <input
                  className={styles.toolInput}
                  onChange={(e) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      phone: {
                        ...endScreen.phone,
                        value: e.target.value,
                      }
                    },
                  })}
                  value={endScreen.phone.value}
                />
                <img
                  onClick={() => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      phone: {
                        ...endScreen.phone,
                        displayOptions: !endScreen.phone.displayOptions,
                      }
                    },
                  })}
                  src="/assets/campaign/options.svg"
                  style={{ display: endScreen.phone.displayOptions ? 'block' : ''}}
                />
              </div>
              { endScreen.phone.displayOptions &&
                <TextStyle
                  features={{
                    color: true,
                    fontSize: true,
                    fontWeight: true,
                  }}
                  initialValues={endScreen.phone}
                  onChange={(textStyle) => dispatch({
                    type: 'CHANGE_END_SCREEN',
                    data: {
                      phone: {
                        ...endScreen.phone,
                        ...textStyle,
                      }
                    },
                  })}
                />
              }
            </div>
            <Button onClick={createOrSaveEndScreen}>Save</Button>
          </div>
        </div>
      }

      {/* LOGO TOOL */}
      { tool === 5 &&
        <div className={styles.toolLogo}>
          <p className={styles.toolName}>Logo</p>
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

export default ToolDetails