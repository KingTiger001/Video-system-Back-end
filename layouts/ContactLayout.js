import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from '@/styles/layouts/Contact.module.sass'

export default function AppLayout ({ children }) {
  const router = useRouter()
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Link href="/app/contacts">
          <a className={router.route === '/app/contacts' ? styles.selected : ''}>Contacts</a>
        </Link>
        <Link href="/app/contacts/lists">
          <a className={router.route === '/app/contacts/lists' ? styles.selected : ''}>Lists</a>
        </Link>
      </div>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}