import { useDispatch } from 'react-redux'

import styles from '../../styles/components/Popups/Popup.module.sass'

const Popup = ({ allowBackdropClose = true, children, onClose = () => {}, showCloseIcon = true, title }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  return (
    <div className={styles.popup}>
      <div
        onClick={() => {
          if (allowBackdropClose) {
            onClose()
            hidePopup()
          }
        }}
        className={styles.background}
      />
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <p className={styles.title}>{title}</p>
          { showCloseIcon &&
            <img
              onClick={() => {
                onClose()
                hidePopup()
              }}
              src="/assets/common/close.svg"
            />
          }
        </div>
        {children}
      </div>
    </div>
  )
}

export default Popup