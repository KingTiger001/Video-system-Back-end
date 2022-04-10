import { useDispatch } from 'react-redux'

import styles from '../../styles/components/Popups/Popup.module.sass'

const Popup = ({ allowBackdropClose = true, children, onClose = () => {}, showCloseIcon = true, title, width = 600 ,bgcolor="dark"}) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  return (
    <div className={`${styles.popup} ${bgcolor==="light"?styles.light:""}`}>
      <div
        onClick={() => {
          if (allowBackdropClose) {
            onClose()
            hidePopup()
          }
        }}
        className={styles.background}
      />
      <div
        className={`${styles.content}`}
        style={{ maxWidth: width }}
      >
        { showCloseIcon &&
          <img
            className={styles.close}
            onClick={() => {
              onClose()
              hidePopup()
            }}
            src="/assets/common/close.svg"
          />
        }
        {title && <p className={styles.title}>{title}</p>}
        {children}
      </div>
    </div>
  )
}

export default Popup