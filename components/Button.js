import Link from 'next/link'

import styles from '../styles/components/Button.module.sass'

const Button = ({ color = 'primary', children, href, loading, onClick, style, textColor, type = 'button', width }) => {
  switch (type) {
    case 'button':
      return (
        <button
          className={`${styles.button} ${styles[`${color}Color`]} ${style ? styles[style] : ''} ${loading ? styles.loading : ''} ${textColor ? styles[`${textColor}TextColor`] : ''}`}
          style={{
            ...(width && { width })
          }}
          onClick={onClick}
        >
          <span>{ children }</span>
        </button>
      )
    case 'link':
      return (
        <Link href={href}>
          <a
            className={`${styles.button} ${styles[`${color}Color`]} ${style && styles[style]}`}
            style={{
              ...(width && { width })
            }}
          >
            <span>{ children }</span>
          </a>
        </Link>
      )
  }
}


export default Button