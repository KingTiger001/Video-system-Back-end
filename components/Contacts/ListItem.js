import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import styles from '@/styles/components/Contacts/ListItem.module.sass'

const ListItem = ({ data, renderDropdownActions }) => {
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
      <Link href={`/app/contacts/lists/${data._id}`}>
        <a>{data.name}</a>
      </Link>
      <p>{data.list.length} contacts</p>
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
    <div className={`${styles.listItem} ${styles.empty}`}>
      <p>No contact lists added</p>
    </div>
}

export default ListItem