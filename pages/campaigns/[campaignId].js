import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
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
import Tools from '@/components/Campaign/Tools'
import ToolDetails from '@/components/Campaign/ToolDetails'
import Player from '@/components/Campaign/Player'

import styles from '@/styles/pages/campaign.module.sass'

const Campaign = ({ user }) => {
  const router = useRouter()

  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const ref = useRef()
  
  const campaign = useSelector(state => state.campaign)
  const duration = useSelector(state => state.campaign.duration)
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const logo = useSelector(state => state.campaign.logo)
  const name = useSelector(state => state.campaign.name)
  const preview = useSelector(state => state.campaign.preview)
  const timelineDraggable = useSelector(state => state.campaign.timelineDraggable)
  const videoRef = useSelector(state => state.campaign.videoRef)

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

  const saveCampaign = async () => {
    await mainAPI.patch(`/campaigns/${router.query.campaignId}`, campaign)
    toast.success('Campaign saved.')
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
    if (videoRef.current) {
      const currentTime = (progression - helloScreen.duration) / 1000
      videoRef.current.currentTime = currentTime > 0 ? currentTime : 0 
    }
    if (preview.show) {
      dispatch({ type: 'HIDE_PREVIEW' })
      dispatch({ type: 'SELECT_TOOL', data: 0 })
    }
  }


  return (
    <div
      className={styles.editing}
      onMouseUp={(e) => dispatch({ type: 'TIMELINE_DRAGGABLE', data: false })}
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
  const { data: endScreens } = await mainAPI.get('/users/me/endScreens')
  const { data: helloScreenList } = await mainAPI.get('/users/me/helloScreens')

  try {
    dispatch({
      type: 'CHANGE_END_SCREEN',
      data: endScreens[0],
    })
    dispatch({
      type: 'SET_VIDEO_LIST',
      data: videos,
    })
    dispatch({
      type: 'SET_HELLO_SCREEN_LIST',
      data: helloScreenList
    })
    dispatch({
      type: 'SET_CAMPAIGN',
      data: campaign,
    })
    dispatch({
      type: 'SET_DURATION',
    })
  } catch (err) {
    console.log(err)
  }

  return {
    initialReduxState: reduxStore.getState()
  }
});