import { Link } from '../i18n'

import styles from './Button.module.sass'

const Button = ({ children, href, style, type = 'button', width }) => {
  switch (type) {
    case 'button':
      return (
        <button
          className={`${styles.button} ${style ? styles[style] : ''}`}
          style={{
            ...(width && { width })
          }}
        >
          <span>{ children }</span>
        </button>
      )
    case 'link':

      return (
        <Link href={href}>
          <a
            className={`${styles.button} ${style && styles[style]}`}
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