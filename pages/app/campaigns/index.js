import jscookie from 'js-cookie'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import withAuth from '@/hocs/withAuth'
import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import AppLayout from '@/layouts/AppLayout'

import Button from '@/components/Button'
import PopupDeleteCampaign from '@/components/Popups/PopupDeleteCampaign'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/dashboard.module.sass'

const Campaigns = ({ initialCampaigns }) => {
  const router = useRouter()
  
  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })
  
  const [campaigns, setCampaigns] = useState(initialCampaigns)

  const createCampaign = async () => {
    const { data: campaign } = await mainAPI.post('/campaigns')
    router.push(`/app/campaigns/${campaign._id}`)
  }

  const getCampaigns = async () => {
    const { data } = await mainAPI.get('/users/me/campaigns')
    setCampaigns(data)
  }

  const displayDuration = (value) => {
    if (!value) {
      return '00:00'
    }
    const t = dayjs.duration(parseInt(value, 10))
    const m = t.minutes()
    const s = t.seconds()
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  }

  return (
    <AppLayout>
      <Head>
        <title>Campaigns | FOMO</title>
      </Head>
      
      { popup.display === 'DELETE_CAMPAIGN' && 
        <PopupDeleteCampaign
          onDone={() => {
            getCampaigns()
            hidePopup()
          }}
        />
      }

      <div className={layoutStyles.container}>
        <h1 className={layoutStyles.title}>Your campaigns</h1>
        <div className={styles.campaigns}>
          <div className={styles.campaignsHeader}>
            <p>Name</p>
            <p>Created at</p>
            <p>Duration</p>
            <p>Actions</p>
          </div>
          <div className={styles.campaignsList}>
            {
              campaigns.length > 0
                ?
                  campaigns.map((campaign) => (
                    <div
                      className={styles.campaignsItem}
                      key={campaign._id}
                    >
                      <p>{campaign.name}</p>
                      <p>{dayjs(campaign.createdAt).format('MM/DD/YYYY')}</p>
                      <p>{displayDuration(campaign.duration)}</p>
                      <div className={styles.campaignsItemActions}>
                        <Link href={`/app/campaigns/${campaign._id}`}>
                          <a className={styles.action}>Edit</a>
                        </Link>
                        <span
                          className={styles.action}
                          onClick={() => showPopup({ display: 'DELETE_CAMPAIGN', data: campaign })}
                        >
                          Delete
                        </span>
                      </div>
                    </div>
                  ))
                :
                  <div className={styles.campaignsEmpty}>
                    <p>No campaign found.</p>
                    <Button onClick={createCampaign}>
                      Create a video campaign
                    </Button>
                  </div>
            }
          </div>
        </div>
      </div>
  
    </AppLayout>
  )
}

export default withAuth(Campaigns)
export const getServerSideProps = withAuthServerSideProps(async (ctx, user) => {
  const { data: initialCampaigns } = await mainAPI.get('/users/me/campaigns')
  return {
    initialCampaigns
  }
})