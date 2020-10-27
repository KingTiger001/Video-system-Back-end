import Link from 'next/link'

import styles from '../styles/components/Button.module.sass'

const Button = ({ 
  color = 'primary', 
  children, 
  href, 
  loading, 
  onClick, 
  style, 
  target, 
  textColor, 
  type = 'button', 
  width,
}) => {
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
    case 'div':
      return (
        <div
          className={`${styles.button} ${styles[`${color}Color`]} ${style ? styles[style] : ''} ${loading ? styles.loading : ''} ${textColor ? styles[`${textColor}TextColor`] : ''}`}
          style={{
            ...(width && { width })
          }}
          onClick={onClick}
        >
          <span>{ children }</span>
        </div>
      )
    case 'link':
      return (
        <Link
          href={href}
        >
          <a
            className={`${styles.button} ${styles[`${color}Color`]} ${style && styles[style]}`}
            style={{
              ...(width && { width })
            }}
            target={target}
          >
            <span>{ children }</span>
          </a>
        </Link>
      )
  }
}


export default Button