import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { toast } from 'react-toastify'

// import withAuth from '../hocs/withAuth'
import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { initializeStore } from '@/store'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import PopupDeleteVideo from '@/components/Popups/PopupDeleteVideo'
import PopupUploadVideo from '@/components/Popups/PopupUploadVideo'
import Timeline from '@/components/Campaign/Timeline'
import Tools from '@/components/Campaign/Tools/index'
// import ToolBox from '@/components/Campaign/ToolBox'
import Player from '@/components/Campaign/Player'

import styles from '@/styles/pages/dashboardCampaign.module.sass'

const Campaign = ({ user }) => {
  const router = useRouter()

  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const ref = useRef()
  
  const duration = useSelector(state => state.campaign.duration)
  const endScreen = useSelector(state => state.campaign.endScreen)
  const hasChanges = useSelector(state => state.campaign.hasChanges)
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const logo = useSelector(state => state.campaign.logo)
  const name = useSelector(state => state.campaign.name)
  const preview = useSelector(state => state.campaign.preview)
  const timelineDraggable = useSelector(state => state.campaign.timelineDraggable)
  const video = useSelector(state => state.campaign.video)
  const videoRef = useSelector(state => state.campaign.videoRef)

  const [inputNameWidth, setInputNameWidth] = useState(0)

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
    setInputNameWidth((name.length + 1) * 16)
  }, [])

  // useEffect(() => {
  //   if (hasChanges) {
  //     window.onbeforeunload = confirmExit;
  //     function confirmExit() {
  //       return 'show warning'
  //     }
  //   } else {
  //     window.onbeforeunload = null
  //   }
  // }, [hasChanges])

  const saveCampaign = async () => {
    await mainAPI.patch(`/campaigns/${router.query.campaignId}`, {
      duration,
      endScreen,
      helloScreen,
      logo,
      name,
      ...(Object.keys(video).length > 0 && { video: video._id }),
    })
    dispatch({
      type: 'HAS_CHANGES',
      data: false
    })
  }

  const getVideos = async () => {
    const { data } = await mainAPI('/users/me/videos')
    dispatch({
      type: 'SET_VIDEO_LIST',
      data,
    })
  }

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const position = e.clientX - rect.left
    const progression = position / ref.current.offsetWidth * duration
    dispatch({ type: 'SET_PROGRESSION', data: progression })
    if (Object.keys(videoRef).length > 0) {
      const currentTime = (progression - helloScreen.duration) / 1000
      videoRef.currentTime = currentTime > 0 ? currentTime : 0 
    }
    if (preview.show) {
      dispatch({ type: 'HIDE_PREVIEW' })
    }
  }

  return (
    <div
      className={styles.dashboardCampaign}
      onMouseUp={() => dispatch({ type: 'TIMELINE_DRAGGABLE', data: false })}
      onMouseMove={(e) => timelineDraggable && seekTo(e)}
      ref={ref}
    >
      { popup.display === 'UPLOAD_VIDEO' && 
        <PopupUploadVideo
          onDone={() => {
            getVideos()
            dispatch({
              type: 'SELECT_TOOL',
              data: 2,
            })
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
            <img src="/assets/common/back.svg" />
            <p>Back</p>
          </a>
        </Link>
        <div className={styles.headerVideoTitle}>
          <input
            onChange={(e) => {
              dispatch({ type: 'SET_NAME', data: e.target.value })
              setInputNameWidth((e.target.value.length + 1) * 16)
            }}
            placeholder="Campaign name"
            style={{ width: inputNameWidth }}
            value={name}
          />
          <img
            src="/assets/campaign/pen.svg"
          />
        </div>
        <div className={styles.headerActions}>
          <Button
            color="white"
            onClick={() => {
              saveCampaign()
              toast.success('Campaign saved.')
            }}
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
        <Tools saveCampaign={saveCampaign} />

        <Player />
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
  const { data: endScreenList } = await mainAPI.get('/users/me/endScreens')
  const { data: helloScreenList } = await mainAPI.get('/users/me/helloScreens')

  try {
    dispatch({
      type: 'SET_VIDEO_LIST',
      data: videos,
    })
    dispatch({
      type: 'SET_END_SCREEN_LIST',
      data: endScreenList,
    })
    dispatch({
      type: 'SET_HELLO_SCREEN_LIST',
      data: helloScreenList,
    })
    dispatch({
      type: 'SET_CAMPAIGN',
      data: campaign,
    })
    dispatch({ type: 'SET_DURATION' })
  } catch (err) {
    console.log(err)
  }

  return {
    initialReduxState: reduxStore.getState()
  }
});