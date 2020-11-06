import { useDispatch } from 'react-redux'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/Popup.module.sass'

const PopupDeleteDraftHelloScreen = ({ onConfirm }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  return (
    <Popup title="Delete hello screen draft">
      <p>Are you sure ? All of your modifications will be deleted.</p>
      <div className={styles.actions}>
        <Button
          style="outline"
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


export default PopupDeleteDraftHelloScreen