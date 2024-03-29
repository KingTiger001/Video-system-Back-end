import { useEffect, useRef, useState } from 'react'

import styles from '@/styles/components/Campaign/HelloScreen.module.sass'

const HelloScreen = ({ contact, data = {} }) => {
  const ref = useRef()
  
  const [titleResponsiveFontSize, setTitleResponsiveFontSize] = useState(0)
  const [subtitleResponsiveFontSize, setSubtitleResponsiveFontSize] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setTitleResponsiveFontSize(ref.current.offsetWidth * (data.title.fontSize / 1000))
        setSubtitleResponsiveFontSize(ref.current.offsetWidth * (data.subtitle.fontSize / 1000))
      }
    }
    if (ref.current) {
      setTimeout(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
      }, 0)
    }
    return () => {
      if (ref.current) {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [ref, data])

  const replaceVariables = (text) => {
    if (!contact) {
      return text
    }
    const matches = text.match(/(?:\{\{)(.*?)(?:\}\})/gi)
    if (!matches || matches.length <= 0) {
      return text
    }
    matches.map(match => {
      text = text.replace(match, contact[match.replace(/{|}/g, '')] || '')
    })
    return text
  }

  return Object.keys(data).length > 1 &&
    <div
      className={styles.helloScreen}
      style={{ background: data.background }}
      ref={ref}
    >
      { data.title.value &&
        <p
          style={{
            color: data.title.color,
            fontSize: titleResponsiveFontSize,
            fontWeight: data.title.fontWeight,
            letterSpacing: data.title.letterSpacing,
            // lineHeight: data.title.lineHeight,
            textAlign: data.title.textAlign,
            ...(data.title.letterSpacing > 0 && { paddingLeft: data.title.letterSpacing }),
          }}
        >
          {replaceVariables(data.title.value)}
        </p>
      }
      { data.subtitle.value &&
        <p
          style={{
            color: data.subtitle.color,
            fontSize: subtitleResponsiveFontSize,
            fontWeight: data.subtitle.fontWeight,
            letterSpacing: data.subtitle.letterSpacing,
            // lineHeight: helloScreen.subtitle.lineHeight,
            textAlign: data.subtitle.textAlign,
            ...(data.subtitle.letterSpacing > 0 && { paddingLeft: data.subtitle.letterSpacing }),
          }}
        >
          {replaceVariables(data.subtitle.value)}
        </p>
      }
    </div>
}


export default HelloScreen