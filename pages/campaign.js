import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'

// import withAuth from '../hocs/withAuth'
import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { useVideoResize } from '@/hooks'
import { initializeStore } from '@/store'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import Button from '@/components/Button'
import EndScreen from '@/components/Campaign/EndScreen'
import HelloScreen from '@/components/Campaign/HelloScreen'
import Logo from '@/components/Campaign/Logo'
import PopupDeleteVideo from '@/components/Popups/PopupDeleteVideo'
import PopupUploadVideo from '@/components/Popups/PopupUploadVideo'
import Tools from '@/components/Campaign/Tools'
import ToolDetails from '@/components/Campaign/ToolDetails'

import styles from '@/styles/pages/campaign.module.sass'

const Campaign = ({ user }) => {
  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  
  const logo = useSelector(state => state.campaign.logo)
  const displayElement = useSelector(state => state.campaign.displayElement)
  const isPlaying = useSelector(state => state.campaign.isPlaying)
  const time = useSelector(state => state.campaign.time)

  const playerRef = useRef()
  const { width: playerWidth } = useVideoResize({ ref: playerRef, autoWidth: true })

  // mounted
  useEffect(() => {
    if (user.logo && !logo.value) {
      dispatch({
        type: 'SET_LOGO',
        data: {
          value: user.logo
        }
      })
    }
  }, [])

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        dispatch({
          type: 'SET_TIME',
          data: time + 100,
        });
      }, 100);
    } else if (!isPlaying && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, time])

  const getVideos = async () => {
    const { data } = await mainAPI('/users/me/videos')
    dispatch({
      type: 'SET_VIDEOS',
      data,
    })
  }

  const displayTime = () => {
    const t = dayjs.duration(time)
    const m = t.minutes()
    const s = t.seconds()
    const ms = t.milliseconds()
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}:${ms.toString().substring(0, 1)}`
  }

  return (
    <div className={styles.editing}>
      { popup.display === 'UPLOAD_VIDEO' && 
        <PopupUploadVideo
          onDone={() => {
            getVideos()
            dispatch({
              type: 'SELECT_TOOL',
              value: 2,
            })
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
            <img src="/assets/campaign/menu.svg" />
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
          <Tools />
          <ToolDetails />
        </div>

        <div className={styles.player}>
          <div
            ref={playerRef}
            className={styles.video}
            style={{ width: playerWidth }}
          >
            { displayElement === 'video' &&
              <video
                // key={playerVideo._id}
                controls
                height="100%"
                width="100%"
              >
                {/* <source src={playerVideo.url} type="video/mp4" /> */}
                Sorry, your browser doesn't support embedded videos.
              </video>
            }
            { displayElement === 'helloScreen' && <HelloScreen />}
            { displayElement === 'endScreen' && <EndScreen /> }
            <Logo />
          </div>
          <div className={styles.controls}>
            <img
              // onClick={playPause}
              src={isPlaying ? '/assets/campaign/pause.svg' : '/assets/campaign/play.svg'}
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
  const reduxStore = initializeStore()
  const { dispatch } = reduxStore

  const { data: initialVideos } = await mainAPI('/users/me/videos')
  const { data: initialHelloScreenList } = await mainAPI('/users/me/helloScreens')

  dispatch({
    type: 'SET_VIDEOS',
    data: initialVideos,
  })
  dispatch({
    type: 'SET_HELLO_SCREEN_LIST',
    data: initialHelloScreenList
  })

  return {
    initialReduxState: reduxStore.getState()
  }
});