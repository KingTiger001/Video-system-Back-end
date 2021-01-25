import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '../Button'
import Popup from './Popup'

import styles from '@/styles/components/Popups/PopupQuitShare.module.sass'

const PopupQuitShare = ({ onDone }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  return (
    <Popup>
      <h3 className={styles.title}>You can share your<br />video campaign later</h3>
      <div className={styles.actions}>
        <Button
          onClick={onDone}
        >
          Save & Close
        </Button>
        <Button
          onClick={hidePopup}
          outline={true}
        >
          Close
        </Button>
      </div>
    </Popup>
  )
}

export default PopupQuitShare