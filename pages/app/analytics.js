import Head from 'next/head'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import AppLayout from '@/layouts/AppLayout'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/dashboard.module.sass'

const Analytics = ({}) => {
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
      </div>
    </AppLayout>
  )
}

export default Analytics
export const getServerSideProps = withAuthServerSideProps()