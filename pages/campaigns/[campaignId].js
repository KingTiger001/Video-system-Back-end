import { useRouter } from 'next/router'
import { useEffect } from 'react'
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
  
  const campaign = useSelector(state => state.campaign)
  const logo = useSelector(state => state.campaign.logo)
  const name = useSelector(state => state.campaign.name)

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