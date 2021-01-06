import Link from 'next/link'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'
import VideoPlayer from '@/components/VideoPlayer'

import styles from '@/styles/pages/campaign.module.sass'

const Campaign = ({ campaign }) => {
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
        <h1 className={styles.title}>{campaign.user.firstName} has a message for you !</h1>
        <VideoPlayer data={campaign} />
        <div className={styles.reply}>
          <Button
            href={`mailto:${campaign.user.email}`}
            type="link"
          >
            Reply
          </Button>
          <p>You can replay to {campaign.user.firstName}</p>
        </div>
      </div>
    </div>
  )
}

export default Campaign
export const getServerSideProps = withAuthServerSideProps(async ({ params }, user) => {
  const { data: campaign } = await mainAPI.get(`/campaigns/${params.campaignId}`)
  return {
    campaign,
  }
});