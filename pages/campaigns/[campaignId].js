import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import VideoPlayer from '@/components/VideoPlayer'

import styles from '@/styles/pages/campaign.module.sass'

const Campaign = ({ campaign }) => {
  const router = useRouter()

  const campaignId = router.query.campaignId
  const contactId = router.query.c

  const [viewDuration, setViewDuration] = useState(70)
  const viewDurationRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (contactId) {
      mainAPI.post(`/analytics/${campaignId}/opened?c=${contactId}`)
    }
    return () => {
      if (viewDurationRef.current > 0 && contactId) {
        mainAPI.post(`/analytics/${campaignId}/viewDuration`, { duration: viewDuration })
      }
    }
  }, [])

  useEffect(() => {
    const videoDuration = Math.round(campaign.duration / 1000)
    if (viewDuration > videoDuration) {
      setViewDuration(videoDuration)
      viewDurationRef.current = videoDuration
      return
    }
    viewDurationRef.current = viewDuration
  }, [campaign, viewDuration])

  useEffect(() => {
    let interval = null;
    if (!isPlaying) {
      clearInterval(interval)
    } else if (isPlaying) {
      interval = setInterval(() => {
        setViewDuration(duration => duration + 1)
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying])

  const reply = () => {
    if (contactId) {
      mainAPI.post(`/analytics/${campaignId}/replied?c=${contactId}`)
    }
    window.location = `mailto:${campaign.user.email}`
  }

  return (
    <div className={styles.campaign}>

      <div className={styles.header}>
        <div className={styles.container}>
          <Link href="/">
            <a className={styles.logo}>
              <img src="/logo-simple.svg" />
            </a>
          </Link>
          <Button
            href="/"
            outline={true}
            type="link"
          >
            Discover Fomo
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{campaign.user.firstName} from {campaign.user.company} sent you a video message</h1>
        <VideoPlayer
          data={campaign}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <div className={styles.reply}>
          <Button onClick={reply}>
            Reply
          </Button>
          <p>You can reply to {campaign.user.firstName}</p>
        </div>
      </div>
    </div>
  )
}

export default Campaign
export const getServerSideProps = async ({ params }) => {
  const { data: campaign } = await mainAPI.get(`/campaigns/${params.campaignId}`)
  return {
    props: {
      campaign,
    },
  }
};