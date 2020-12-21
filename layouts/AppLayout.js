import HeaderApp from '@/components/HeaderApp'

import styles from '@/styles/layouts/App.module.sass'

export default function AppLayout ({ children }) {
  return (
    <div className={styles.layout}>
      <HeaderApp />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}