import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import Button from '@/components/Button'

import styles from '@/styles/components/Campaign/EndScreen.module.sass'

const EndScreen = ({ contact, data = {} }) => {
  const ref = useRef()

  const [titleResponsiveFontSize, setTitleResponsiveFontSize] = useState(0)
  const [subtitleResponsiveFontSize, setSubtitleResponsiveFontSize] = useState(0)
  const [emailResponsiveFontSize, setEmailResponsiveFontSize] = useState(0)
  const [phoneResponsiveFontSize, setPhoneResponsiveFontSize] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setTitleResponsiveFontSize(ref.current.offsetWidth * (data.title.fontSize / 1000))
        setSubtitleResponsiveFontSize(ref.current.offsetWidth * (data.subtitle.fontSize / 1000))
        setEmailResponsiveFontSize(ref.current.offsetWidth * (data.email.fontSize / 1000))
        setPhoneResponsiveFontSize(ref.current.offsetWidth * (data.phone.fontSize / 1000))
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
      text = text.replace(match, contact[match.replace(/{|}/g, '')])
    })
    return text
  }

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
            // lineHeight: data.subtitle.lineHeight,
            textAlign: data.subtitle.textAlign,
            ...(data.subtitle.letterSpacing > 0 && { paddingLeft: data.subtitle.letterSpacing }),
          }}
        >
          {replaceVariables(data.subtitle.value)}
        </p>
      }
      { data.button && data.button.value &&
        <Button
          target="blank"
          type="link"
          href={data.button.href ? `https://${data.button.href.replace('https://', '')}` : ''}
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
        {
          data.networks && data.networks.length > 0 &&
          <div className={styles.networks}>
            {
              data.networks.map(network => (

                <Link
                  href={network.link}
                  key={network.id}
                >
                  <a
                    className={styles.network}
                    target="blank"
                  >
                    {network.site}
                  </a>
                </Link>
              ))
            }
          </div>
        }
      </div>
    </div>
}


export default EndScreen