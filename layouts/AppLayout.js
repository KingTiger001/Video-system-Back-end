import { useDispatch, useSelector } from 'react-redux'

import HeaderApp from '@/components/HeaderApp'
import PopupCreateCampaign from '@/components/Popups/PopupCreateCampaign'

import styles from '@/styles/layouts/App.module.sass'

export default function AppLayout ({ children }) {
  const dispatch = useDispatch()

  const popup = useSelector(state => state.popup)

  return (
    <div className={styles.layout}>
      <HeaderApp />
      <main className={styles.content}>
        {children}
      </main>
      { popup.display === 'CREATE_CAMPAIGN' && <PopupCreateCampaign /> }
    </div>
  )
}