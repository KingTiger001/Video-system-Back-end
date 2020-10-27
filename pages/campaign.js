import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { ChromePicker } from 'react-color'

// import withAuth from '../hocs/withAuth'
import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { useDebounce, useVideoResize } from '@/hooks'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import Button from '@/components/Button'
import ImportButton from '@/components/ImportButton'
import PopupCreateHelloScreen from '@/components/Popups/PopupCreateHelloScreen'
import PopupDeleteVideo from '@/components/Popups/PopupDeleteVideo'
import PopupUploadVideo from '@/components/Popups/PopupUploadVideo'
import TextStyle from '@/components/Campaign/TextStyle'
import VideoRecorder from '@/components/Campaign/VideoRecorder/index'

import styles from '@/styles/pages/campaign.module.sass'

const Campaign = ({ initialHelloScreens, initialVideos, user }) => {
  const dispatch = useDispatch()
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  const popup = useSelector(state => state.popup)

  const [tool, setTool] = useState(0)
  const [file, setFile] = useState(null)
  const [displayVideoRecorder, showVideoRecorder] = useState(false)

  const [displayFormHelloScreen, showFormHelloScreen] = useState(false)
  
  const playerRef = useRef()
  const { width: playerWidth } = useVideoResize({ ref: playerRef, autoWidth: true })
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const [playerVideo, setPlayerVideo] = useState({})

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime(time => time + 100);
      }, 100);
    } else if (!isPlaying && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, time])
  
  const defaultHelloScreenValue = {
    background: '#000',
    title: {
      color: '#fff',
      displayOptions: false,
      fontSize: 35,
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1,
      textAlign: 'center',
      value: '',
    },
    subtitle: {
      color: '#fff',
      displayOptions: false,
      fontSize: 20,
      fontWeight: 400,
      letterSpacing: 0,
      lineHeight: 1,
      textAlign: 'center',
      value: '',
    },
  }
  const [helloScreensList, setHelloScreensList] = useState(initialHelloScreens)
  const [helloScreen, setHelloScreen] = useState({})

  const [endScreen, setEndScreen] = useState({
    background: '#000',
    title: {
      color: '#fff',
      displayOptions: false,
      fontSize: 35,
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1,
      textAlign: 'center',
      value: '',
    },
    subtitle: {
      color: '#fff',
      displayOptions: false,
      fontSize: 20,
      fontWeight: 400,
      letterSpacing: 0,
      lineHeight: 1,
      textAlign: 'center',
      value: '',
    },
    button: {
      value: '',
      href: '',
    },
    email: {
      color: '#fff',
      displayOptions: false,
      fontSize: 16,
      fontWeight: 400,
      value: '',
    },
    phone: {
      color: '#fff',
      displayOptions: false,
      fontSize: 16,
      fontWeight: 400,
      value: '',
    },
    show: false,
  })

  const saveTemplateHelloScreen = async () => {
    await mainAPI.post('/helloScreens', helloScreen)
    const { data } = await mainAPI.get('/users/me/helloScreens')
    setHelloScreensList(data)
  }

  const [videos, setVideos] = useState(initialVideos)

  const updateProcessingVideos = async () => {
    const processingVideos = videos.filter(video => video.status === 'processing' || video.status === 'waiting')
    if (processingVideos.length > 0) {
      const newVideosPromise = await Promise.all(processingVideos.map(video => mainAPI(`/videos/${video._id}`)))
      const newVideos = newVideosPromise.flat().map(video => video.data)
      setVideos(videos.map(video => {
        const videoProcessingFound = newVideos.find(newVideo => newVideo._id === video._id)
        return videoProcessingFound || video
      }))
    }
  }

  useDebounce(updateProcessingVideos, 3000, [videos])

  const getVideos = async () => {
    const { data } = await mainAPI('/users/me/videos')
    setVideos(data)
  }

  const selectTool = (clickedTool) => tool === clickedTool ? setTool(0) : setTool(clickedTool)

  const showHelloScreen = () => {
    setHelloScreen({ ...helloScreen, show: true })
    setEndScreen({ ...endScreen, show: false })
  }

  const showEndScreen = () => {
    setHelloScreen({ ...helloScreen, show: false })
    setEndScreen({ ...endScreen, show: true })
  }

  const showVideo = () => {
    setHelloScreen({ ...helloScreen, show: false })
    setEndScreen({ ...endScreen, show: false })
  }

  const playPause = () => {
    setIsPlaying(!isPlaying)
  }

  const displayTime = () => {
    const t = dayjs.duration(time)
    const m = t.minutes()
    const s = t.seconds()
    const ms = t.milliseconds()
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}:${ms.toString().substring(0, 1)}`
  }

  const secondsToMs = (d) => {
    d = Number(d);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const mDisplay = m > 0 ? `${m}m` : '';
    const sDisplay = s > 0 ? `${s}s` : '';
    return `${mDisplay}${sDisplay}`; 
  }

  return (
    <div className={styles.editing}>
      { displayVideoRecorder &&
        <VideoRecorder
          onClose={() => showVideoRecorder(false)}
          onDone={(file) => {
            showPopup({ display: 'UPLOAD_VIDEO' })
            setFile(file)
          }}
        />
      }
      { popup.display === 'UPLOAD_VIDEO' && 
        <PopupUploadVideo
          file={file}
          onClose={() => setFile(false)}
          onDone={() => {
            getVideos()
            setTool(2)
          }}
        />
      }
      { popup.display === 'DELETE_VIDEO' && 
        <PopupDeleteVideo
          onDone={getVideos}
        />
      }
      { popup.display === 'CREATE_HELLO_SCREEN' && 
        <PopupCreateHelloScreen
          helloScreen={helloScreen}
          onDone={getVideos}
        />
      }

      <div className={styles.header}>
        <Link href="/dashboard">
          <a className={styles.headerMenu}>
            <img src="/assets/editing/menu.svg" />
            <p>Back</p>
          </a>
        </Link>
        <div className={styles.headerVideoTitle}>
          <input
            placeholder="Campaign name"
          />
        </div>
        <div className={styles.headerActions}>
          <Button
            color="white"
            textColor="dark"
          >
            Save my campaign
          </Button>
          <Button>
            Share
          </Button>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.sidebar}>
          <ul className={styles.tools}>
            <li
              className={`${styles.tool} ${tool === 1 ? styles.toolSelected : ''}`}
              onClick={() => selectTool(1)}
            >
              <img src="/assets/editing/record.svg" />
              <p>Record</p>
            </li>
            <li
              className={`${styles.tool} ${tool === 2 ? styles.toolSelected : ''}`}
              onClick={() => {
                selectTool(2)
                showVideo()
              }}
            >
              <img src="/assets/editing/toolVideos.svg" />
              <p>Videos</p>
            </li>
            <li
              className={`${styles.tool} ${tool === 3 ? styles.toolSelected : ''}`}
              onClick={() => {
                selectTool(3)
                showHelloScreen()
              }}
            >
              <img src="/assets/editing/toolElement.svg" />
              <p>Hello Screen</p>
            </li>
            <li
              className={`${styles.tool} ${tool === 4 ? styles.toolSelected : ''}`}
              onClick={() => {
                selectTool(4)
                showEndScreen()
              }}
            >
              <img src="/assets/editing/toolElement.svg" />
              <p>End Screen</p>
            </li>
            <li
              className={`${styles.tool} ${tool === 5 ? styles.toolSelected : ''}`}
              onClick={() => selectTool(5)}
            >
              <img src="/assets/editing/toolLogo.svg" />
              <p>Logo</p>
            </li>
          </ul>

          { tool !== 0 &&
            <div className={styles.toolDetails}>
              { tool === 1 &&
                <div className={styles.toolRecord}>
                  <img
                    className={styles.toolRecordImage}
                    src="/assets/editing/record.svg"
                  />
                  <p className={styles.toolRecordName}>Record</p>
                  <p className={styles.toolRecordText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor </p>
                  <Button onClick={() => showVideoRecorder(true)}>
                    Start recording
                  </Button>
                  <ImportButton onChange={(e) => {
                    setFile(e.target.files[0])
                    showPopup({ display: 'UPLOAD_VIDEO' })
                    e.target.value = null
                  }}>
                    Import video
                  </ImportButton>
                </div>
              }
              { tool === 2 &&
                <div className={styles.toolVideos}>
                  <p className={styles.toolName}>Videos</p>
                  <div className={styles.videosList}>
                    {
                      videos.map(video => 
                        <div
                          key={video._id}
                          className={styles.videosItem}
                          onClick={() => setPlayerVideo(video)}
                        >
                          <p className={styles.videosItemName}>{video.name}</p>
                          { video.status === 'done'
                            ?
                            <p className={`${styles.videosItemStatus}`}>{secondsToMs(video.metadata.duration)} - {Math.round(video.metadata.size / 1000000)} mb</p>
                            :
                            <p className={`${styles.videosItemStatus} ${styles[video.status]}`}>{video.status}... {video.status === 'processing' && video.statusProgress ? `${video.statusProgress || 0}%` : ''}</p>
                          }
                          <img
                            onClick={() => showPopup({ display: 'DELETE_VIDEO', data: video })}
                            className={styles.videosItemDelete}
                            src="/assets/editing/delete.svg"
                          />
                        </div>
                      )
                    }
                  </div>
                </div>
              }
              { tool === 3 &&
                <div className={styles.toolHelloScreen}>
                  <p className={styles.toolName}>Hello Screen</p>
                  { displayFormHelloScreen
                    ?
                    <form>
                      <div className={styles.toolSection}>
                        <label className={styles.toolLabel}>Background</label>
                        <ChromePicker
                          className={styles.colorPicker}
                          disableAlpha={true}
                          color={helloScreen.background}
                          onChange={(color) => setHelloScreen({ ...helloScreen, background: color.hex })}
                        />
                      </div>
                      <div className={styles.toolSection}>
                        <label className={styles.toolLabel}>Title</label>
                        <div className={styles.toolInputWithOptions}>
                          <input
                            className={styles.toolInput}
                            onChange={(e) => setHelloScreen({
                              ...helloScreen,
                              title: {
                                ...helloScreen.title,
                                value: e.target.value,
                              }
                            })}
                            value={helloScreen.title.value}
                          />
                          <img
                            onClick={() => setHelloScreen({
                              ...helloScreen,
                              title: {
                                ...helloScreen.title,
                                displayOptions: !helloScreen.title.displayOptions,
                              }
                            })}
                            src="/assets/editing/options.svg"
                            style={{ display: helloScreen.title.displayOptions ? 'block' : ''}}
                          />
                        </div>
                        { helloScreen.title.displayOptions &&
                          <TextStyle
                            initialValues={helloScreen.title}
                            onChange={(textStyle) => setHelloScreen({
                              ...helloScreen,
                              title: {
                                ...helloScreen.title,
                                ...textStyle,
                              }
                            })}
                          />
                        }
                      </div>
                      <div className={styles.toolSection}>
                        <label className={styles.toolLabel}>Subtitle</label>
                        <div className={styles.toolInputWithOptions}>
                          <input
                            className={styles.toolInput}
                            onChange={(e) => setHelloScreen({
                              ...helloScreen,
                              subtitle: {
                                ...helloScreen.subtitle,
                                value: e.target.value,
                              }
                            })}
                            value={helloScreen.subtitle.value}
                          />
                          <img
                            onClick={() => setHelloScreen({
                              ...helloScreen,
                              subtitle: {
                                ...helloScreen.subtitle,
                                displayOptions: !helloScreen.subtitle.displayOptions,
                              }
                            })}
                            src="/assets/editing/options.svg"
                            style={{ display: helloScreen.subtitle.displayOptions ? 'block' : ''}}
                          />
                        </div>
                        { helloScreen.subtitle.displayOptions &&
                          <TextStyle
                            initialValues={helloScreen.subtitle}
                            onChange={(textStyle) => setHelloScreen({
                              ...helloScreen,
                              subtitle: {
                                ...helloScreen.subtitle,
                                ...textStyle,
                              }
                            })}
                          />
                        }
                      </div>
                      <Button>Save</Button>
                      <Button
                        onClick={() => showPopup({ display: 'CREATE_HELLO_SCREEN' })}
                        style="outline"
                        type="div"
                      >
                        Save as template
                      </Button>
                      <p
                        onClick={() => showFormHelloScreen(false)}
                      >
                        Cancel
                      </p>
                    </form>
                    :
                    <div className={styles.toolSection}>
                      { 
                        helloScreensList.map((hs) => (
                          <div key={hs._id}>{hs.name}</div>
                        ))
                      }
                      <div
                        className={styles.toolDetailsAdd}
                        onClick={() => {
                          setHelloScreen({
                            ...defaultHelloScreenValue,
                            show: true,
                          })
                        }}
                      >
                        <img src="/assets/editing/add.svg" />
                        <p>Add hello screen</p>
                      </div>
                    </div>
                  }
                </div>
              }
              { tool === 4 &&
                <div className={styles.toolEndScreen}>
                  <p className={styles.toolName}>End Screen</p>
                  <form>
                    <div className={styles.toolSection}>
                      <label className={styles.toolLabel}>Background</label>

                      <ChromePicker
                        className={styles.colorPicker}
                        disableAlpha={true}
                        color={endScreen.background}
                        onChange={(color) => setEndScreen({ ...endScreen, background: color.hex })}
                      />
                    </div>
                    <div className={styles.toolSection}>
                      <label className={styles.toolLabel}>Title</label>
                      <div className={styles.toolInputWithOptions}>
                        <input
                          className={styles.toolInput}
                          onChange={(e) => setEndScreen({
                            ...endScreen,
                            title: {
                              ...endScreen.title,
                              value: e.target.value,
                            }
                          })}
                          value={endScreen.title.value}
                        />
                        <img
                          onClick={() => setEndScreen({
                            ...endScreen,
                            title: {
                              ...endScreen.title,
                              displayOptions: !endScreen.title.displayOptions,
                            }
                          })}
                          src="/assets/editing/options.svg"
                          style={{ display: endScreen.title.displayOptions ? 'block' : ''}}
                        />
                      </div>
                      { endScreen.title.displayOptions &&
                        <TextStyle
                          initialValues={endScreen.title}
                          onChange={(textStyle) => setEndScreen({
                            ...endScreen,
                            title: {
                              ...endScreen.title,
                              ...textStyle,
                            }
                          })}
                        />
                      }
                    </div>
                    <div className={styles.toolSection}>
                      <label className={styles.toolLabel}>Subtitle</label>
                      <div className={styles.toolInputWithOptions}>
                        <input
                          className={styles.toolInput}
                          onChange={(e) => setEndScreen({
                            ...endScreen,
                            subtitle: {
                              ...endScreen.subtitle,
                              value: e.target.value,
                            }
                          })}
                          value={endScreen.subtitle.value}
                        />
                        <img
                          onClick={() => setEndScreen({
                            ...endScreen,
                            subtitle: {
                              ...endScreen.subtitle,
                              displayOptions: !endScreen.subtitle.displayOptions,
                            }
                          })}
                          src="/assets/editing/options.svg"
                          style={{ display: endScreen.subtitle.displayOptions ? 'block' : ''}}
                        />
                      </div>
                      { endScreen.subtitle.displayOptions &&
                        <TextStyle
                          initialValues={endScreen.subtitle}
                          onChange={(textStyle) => setEndScreen({
                            ...endScreen,
                            subtitle: {
                              ...endScreen.subtitle,
                              ...textStyle,
                            }
                          })}
                        />
                      }
                    </div>
                    <div className={styles.toolSection}>
                      <label className={styles.toolLabel}>Button</label>
                      <div className={styles.toolInputGrid}>
                        <input
                          className={styles.toolInput}
                          onChange={(e) => setEndScreen({
                            ...endScreen,
                            button: {
                              ...endScreen.button,
                              value: e.target.value,
                            }
                          })}
                          placeholder="Text"
                          value={endScreen.button.value}
                        />
                        <input
                          className={styles.toolInput}
                          onChange={(e) => setEndScreen({
                            ...endScreen,
                            button: {
                              ...endScreen.button,
                              href: e.target.value,
                            }
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
                          onChange={(e) => setEndScreen({
                            ...endScreen,
                            email: {
                              ...endScreen.email,
                              value: e.target.value,
                            }
                          })}
                          value={endScreen.email.value}
                        />
                        <img
                          onClick={() => setEndScreen({
                            ...endScreen,
                            email: {
                              ...endScreen.email,
                              displayOptions: !endScreen.email.displayOptions,
                            }
                          })}
                          src="/assets/editing/options.svg"
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
                          onChange={(textStyle) => setEndScreen({
                            ...endScreen,
                            email: {
                              ...endScreen.email,
                              ...textStyle,
                            }
                          })}
                        />
                      }
                    </div>
                    <div className={styles.toolSection}>
                      <label className={styles.toolLabel}>Phone</label>
                      <div className={styles.toolInputWithOptions}>
                        <input
                          className={styles.toolInput}
                          onChange={(e) => setEndScreen({
                            ...endScreen,
                            phone: {
                              ...endScreen.phone,
                              value: e.target.value,
                            }
                          })}
                          value={endScreen.phone.value}
                        />
                        <img
                          onClick={() => setEndScreen({
                            ...endScreen,
                            phone: {
                              ...endScreen.phone,
                              displayOptions: !endScreen.phone.displayOptions,
                            }
                          })}
                          src="/assets/editing/options.svg"
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
                          onChange={(textStyle) => setEndScreen({
                            ...endScreen,
                            phone: {
                              ...endScreen.phone,
                              ...textStyle,
                            }
                          })}
                        />
                      }
                    </div>
                    <Button>Save</Button>
                  </form>
                </div>
              }
              { tool === 5 &&
                <div>
                  <p className={styles.toolName}>Logo</p>
                </div>
              }
            </div>
          }
        </div>

        <div className={styles.player}>
          <div
            ref={playerRef}
            className={styles.video}
            style={{ width: playerWidth }}
          >
            { !helloScreen.show && !endScreen.show && playerVideo.url &&
              <video
                key={playerVideo._id}
                controls
                height="100%"
                width="100%"
              >
                <source src={playerVideo.url} type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
              </video>
            }
            { helloScreen.show &&
              <div
                className={styles.helloScreen}
                style={{ background: helloScreen.background }}
              >
                { helloScreen.title.value &&
                  <p
                    style={{
                      color: helloScreen.title.color,
                      fontSize: helloScreen.title.fontSize,
                      fontWeight: helloScreen.title.fontWeight,
                      letterSpacing: helloScreen.title.letterSpacing,
                      lineHeight: helloScreen.title.lineHeight,
                      textAlign: helloScreen.title.textAlign,
                      ...(helloScreen.title.letterSpacing > 0 && { paddingLeft: helloScreen.title.letterSpacing }),
                    }}
                  >
                    {helloScreen.title.value}
                  </p>
                }
                { helloScreen.subtitle.value &&
                  <p
                    style={{
                      color: helloScreen.subtitle.color,
                      fontSize: helloScreen.subtitle.fontSize,
                      fontWeight: helloScreen.subtitle.fontWeight,
                      letterSpacing: helloScreen.subtitle.letterSpacing,
                      lineHeight: helloScreen.subtitle.lineHeight,
                      textAlign: helloScreen.subtitle.textAlign,
                      ...(helloScreen.subtitle.letterSpacing > 0 && { paddingLeft: helloScreen.subtitle.letterSpacing }),
                    }}
                  >
                    {helloScreen.subtitle.value}
                  </p>
                }
              </div>
            }
            { endScreen.show && 
              <div
                className={styles.endScreen}
                style={{ background: endScreen.background }}
              >
                { endScreen.title.value &&
                  <p
                    style={{
                      color: endScreen.title.color,
                      fontSize: endScreen.title.fontSize,
                      fontWeight: endScreen.title.fontWeight,
                      letterSpacing: endScreen.title.letterSpacing,
                      lineHeight: endScreen.title.lineHeight,
                      textAlign: endScreen.title.textAlign,
                      ...(endScreen.title.letterSpacing > 0 && { paddingLeft: endScreen.title.letterSpacing }),
                    }}
                  >
                    {endScreen.title.value}
                  </p>
                }
                { endScreen.subtitle.value &&
                  <p
                    style={{
                      color: endScreen.subtitle.color,
                      fontSize: endScreen.subtitle.fontSize,
                      fontWeight: endScreen.subtitle.fontWeight,
                      letterSpacing: endScreen.subtitle.letterSpacing,
                      lineHeight: endScreen.subtitle.lineHeight,
                      textAlign: endScreen.subtitle.textAlign,
                      ...(endScreen.subtitle.letterSpacing > 0 && { paddingLeft: endScreen.subtitle.letterSpacing }),
                    }}
                  >
                    {endScreen.subtitle.value}
                  </p>
                }
                { endScreen.button.value &&
                  <Button
                    type="link"
                    href={endScreen.button.href}
                    color="white"
                  >
                    {endScreen.button.value}
                  </Button>
                }
                <div className={styles.endScreenFooter}>
                  { endScreen.email.value &&
                    <a
                      href={`mailto:${endScreen.email.value}`}
                      style={{
                        color: endScreen.email.color,
                        fontSize: endScreen.email.fontSize,
                        fontWeight: endScreen.email.fontWeight,
                      }}
                    >
                      {endScreen.email.value}
                    </a>
                  }
                  { endScreen.phone.value &&
                    <p
                      style={{
                        color: endScreen.phone.color,
                        fontSize: endScreen.phone.fontSize,
                        fontWeight: endScreen.phone.fontWeight,
                      }}
                    >
                      {endScreen.phone.value}
                    </p>
                  }
                </div>
              </div>
            }
          </div>
          <div className={styles.controls}>
            <img
              onClick={playPause}
              src={isPlaying ? '/assets/editing/pause.svg' : '/assets/editing/play.svg'}
            />
            <p className={styles.time}>{displayTime()}</p>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.timeline}>
          <div className={styles.helloScreen}>
            <p>Hello Screen</p>
          </div>
          <div className={styles.videoRecorded}>
            <p>Video recorded</p>
          </div>
          <div className={styles.endScreen}>
            <p>End Screen + CTA</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Campaign
export const getServerSideProps = withAuthServerSideProps(async (ctx, user) => {
  const { data: initialVideos } = await mainAPI('/users/me/videos')
  const { data: initialHelloScreens } = await mainAPI('/users/me/helloScreens')
  return {
    initialVideos,
    initialHelloScreens,
  }
});