import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from '@/styles/components/Campaign/HelloScreen.module.sass'

const HelloScreen = () => {
  const helloScreen = useSelector(state => state.campaign.helloScreen)

  const ref = useRef()
  
  const [titleResponsiveFontSize, setTitleResponsiveFontSize] = useState(0)
  const [subtitleResponsiveFontSize, setSubtitleResponsiveFontSize] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setTitleResponsiveFontSize(ref.current.offsetWidth * (helloScreen.title.fontSize / 1000))
      setSubtitleResponsiveFontSize(ref.current.offsetWidth * (helloScreen.subtitle.fontSize / 1000))
    }
    if (ref.current) {
      handleResize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref, helloScreen])

  return (
    <div
      className={styles.helloScreen}
      style={{ background: helloScreen.background }}
      ref={ref}
    >
      { helloScreen.title.value &&
        <p
          style={{
            color: helloScreen.title.color,
            fontSize: titleResponsiveFontSize,
            fontWeight: helloScreen.title.fontWeight,
            letterSpacing: helloScreen.title.letterSpacing,
            // lineHeight: helloScreen.title.lineHeight,
            textAlign: helloScreen.title.textAlign,
            ...(helloScreen.title.letterSpacing > 0 && { paddingLeft: helloScreen.title.letterSpacing }),
          }}
        >
          {helloScreen.title.value}
        </p>
      }
      { helloScreen.subtitle.value &&
        <p
          style={{
            color: helloScreen.subtitle.color,
            fontSize: subtitleResponsiveFontSize,
            fontWeight: helloScreen.subtitle.fontWeight,
            letterSpacing: helloScreen.subtitle.letterSpacing,
            // lineHeight: helloScreen.subtitle.lineHeight,
            textAlign: helloScreen.subtitle.textAlign,
            ...(helloScreen.subtitle.letterSpacing > 0 && { paddingLeft: helloScreen.subtitle.letterSpacing }),
          }}
        >
          {helloScreen.subtitle.value}
        </p>
      }
    </div>
  )
}


export default HelloScreen