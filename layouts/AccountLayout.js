import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from '@/styles/layouts/Contact.module.sass'

export default function AppLayout ({ children }) {
  const router = useRouter()
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Link href="/app">
          <a className={router.route === '/app' ? styles.selected : ''}>Account</a>
        </Link>
        <Link href="/app/billing">
          <a className={router.route === '/app/billing' ? styles.selected : ''}>Billing</a>
        </Link>
      </div>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}