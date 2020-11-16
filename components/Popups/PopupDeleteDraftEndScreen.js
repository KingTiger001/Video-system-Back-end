import { useDispatch } from 'react-redux'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/Popup.module.sass'

const PopupDeleteDraftEndScreen = ({ onConfirm }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  return (
    <Popup title="Delete end screen draft">
      <p>Are you sure ? All of your modifications will be deleted.</p>
      <div className={styles.actions}>
        <Button
          outline={true}
          onClick={hidePopup}
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
        >
          Yes
        </Button>
      </div>
    </Popup>
  )
}


export default PopupDeleteDraftEndScreen