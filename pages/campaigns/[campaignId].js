import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import VideoPlayer from '@/components/VideoPlayer'

import styles from '@/styles/pages/campaign.module.sass'

const Campaign = ({ campaign }) => {
  return (
    <div className={styles.campaign}>
      <div>
        <h1>{campaign.name}</h1>
        <VideoPlayer data={campaign} />
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