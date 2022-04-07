import { useDispatch, useSelector } from 'react-redux'

import EndFreeTrialOrSubcription from '@/components/EndFreeTrialOrSubcription'
import HeaderApp from '@/components/HeaderApp'
import PopupCreateCampaign from '@/components/Popups/PopupCreateCampaign'
import SidebarLeft from '@/components/SidebarLeft/SidebarLeft'

import styles from '@/styles/layouts/App.module.sass'


export default function AppLayout ({ children }) {
  const popup = useSelector(state => state.popup)

  return (
    <div className={styles.main}>
      <SidebarLeft />
      <div className={styles.layout}>
        <HeaderApp />
        <EndFreeTrialOrSubcription />
        <main className={styles.content}>
          {children}
        </main>
        { popup.display === 'CREATE_CAMPAIGN' && <PopupCreateCampaign /> }
      </div>
    </div>
  )
}