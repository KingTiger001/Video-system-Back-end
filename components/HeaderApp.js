import jscookie from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'

import styles from '@/styles/components/HeaderApp.module.sass'

const HeaderApp = () => {
  const router = useRouter()

  const createCampaign = async () => {
    const { data: campaign } = await mainAPI.post('/campaigns')
    router.push(`/app/campaigns/${campaign._id}`)
  }

  const logout = () => {
    router.push('/login')
    jscookie.remove('fo_sas_tk')
  }

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <Link href="/app">
          <a className={styles.logo}>
            <img src="/logo-simple.svg" />
          </a>
        </Link>

        <nav className={styles.menu}>
          <Link href="/app/campaigns">
            <a className={router.route === '/app/campaigns' ? styles.selected : ''}>Videos campaigns</a>
          </Link>
          <Link href="/app/analytics">
            <a className={router.route === '/app/analytics' ? styles.selected : ''}>Analytics</a>
          </Link>
          <Link href="/app/contacts">
            <a className={router.route.includes('/app/contacts') ? styles.selected : ''}>Contacts</a>
          </Link>
        </nav>

        <p>Need help ?</p>
        
        <Button
          onClick={createCampaign}
          outline={true}
        >
          Create a video campaign
        </Button>
        <p
          className={styles.logout}
          onClick={logout}
        >
          Log out
        </p>
      </div>
    </div>
  )
}

export default HeaderApp