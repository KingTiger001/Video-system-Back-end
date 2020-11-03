import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from '@/styles/components/Campaign/EndScreen.module.sass'

const EndScreen = () => {
  const ref = useRef()

  const endScreen = useSelector(state => state.campaign.endScreen)
  
  const [titleResponsiveFontSize, setTitleResponsiveFontSize] = useState(0)
  const [subtitleResponsiveFontSize, setSubtitleResponsiveFontSize] = useState(0)
  const [emailResponsiveFontSize, setEmailResponsiveFontSize] = useState(0)
  const [phoneResponsiveFontSize, setPhoneResponsiveFontSize] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setTitleResponsiveFontSize(ref.current.offsetWidth * (endScreen.title.fontSize / 1000))
      setSubtitleResponsiveFontSize(ref.current.offsetWidth * (endScreen.subtitle.fontSize / 1000))
      setEmailResponsiveFontSize(ref.current.offsetWidth * (endScreen.email.fontSize / 1000))
      setPhoneResponsiveFontSize(ref.current.offsetWidth * (endScreen.phone.fontSize / 1000))
    }
    if (ref.current) {
      handleResize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref, endScreen])

  return (
    <div
      className={styles.endScreen}
      ref={ref}
      style={{ background: endScreen.background }}
    >
      { endScreen.title.value &&
        <p
          style={{
            color: endScreen.title.color,
            fontSize: titleResponsiveFontSize,
            fontWeight: endScreen.title.fontWeight,
            letterSpacing: endScreen.title.letterSpacing,
            // lineHeight: endScreen.title.lineHeight,
            textAlign: endScreen.title.textAlign,
            ...(endScreen.title.letterSpacing > 0 && { paddingLeft: endScreen.title.letterSpacing }),
          }}
        >
          {endScreen.title.value}
        </p>
      }
      { endScreen.subtitle.value &&
        <p
          style={{
            color: endScreen.subtitle.color,
            fontSize: subtitleResponsiveFontSize,
            fontWeight: endScreen.subtitle.fontWeight,
            letterSpacing: endScreen.subtitle.letterSpacing,
            // lineHeight: endScreen.subtitle.lineHeight,
            textAlign: endScreen.subtitle.textAlign,
            ...(endScreen.subtitle.letterSpacing > 0 && { paddingLeft: endScreen.subtitle.letterSpacing }),
          }}
        >
          {endScreen.subtitle.value}
        </p>
      }
      { endScreen.button.value &&
        <Button
          type="link"
          href={endScreen.button.href}
          color="white"
        >
          {endScreen.button.value}
        </Button>
      }
      <div className={styles.endScreenFooter}>
        { endScreen.email.value &&
          <a
            href={`mailto:${endScreen.email.value}`}
            style={{
              color: endScreen.email.color,
              fontSize: emailResponsiveFontSize,
              fontWeight: endScreen.email.fontWeight,
            }}
          >
            {endScreen.email.value}
          </a>
        }
        { endScreen.phone.value &&
          <p
            style={{
              color: endScreen.phone.color,
              fontSize: phoneResponsiveFontSize,
              fontWeight: endScreen.phone.fontWeight,
            }}
          >
            {endScreen.phone.value}
          </p>
        }
      </div>
    </div>
  )
}


export default EndScreen