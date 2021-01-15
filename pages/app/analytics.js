import Head from 'next/head'
import { useState } from 'react'

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
  const [analytics, setAnalytics] = useState(initialAnalytics)

  const displayDuration = (value) => {
    if (!value) {
      return '00:00'
    }
    const t = dayjs.duration(parseInt(value, 10))
    const m = t.minutes()
    const s = t.seconds()
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  }

  const renderAnalytic = (analytic = {}) => (
    <div
      className={styles.analyticItem}
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
              {analytics[analytic._id].displayReport ? 'Close report' : 'Open report'}
            </button>
          </div>
        )}
        renderEmpty={() => (
          <p>No analytics found.</p>
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
              <p>Subject</p>
              <p>{analytic.campaign.share.subject}</p>
            </div>
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
            text="Reply rate"
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
export const getServerSideProps = withAuthServerSideProps(async (ctx, user) => {
  let { data: initialAnalytics } = await mainAPI.get('/users/me/analytics')
  initialAnalytics = initialAnalytics
    .map(analytic => ({
      [analytic._id]: {
        ...analytic,
        displayReport: false,
      }
    }))
    .reduce(function(result, current) {
      return Object.assign(result, current);
    }, {});
  return {
    initialAnalytics,
  }
})