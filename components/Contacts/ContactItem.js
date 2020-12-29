import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import styles from '@/styles/components/Contacts/ContactItem.module.sass'

const ContactItem = ({ data, renderDropdownActions }) => {
  const dispatch = useDispatch()
  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })

  const [displayDropdown, showDropdown] = useState(false)

  const dropdownRef = useRef(null)

  // Close click outside text style
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        showDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    };
  }, [dropdownRef])

  return data
    ?
    <div className={styles.contactItem}>
      <p>{data.firstName}</p>
      <p>{data.lastName}</p>
      <p>{data.company}</p>
      <p>{data.job}</p>
      <p>{data.email}</p>
      <p>{data.phone}</p>
      <div className={styles.more}>
        <img
          onClick={() => showDropdown(!displayDropdown)}
          src="/assets/common/more.svg"
        />
        { displayDropdown &&
          <div
            className={styles.dropdown}
            ref={dropdownRef}
          >
            {renderDropdownActions()}
          </div>
        }
      </div>
    </div>
    :
    <div className={`${styles.contactItem} ${styles.empty}`}>
      <p>No contacts added</p>
    </div>
}

export default ContactItem