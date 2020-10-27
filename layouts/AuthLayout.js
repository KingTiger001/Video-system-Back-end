import Link from 'next/link'

import styles from '@/styles/layouts/Auth.module.sass'

export default function AuthLayout ({ children }) {
  return (
    <div className={styles.layout}>
      <main className={styles.content}>
        <Link href="/">
          <a>
            <img
              className={styles.logo}
              src="/logo.svg"
            />
          </a>
        </Link>
        {children}
      </main>
    </div>
  )
}