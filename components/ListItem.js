import { useEffect, useRef, useState } from 'react'

import styles from '@/styles/components/ListItem.module.sass'

const ListItem = ({
  children,
  className,
  empty = false,
  renderActions,
  renderDropdownActions,
  renderEmpty,
}) => {
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

  return empty
    ?
    <div className={`${styles.listItem} ${styles.empty}`}>
      {renderEmpty()}
    </div>
    :
    <div className={`${styles.listItem} ${className ? className : ''}`}>
      {children}
      {renderActions && 
        <div className={styles.actions}>
          {renderActions()}
        </div>
      }
      {renderDropdownActions && 
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
      }
    </div>
}

export default ListItem