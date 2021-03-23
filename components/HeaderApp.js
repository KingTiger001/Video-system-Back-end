import jscookie from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { mainAPI } from '@/plugins/axios'

import Button from '@/components/Button'

import styles from '@/styles/components/HeaderApp.module.sass'

const HeaderApp = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const showPopup = (popupProps) => dispatch({ type: 'SHOW_POPUP', ...popupProps })

  const [displayUserMenu, showUserMenu] = useState(false)
  const [me, setMe] = useState({})
  
  useEffect(() => {
    async function getMe () {
      const { data } = await mainAPI.get('/users/me')
      setMe(data)
    }
    getMe()
  }, [])

  const userMenuRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        showUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef])

  const logout = () => {
    router.push('/login')
    jscookie.remove('fo_sas_tk')
  }

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <Link href="/app">
          <a className={styles.logo}>
            <img src="/logo-simple.svg" />
          </a>
        </Link>

        <nav className={styles.menu}>
          <Link href="/app/campaigns">
            <a className={router.route === '/app/campaigns' ? styles.selected : ''}>Videos campaigns</a>
          </Link>
          <Link href="/app/analytics">
            <a className={router.route === '/app/analytics' ? styles.selected : ''}>Analytics</a>
          </Link>
          <Link href="/app/contacts">
            <a className={router.route.includes('/app/contacts') ? styles.selected : ''}>Contacts</a>
          </Link>
        </nav>

        <a className={styles.needHelp} href="mailto:contact@myfomo.io">Need help ?</a>
        <Button
          onClick={() => showPopup({ display: 'CREATE_CAMPAIGN' })}
          outline={true}
        >
          Create a video campaign
        </Button>
        <div className={styles.user}>
          { me.firstName &&
            <div
              className={styles.userName}
              onClick={() => showUserMenu(!displayUserMenu)}
            >
              <img src="/assets/common/profile.svg" />
              <p>{me.firstName}</p>
              <img src={`/assets/common/${displayUserMenu ? 'expandLess' : 'expandMore'}.svg`} />
            </div>
          }
          { displayUserMenu &&
            <div
              className={styles.userDropdown}
              ref={userMenuRef}
            >
              <ul className={styles.userMenu}>
                <li>
                  <Link href="/app/account"><a>Account</a></Link>
                </li>
                <li>
                  <Link href="/app/billing"><a>Billing</a></Link>
                </li>
              </ul>
              <a href="mailto:contact@myfomo.io">Need help ?</a>
              <p className={styles.logout} onClick={logout}>Log out</p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default HeaderApp