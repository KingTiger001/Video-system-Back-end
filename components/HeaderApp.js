import jscookie from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Button from '@/components/Button'

import styles from '@/styles/components/HeaderApp.module.sass'

const HeaderApp = () => {
  const router = useRouter()

  const logout = () => {
    router.push('/login')
    jscookie.remove('fo_sas_tk')
  }

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <Link href="/dashboard">
          <a className={styles.logo}>
            <img src="/logo-simple.svg" />
          </a>
        </Link>

        <nav className={styles.menu}>
          <Link href="/dashboard">
            <a className={router.route === '/dashboard' ? styles.selected : ''}>Dashboard</a>
          </Link>
          <Link href="/dashboard/campaigns">
            <a className={router.route === '/dashboard/campaigns' ? styles.selected : ''}>Campaigns</a>
          </Link>
          <Link href="/dashboard/analytics">
            <a className={router.route === '/dashboard/analytics' ? styles.selected : ''}>Analytics</a>
          </Link>
          <Link href="/dashboard/contacts">
            <a className={router.route === '/dashboard/contacts' ? styles.selected : ''}>Contacts</a>
          </Link>
        </nav>

        <p>Need help ?</p>
        
        {/* <Button onClick={createCampaign}> */}
        <Button>
          Create a campaign
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