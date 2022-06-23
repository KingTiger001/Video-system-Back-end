import { useRouter } from 'next/router'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/PopupWelcome.module.sass'

const PopupWelcome = ({ onClose }) => {
  const router = useRouter()
  
  const goToCampaigns = () => {
    router.push('/app/campaigns')
    onClose()
  }

  const goToContacts = () => {
    router.push('/app/contacts')
    onClose()
  }

  return (
    <Popup
      onClose={onClose}
      width={445}
    >
      <div className={styles.content}>
        <p className={styles.title}>Happy to see you<br/>on SEEMEE 😃🚀</p>
        <p className={styles.text}>
          Vous êtes sur le point de commencer l’aventure SEEMEE ! Nous t’invitons à entamer une des étapes ci-dessous !
          <br/><br/>
          Vous n’êtes pas obligé de les faires de suite, mais elle te permettront de découvrir et d’apprendre à utiliser l’interface !
        </p>
        <div className={styles.actions}>
          <div>
            <p>Ajoutez ou importez votre première liste de contact :</p>
            <Button
              href="/app/contacts"
              onClick={goToContacts}
              outline={true}
            >
              Import contact
            </Button>
          </div>
          <div>
            <p>Vous êtes impatient ? Créez votre première campagne vidéo !</p>
            <Button
              color="secondary"
              href="/app/campaigns"
              onClick={goToCampaigns}
              outline={true}
            >
              Create my first campaign
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default PopupWelcome
