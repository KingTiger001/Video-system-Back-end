import { useDispatch } from 'react-redux'

import TextStyle from '@/components/Campaign/TextStyle'
import TextVariables from '@/components/Campaign/TextVariables'

import styles from '@/styles/components/Campaign/InputWithTools.module.sass'
import toolsStyles from '@/styles/components/Campaign/Tools.module.sass'
import { useEffect, useRef, useState } from 'react'

const InputWithTools = ({
  placeholder,
  dispatchType,
  me,
  object,
  property,
  toolStyle = false,
  toolVariables = false,
}) => {
  const dispatch = useDispatch()
  const [showFont, setShowFont] = useState(false)
  const [showVars, setShowVars] = useState(false)

  return (
    <div className={styles.inputWithTools}>
      <input
        placeholder={placeholder}
        className={toolsStyles.toolInput}
        onChange={(e) => {
          dispatch({
            type: dispatchType,
            data: {
              [property]: {
                ...object[property],
                value: e.target.value,
              },
            },
          })
        }}
        value={object[property].value}
      />
      <div className={styles.tools}>
        {toolStyle && (me.freeTrial || me.subscription.level === 'pro') && (
          <div className={styles.dropdown}>
            <div
              className={styles.button}
              onClick={() => setShowFont(!showFont)}
            >
              Font
              <img
                src={
                  showFont
                    ? '/assets/common/expandLessW.svg'
                    : '/assets/common/expandMoreW.svg'
                }
              />
            </div>
            {showFont && (
              <PopupOptions setAction={setShowFont}>
                <TextStyle
                  initialValues={object[property]}
                  onChange={(textStyle) => {
                    dispatch({
                      type: dispatchType,
                      data: {
                        [property]: {
                          ...object[property],
                          ...textStyle,
                        },
                      },
                    })
                  }}
                />
              </PopupOptions>
            )}
          </div>
        )}

        {toolVariables && (
          <div className={styles.dropdown}>
            <div
              className={styles.button}
              onClick={() => setShowVars(!showVars)}
            >
              Variable
              <img
                src={
                  showVars
                    ? '/assets/common/expandLessW.svg'
                    : '/assets/common/expandMoreW.svg'
                }
              />
            </div>
            {showVars && (
              <PopupOptions setAction={setShowVars}>
                <TextVariables
                  initialValues={object[property]}
                  onChange={({ displayVariables, variable }) => {
                    dispatch({
                      type: dispatchType,
                      data: {
                        [property]: {
                          ...object[property],
                          displayVariables: displayVariables === true,
                          ...(variable && {
                            value: `${object[property].value} ${variable}`,
                          }),
                        },
                      },
                    })
                  }}
                />
              </PopupOptions>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const PopupOptions = ({ setAction, children }) => {
  const wrapperRef = useRef(null)
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setAction && setAction(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div ref={wrapperRef} className={toolsStyles.popupOptions}>
      {children}
    </div>
  )
}

export default InputWithTools