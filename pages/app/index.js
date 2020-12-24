import jscookie from 'js-cookie'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import AppLayout from '@/layouts/AppLayout'

import PopupWelcome from '@/components/Popups/PopupWelcome'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/dashboard.module.sass'

const Dashboard = ({ me }) => {
  return (
    <AppLayout>
      <Head>
        <title>Dashboard | FOMO</title>
      </Head>

      { (!me.popups || !me.popups.welcome) && 
        <PopupWelcome
          onClose={() => {
            console.log('on close passed')
            mainAPI.patch('/users/me', { 'popups.welcome': 1 })
          }}
        />
      }

      <div className={layoutStyles.container}>
        <h1 className={layoutStyles.title}>Hello {me.firstName} 👋</h1>
        <p>This is your dashboard</p>
      </div>
    </AppLayout>
  )
}

export default Dashboard
export const getServerSideProps = withAuthServerSideProps()