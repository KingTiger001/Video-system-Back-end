import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { mainAPI } from '@/plugins/axios'

import AppLayout from '@/layouts/AppLayout'
import dayjs from '@/plugins/dayjs'

import Input from '@/components/Input'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/app/account.module.sass'

const Account = ({ me }) => {
  const router = useRouter()

  const [account, setAccount] = useState(me)

  return (
    <AppLayout>
      <Head>
        <title>Account | FOMO</title>
      </Head>

      <div className={layoutStyles.container}>
        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>Edit your account</h1>
          </div>
          <div className={layoutStyles.headerBottom} />
        </div>

        <form>
          <div>
            <label className={styles.label}>Company*</label>
            <Input
              onChange={(e) => setForm({
                ...form,
                company: e.target.value,
              })}
              type="text"
              required
              // value={form.company}
            />
          </div>
        </form>
      </div>
    </AppLayout>
  )
}

export default Account