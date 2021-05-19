import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import AppLayout from '@/layouts/AppLayout'
import dayjs from '@/plugins/dayjs'

import ListHeader from '@/components/ListHeader'
import ListItem from '@/components/ListItem'
import Stat from '@/components/Stat'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/app/analytics.module.sass'

const Analytics = ({ initialAnalytics }) => {
  const router = useRouter()

  const [analytics, setAnalytics] = useState(initialAnalytics)

  useEffect(() => {
    const campaignId = router.query.c
    if (campaignId) {
      const el = document.getElementById(campaignId)
      if (el) {
        el.scrollIntoView()
      }
    }
  }, [])

  const displayDuration = (value) => {
    if (!value) {
      return '0:00'
    }
    const t = dayjs.duration(parseInt(Math.round(value), 10))
    const m = t.minutes()
    const s = t.seconds()
    return `${m}:${s < 10 ? `0${s}` : s}`
  }

  const renderAnalytic = (analytic = {}) => (
    <div
      className={styles.analyticItem}
      id={analytic.campaign ? analytic.campaign._id : ''}
      key={analytic._id}
    >
      <ListItem
        className={styles.analyticItemDetails}
        empty={Object.keys(analytic).length > 0 ? false : true}
        renderActions={() => (
          <div>
            <button
              onClick={() => setAnalytics({
                ...analytics,
                [analytic._id]: {
                  ...analytics[analytic._id],
                  displayReport: !analytics[analytic._id].displayReport,
                },
              })}
            >
              {analytics[analytic._id].displayReport ? 'Close Analytics' : 'Analytics'}
            </button>
          </div>
        )}
        renderEmpty={() => (
          <p>No analytics yet.</p>
        )}
      >
        <p><b>#{analytic.campaign && analytic.campaign.uniqueId}</b></p>
        <p>{analytic.campaign && analytic.campaign.name}</p>
        <p>{analytic.campaign && dayjs(analytic.campaign.sentAt).format('MM/DD/YYYY')}</p>
        <span>{analytic.sentTo && analytic.sentTo.length}</span>
        <p>{analytic.campaign && displayDuration(analytic.campaign.duration)}</p>
      </ListItem>
      { analytic.displayReport && 
        <div className={styles.analyticItemStats}>
          <div className={styles.analyticItemStatsText}>
            <div>
              <p>From</p>
              <p>{analytic.campaign.share.from}</p>
            </div>
            <div>
              <p>Message</p>
              <p>{analytic.campaign.share.message}</p>
            </div>
          </div>
          <Stat
            text="Video opening rate"
            unit="%"
            value={analytic.openingRate}
          />
          <Stat
            text="Average view duration"
            unit="s"
            value={displayDuration(analytic.averageViewDuration * 1000)}
          />
          <Stat
            text="Reply button click through rate"
            unit="%"
            value={analytic.replyRate}
          />
        </div>
      }
    </div>
  )

  return (
    <AppLayout>
      <Head>
        <title>Analytics | FOMO</title>
      </Head>

      <div className={layoutStyles.container}>
        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>Analytics</h1>
          </div>
        </div>

        <ListHeader className={styles.analyticsHeader}>
          <p>ID</p>
          <p>Video name</p>
          <p>Sent date</p>
          <p>Recipients</p>
          <p>Duration</p>
          <p>Actions</p>
        </ListHeader>

        <div className={styles.analyticsList}>
          { Object.values(analytics).length > 0 && Object.values(analytics).map((analytic) => renderAnalytic(analytic)) }
          { Object.values(analytics).length <= 0 && renderAnalytic() }
        </div>
      </div>
    </AppLayout>
  )
}

export default Analytics
export const getServerSideProps = withAuthServerSideProps(async ({ query }) => {
  let { data: initialAnalytics } = await mainAPI.get('/users/me/analytics')
  const campaignId = query.c
  initialAnalytics = initialAnalytics
    .map(analytic => ({
      [analytic._id]: {
        ...analytic,
        displayReport: campaignId && analytic.campaign && campaignId === analytic.campaign._id ? true : false,
      }
    }))
    .reduce(function(result, current) {
      return Object.assign(result, current);
    }, {});
  return {
    initialAnalytics,
  }
})