import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import styles from '@/styles/components/Contacts/ListItem.module.sass'

const ListItem = ({ data }) => {
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
    <div className={styles.listItem}>
      <p>{data.name}</p>
      <p>{data.list.length} contacts</p>
      <div className={styles.more}>
        <img
          onClick={() => showDropdown(!displayDropdown)}
          src="/assets/common/more.svg"
        />
        { displayDropdown &&
          <ul
            className={styles.dropdown}
            ref={dropdownRef}
          >
            <li
              onClick={() => showPopup({
                display: 'RENAME_CONTACT_LIST',
                data,
              })}
            >
              <p>Rename</p>
            </li>
            <li
              onClick={() => showPopup({
                display: 'DELETE_CONTACT_LIST',
                data,
              })}
            >
              <p>Delete</p>
            </li>
          </ul>
        }
      </div>
    
    </div>
    :
    <div className={`${styles.listItem} ${styles.empty}`}>
      <p>No contact lists added</p>
    </div>
}

export default ListItem