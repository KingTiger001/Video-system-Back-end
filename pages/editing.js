import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'

// import withAuth from '../hocs/withAuth'
import withAuthServerSideProps from '../hocs/withAuthServerSideProps'

import { useDebounce, useVideoResize } from '../hooks'

import { mainAPI } from '../plugins/axios'
import dayjs from '../plugins/dayjs'

import Button from '../components/Button'
import ImportButton from '../components/ImportButton'
import PopupDeleteVideo from '../components/Popups/PopupDeleteVideo'
import PopupUploadVideo from '../components/Popups/PopupUploadVideo'
import VideoRecorder from '../components/VideoRecorder/index'

import styles from '../styles/pages/Editing.module.sass'

const Editing = ({ user, initialVideos }) => {
  const dispatch = useDispatch()
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })

  const playerRef = useRef()
  const { width: playerWidth } = useVideoResize({ ref: playerRef, autoWidth: true })
  const [tool, setTool] = useState(0)
  const [file, setFile] = useState('x')
  const [displayVideoRecorder, showVideoRecorder] = useState(false)
  
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const [playerVideo, setPlayerVideo] = useState({})

  const popup = useSelector(state => state.popup)

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
  }, [isPlaying, time]);

  
  const [helloScreen, setHelloScreen] = useState({
    background: '#000',
    title: {
      color: '#fff',
      fontSize: 35,
      fontWeight: 700,
      lineHeight: 1,
      showOptions: false,
      value: '',
    },
    subtitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 400,
      lineHeight: 1,
      showOptions: false,
      value: ''
    },
    show: false,
  })

  const [endScreen, setEndScreen] = useState({
    background: '#000',
    title: {
      color: '#fff',
      fontSize: 35,
      fontWeight: 700,
      lineHeight: 1,
      showOptions: false,
      value: '',
    },
    subtitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 400,
      lineHeight: 1,
      showOptions: false,
      value: ''
    },
    button: {
      value: ''
    },
    show: false,
  })

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

      <div className={styles.header}>
        <Link href="/dashboard">
          <a className={styles.headerMenu}>
            <img src="/assets/editing/menu.svg" />
            <p>Back</p>
          </a>
        </Link>
        <div className={styles.headerVideoTitle}>
          <input
            placeholder="Video name"
          />
        </div>
        <div className={styles.headerActions}>
          <Button
            color="white"
            textColor="dark"
          >
            Save my video
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
              <p className={styles.toolName}>Record</p>
            </li>
            <li
              className={`${styles.tool} ${tool === 2 ? styles.toolSelected : ''}`}
              onClick={() => {
                selectTool(2)
                showVideo()
              }}
            >
              <img src="/assets/editing/toolVideos.svg" />
              <p className={styles.toolName}>Videos</p>
            </li>
            <li
              className={`${styles.tool} ${tool === 3 ? styles.toolSelected : ''}`}
              onClick={() => {
                selectTool(3)
                showHelloScreen()
              }}
            >
              <img src="/assets/editing/toolElement.svg" />
              <p className={styles.toolName}>Hello Screen</p>
            </li>
            <li
              className={`${styles.tool} ${tool === 4 ? styles.toolSelected : ''}`}
              onClick={() => {
                selectTool(4)
                showEndScreen()
              }}
            >
              <img src="/assets/editing/toolElement.svg" />
              <p className={styles.toolName}>End Screen</p>
            </li>
            <li
              className={`${styles.tool} ${tool === 5 ? styles.toolSelected : ''}`}
              onClick={() => selectTool(5)}
            >
              <img src="/assets/editing/toolLogo.svg" />
              <p className={styles.toolName}>Logo</p>
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
                  <p className={styles.toolDetailsName}>Videos</p>
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
                <div>
                  <p className={styles.toolDetailsName}>Hello Screen</p>
                  <div className={styles.toolDetailsSection}>
                    <label className={styles.toolDetailsLabel}>Background</label>
                    <ul className={styles.toolDetailsBackgrounds}>
                      <li
                        onClick={() => setHelloScreen({ ...helloScreen, background: '#000' })}
                        style={{ background: '#000' }}
                        className={`${helloScreen.background === '#000' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setHelloScreen({ ...helloScreen, background: '#d63031' })}
                        style={{ background: '#d63031' }}
                        className={`${helloScreen.background === '#d63031' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setHelloScreen({ ...helloScreen, background: '#1dd1a1' })}
                        style={{ background: '#1dd1a1' }}
                        className={`${helloScreen.background === '#1dd1a1' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setHelloScreen({ ...helloScreen, background: '#6c5ce7' })}
                        style={{ background: '#6c5ce7' }}
                        className={`${helloScreen.background === '#6c5ce7' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setHelloScreen({ ...helloScreen, background: '#ff9f43' })}
                        style={{ background: '#ff9f43' }}
                        className={`${helloScreen.background === '#ff9f43' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setHelloScreen({ ...helloScreen, background: '#ff9ff3' })}
                        style={{ background: '#ff9ff3' }}
                        className={`${helloScreen.background === '#ff9ff3' ? styles.selected : ''}`}
                      />
                    </ul>
                  </div>
                  <div className={styles.toolDetailsSection}>
                    <label className={styles.toolDetailsLabel}>Title</label>
                    <input
                      className={styles.toolDetailsInput}
                      onChange={(e) => setHelloScreen({
                        ...helloScreen,
                        title: {
                          ...helloScreen.title,
                          value: e.target.value,
                        }
                      })}
                      value={helloScreen.title.value}
                    />
                  </div>
                  <div className={styles.toolDetailsSection}>
                    <label className={styles.toolDetailsLabel}>Subtitle</label>
                    <input
                      className={styles.toolDetailsInput}
                      onChange={(e) => setHelloScreen({
                        ...helloScreen,
                        subtitle: {
                          ...helloScreen.subtitle,
                          value: e.target.value,
                        }
                      })}
                      value={helloScreen.subtitle.value}
                    />
                  </div>
                </div>
              }
              { tool === 4 &&
                <div>
                  <p className={styles.toolDetailsName}>End Screen</p>
                  <div className={styles.toolDetailsSection}>
                    <label className={styles.toolDetailsLabel}>Background</label>
                    <ul className={styles.toolDetailsBackgrounds}>
                      <li
                        onClick={() => setEndScreen({ ...endScreen, background: '#000' })}
                        style={{ background: '#000' }}
                        className={`${endScreen.background === '#000' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setEndScreen({ ...endScreen, background: '#d63031' })}
                        style={{ background: '#d63031' }}
                        className={`${endScreen.background === '#d63031' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setEndScreen({ ...endScreen, background: '#1dd1a1' })}
                        style={{ background: '#1dd1a1' }}
                        className={`${endScreen.background === '#1dd1a1' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setEndScreen({ ...endScreen, background: '#6c5ce7' })}
                        style={{ background: '#6c5ce7' }}
                        className={`${endScreen.background === '#6c5ce7' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setEndScreen({ ...endScreen, background: '#ff9f43' })}
                        style={{ background: '#ff9f43' }}
                        className={`${endScreen.background === '#ff9f43' ? styles.selected : ''}`}
                      />
                      <li
                        onClick={() => setEndScreen({ ...endScreen, background: '#ff9ff3' })}
                        style={{ background: '#ff9ff3' }}
                        className={`${endScreen.background === '#ff9ff3' ? styles.selected : ''}`}
                      />
                    </ul>
                  </div>
                  <div className={styles.toolDetailsSection}>
                    <label className={styles.toolDetailsLabel}>Title</label>
                    <input
                      className={styles.toolDetailsInput}
                      onChange={(e) => setEndScreen({
                        ...endScreen,
                        title: {
                          ...endScreen.title,
                          value: e.target.value,
                        }
                      })}
                      value={endScreen.title.value}
                    />
                  </div>
                  <div className={styles.toolDetailsSection}>
                    <label className={styles.toolDetailsLabel}>Subtitle</label>
                    <input
                      className={styles.toolDetailsInput}
                      onChange={(e) => setEndScreen({
                        ...endScreen,
                        subtitle: {
                          ...endScreen.subtitle,
                          value: e.target.value,
                        }
                      })}
                      value={endScreen.subtitle.value}
                    />
                  </div>
                  <div className={styles.toolDetailsSection}>
                    <label className={styles.toolDetailsLabel}>Button text</label>
                    <input
                      className={styles.toolDetailsInput}
                      onChange={(e) => setEndScreen({
                        ...endScreen,
                        button: {
                          ...endScreen.button,
                          value: e.target.value,
                        }
                      })}
                      value={endScreen.button.value}
                    />
                  </div>
                
                </div>
              }
              { tool === 5 &&
                <div>
                  <p className={styles.toolDetailsName}>Logo</p>
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
                <p
                  style={{
                    color: helloScreen.title.color,
                    fontSize: helloScreen.title.fontSize,
                    fontWeight: helloScreen.title.fontWeight,
                    lineHeight: helloScreen.title.lineHeight,
                  }}
                >
                  {helloScreen.title.value}
                </p>
                <p
                  style={{
                    color: helloScreen.subtitle.color,
                    fontSize: helloScreen.subtitle.fontSize,
                    fontWeight: helloScreen.subtitle.fontWeight,
                    lineHeight: helloScreen.title.lineHeight,
                  }}
                >
                  {helloScreen.subtitle.value}
                </p>
              </div>
            }
            { endScreen.show && 
              <div
                className={styles.endScreen}
                style={{ background: endScreen.background }}
              >
                <p
                  style={{
                    color: endScreen.title.color,
                    fontSize: endScreen.title.fontSize,
                    fontWeight: endScreen.title.fontWeight,
                    lineHeight: endScreen.title.lineHeight,
                  }}
                >
                  {endScreen.title.value}
                </p>
                <p
                  style={{
                    color: endScreen.subtitle.color,
                    fontSize: endScreen.subtitle.fontSize,
                    fontWeight: endScreen.subtitle.fontWeight,
                    lineHeight: endScreen.title.lineHeight,
                  }}
                >
                  {endScreen.subtitle.value}
                </p>
                { endScreen.button.value && <Button color="white">{endScreen.button.value}</Button>}
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

export default Editing
export const getServerSideProps = withAuthServerSideProps(async (ctx, user) => {
  const { data: initialVideos } = await mainAPI('/users/me/videos')
  return {
    initialVideos
  }
});