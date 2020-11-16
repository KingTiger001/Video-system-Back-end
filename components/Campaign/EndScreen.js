import { useEffect, useRef, useState } from 'react'

import Button from '@/components/Button'

import styles from '@/styles/components/Campaign/EndScreen.module.sass'

const EndScreen = ({ data = {} }) => {
  const ref = useRef()

  const [titleResponsiveFontSize, setTitleResponsiveFontSize] = useState(0)
  const [subtitleResponsiveFontSize, setSubtitleResponsiveFontSize] = useState(0)
  const [emailResponsiveFontSize, setEmailResponsiveFontSize] = useState(0)
  const [phoneResponsiveFontSize, setPhoneResponsiveFontSize] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setTitleResponsiveFontSize(ref.current.offsetWidth * (data.title.fontSize / 1000))
      setSubtitleResponsiveFontSize(ref.current.offsetWidth * (data.subtitle.fontSize / 1000))
    }
    if (ref.current) {
      handleResize()
      window.addEventListener('resize', handleResize)
    }
    return () => {
      if (ref.current) {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [ref, data])

  return Object.keys(data).length > 1 &&
    <div
      className={styles.endScreen}
      ref={ref}
      style={{ background: data.background }}
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
          {data.title.value}
        </p>
      }
      { data.subtitle.value &&
        <p
          style={{
            color: data.subtitle.color,
            fontSize: subtitleResponsiveFontSize,
            fontWeight: data.subtitle.fontWeight,
            letterSpacing: data.subtitle.letterSpacing,
            // lineHeight: data.subtitle.lineHeight,
            textAlign: data.subtitle.textAlign,
            ...(data.subtitle.letterSpacing > 0 && { paddingLeft: data.subtitle.letterSpacing }),
          }}
        >
          {data.subtitle.value}
        </p>
      }
      { data.button.value &&
        <Button
          target="blank"
          type="link"
          href={data.button.href}
          color="white"
        >
          {data.button.value}
        </Button>
      }
      <div className={styles.endScreenFooter}>
        { data.email.value &&
          <a
            href={`mailto:${data.email.value}`}
            style={{
              color: data.email.color,
              fontSize: emailResponsiveFontSize,
              fontWeight: data.email.fontWeight,
            }}
          >
            {data.email.value}
          </a>
        }
        { data.phone.value &&
          <p
            style={{
              color: data.phone.color,
              fontSize: phoneResponsiveFontSize,
              fontWeight: data.phone.fontWeight,
            }}
          >
            {data.phone.value}
          </p>
        }
      </div>
    </div>
}


export default EndScreen