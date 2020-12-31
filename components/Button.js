import Link from 'next/link'
import { useState } from 'react'

import styles from '../styles/components/Button.module.sass'

const Button = ({ 
  color = 'primary', 
  children, 
  href, 
  loading, 
  onChange,
  onClick,
  outline = false,
  size,
  style,
  target, 
  textColor, 
  type = 'button',
  width,
}) => {
  const [fileInputKey, setfileInputKey] = useState(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5))
  switch (type) {
    case 'button':
      return (
        <button
          className={`${styles.button} ${styles[`${color}Color`]} ${outline ? styles.outline : ''} ${loading ? styles.loading : ''} ${textColor ? styles[`${textColor}TextColor`] : ''} ${size ? styles[`${size}Size`] : ''}`}
          style={{
            ...(width && { width }),
            ...style,
          }}
          onClick={onClick}
        >
          <span>{ children }</span>
        </button>
      )
    case 'div':
      return (
        <div
          className={`${styles.button} ${styles[`${color}Color`]} ${outline ? styles.outline : ''} ${loading ? styles.loading : ''} ${textColor ? styles[`${textColor}TextColor`] : ''} ${size ? styles[`${size}Size`] : ''}`}
          style={{
            ...(width && { width }),
            ...style,
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
            className={`${styles.button} ${styles[`${color}Color`]} ${outline ? styles.outline : ''} ${textColor ? styles[`${textColor}TextColor`] : ''} ${size ? styles[`${size}Size`] : ''}`}
            style={{
              ...(width && { width }),
              ...style,
            }}
            target={target}
          >
            <span>{ children }</span>
          </a>
        </Link>
      )
    case 'file':
      return (
        <div>
          <label
            className={`${styles.button} ${styles[`${color}Color`]} ${outline ? styles.outline : ''} ${textColor ? styles[`${textColor}TextColor`] : ''} ${size ? styles[`${size}Size`] : ''}`}
            htmlFor="file"
          >
            <span>{ children }</span>
          </label>
          <input
            id="file"
            key={fileInputKey}
            type="file"
            onChange={(e) => {
              onChange(e)
              setfileInputKey(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5))
            }}
            className={styles.inputFile}
          />
        </div>
      )
  }
}


export default Button