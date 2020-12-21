import Head from 'next/head'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import AppLayout from '@/layouts/AppLayout'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/dashboard.module.sass'

const Contacts = ({}) => {
  return (
    <AppLayout>
      <Head>
        <title>Contacts | FOMO</title>
      </Head>

      <div className={layoutStyles.container}>
        <h1 className={layoutStyles.title}>Contacts</h1>
      </div>
    </AppLayout>
  )
}

export default Contacts
export const getServerSideProps = withAuthServerSideProps()