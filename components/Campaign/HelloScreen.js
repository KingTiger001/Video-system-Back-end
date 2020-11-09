import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from '@/styles/components/Campaign/HelloScreen.module.sass'

const HelloScreen = () => {
  const helloScreen = useSelector(state => state.campaign.helloScreen)
  const previewHelloScreen = useSelector(state => state.campaign.previewHelloScreen)

  const ref = useRef()
  
  const [hs, setHS] = useState({})
  const [titleResponsiveFontSize, setTitleResponsiveFontSize] = useState(0)
  const [subtitleResponsiveFontSize, setSubtitleResponsiveFontSize] = useState(0)

  useEffect(() => setHS(Object.keys(previewHelloScreen).length > 0 ? previewHelloScreen : helloScreen), [helloScreen, previewHelloScreen])

  useEffect(() => {
    const handleResize = () => {
      setTitleResponsiveFontSize(ref.current.offsetWidth * (hs.title.fontSize / 1000))
      setSubtitleResponsiveFontSize(ref.current.offsetWidth * (hs.subtitle.fontSize / 1000))
    }
    if (ref.current) {
      handleResize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref, hs])

  return Object.keys(hs).length > 1 &&
    <div
      className={styles.helloScreen}
      style={{ background: hs.background }}
      ref={ref}
    >
      { hs.title.value &&
        <p
          style={{
            color: hs.title.color,
            fontSize: titleResponsiveFontSize,
            fontWeight: hs.title.fontWeight,
            letterSpacing: hs.title.letterSpacing,
            // lineHeight: hs.title.lineHeight,
            textAlign: hs.title.textAlign,
            ...(hs.title.letterSpacing > 0 && { paddingLeft: hs.title.letterSpacing }),
          }}
        >
          {hs.title.value}
        </p>
      }
      { hs.subtitle.value &&
        <p
          style={{
            color: hs.subtitle.color,
            fontSize: subtitleResponsiveFontSize,
            fontWeight: hs.subtitle.fontWeight,
            letterSpacing: hs.subtitle.letterSpacing,
            // lineHeight: helloScreen.subtitle.lineHeight,
            textAlign: hs.subtitle.textAlign,
            ...(hs.subtitle.letterSpacing > 0 && { paddingLeft: hs.subtitle.letterSpacing }),
          }}
        >
          {hs.subtitle.value}
        </p>
      }
    </div>
}


export default HelloScreen