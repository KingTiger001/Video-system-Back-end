import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { toast } from 'react-toastify'

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
import Timeline from '@/components/Campaign/Timeline'
import Tools from '@/components/Campaign/Tools'
import ToolDetails from '@/components/Campaign/ToolDetails'

import styles from '@/styles/pages/campaign.module.sass'

const Campaign = ({ user }) => {
  const router = useRouter()

  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  
  const campaign = useSelector(state => state.campaign)
  const duration = useSelector(state => state.campaign.duration)
  const logo = useSelector(state => state.campaign.logo)
  const name = useSelector(state => state.campaign.name)
  const isPlaying = useSelector(state => state.campaign.isPlaying)
  const preview = useSelector(state => state.campaign.preview)
  const progression = useSelector(state => state.campaign.progression)

  const playerRef = useRef()
  const { width: playerWidth } = useVideoResize({ ref: playerRef, autoWidth: true })

  // mounted
  useEffect(() => {
    if (user.logo && !logo.value) {
      dispatch({
        type: 'CHANGE_LOGO',
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
          type: 'SET_PROGRESSION',
          data: progression + 50,
        });
      }, 50);
    } else if (!isPlaying && progression !== 0) {
      clearInterval(interval);
    }
    if (progression >= duration) {
      dispatch({ type: 'PAUSE' });
      dispatch({
        type: 'SET_PROGRESSION',
        data: 0,
      });
    }
    return () => clearInterval(interval);
  }, [isPlaying, progression])

  const saveCampaign = async () => {
    await mainAPI.patch(`/campaigns/${router.query.campaignId}`, campaign)
    toast.success('Campaign saved.')
  }

  const getVideos = async () => {
    const { data } = await mainAPI('/users/me/videos')
    dispatch({
      type: 'SET_VIDEOS',
      data,
    })
  }

  const displayProgression = () => {
    const t = dayjs.duration(progression)
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
            hidePopup()
          }}
        />
      }
      { popup.display === 'DELETE_VIDEO' && 
        <PopupDeleteVideo
          onDone={() => {
            getVideos()
            hidePopup()
          }}
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
            onChange={(e) => dispatch({ type: 'SET_NAME', data: e.target.value })}
            placeholder="Campaign name"
            value={name}
          />
        </div>
        <div className={styles.headerActions}>
          <Button
            color="white"
            onClick={saveCampaign}
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
            { preview.show && 
              <div>
                { preview.element === 'video' &&
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
                { preview.element === 'helloScreen' && <HelloScreen />}
                { preview.element === 'endScreen' && <EndScreen /> }
                { preview.element === 'logo' && <Logo /> }
              </div>
            }
          </div>
          <div className={styles.controls}>
            <img
              onClick={() => dispatch({ type: isPlaying ? 'PAUSE' : 'PLAY' })}
              src={isPlaying ? '/assets/campaign/pause.svg' : '/assets/campaign/play.svg'}
            />
            <p className={styles.progression}>{displayProgression()}</p>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Timeline />
      </div>
    </div>
  )
}

export default Campaign
export const getServerSideProps = withAuthServerSideProps(async ({ params }, user) => {
  const reduxStore = initializeStore()
  const { dispatch } = reduxStore

  const { data: campaign } = await mainAPI.get(`/campaigns/${params.campaignId}`)
  const { data: videos } = await mainAPI.get('/users/me/videos')
  const { data: endScreens } = await mainAPI.get('/users/me/endScreens')
  const { data: helloScreenList } = await mainAPI.get('/users/me/helloScreens')

  dispatch({
    type: 'SET_CAMPAIGN',
    data: campaign,
  })
  dispatch({
    type: 'SET_VIDEOS',
    data: videos,
  })
  dispatch({
    type: 'CHANGE_END_SCREEN',
    data: endScreens[0],
  })
  dispatch({
    type: 'SET_HELLO_SCREEN_LIST',
    data: helloScreenList
  })

  return {
    initialReduxState: reduxStore.getState()
  }
});