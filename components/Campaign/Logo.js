import { useSelector } from 'react-redux'

import styles from '@/styles/components/Campaign/Logo.module.sass'

const Logo = () => {
  const logo = useSelector(state => state.campaign.logo)

  return logo.value
    ?
      <div className={`${styles.logo} ${styles[logo.placement]}`}>
        <img src={logo.value} />
      </div>
    :
      null
}


export default Logo