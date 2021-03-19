import { useDispatch } from 'react-redux'

import TextStyle from '@/components/Campaign/TextStyle'
import TextVariables from '@/components/Campaign/TextVariables'

import styles from '@/styles/components/Campaign/InputWithTools.module.sass'
import toolsStyles from '@/styles/components/Campaign/Tools.module.sass'

const InputWithTools = ({
  dispatchType,
  object,
  property,
  toolStyle = false,
  toolVariables = false,
}) => {
  const dispatch = useDispatch()


  return (
    <div className={styles.inputWithTools}>
      <div className={styles.input}>
        <input
          className={toolsStyles.toolInput}
          onChange={(e) => {
            dispatch({
              type: dispatchType,
              data: {
                [property]: {
                  ...object[property],
                  value: e.target.value,
                }
              },
            })
          }}
          value={object[property].value}
        />
        <div className={styles.tools}>
          { toolVariables && 
            <img
              className={styles.varsIcon}
              onClick={() => dispatch({
                type: dispatchType,
                data: {
                  [property]: {
                    ...object[property],
                    displayVariables: !object[property].displayVariables,
                  }
                },
              })}
              src="/assets/campaign/code.svg"
              style={{ display: object[property].displayVariables ? 'block' : '' }}
            />
          }
          { toolStyle &&
            <img
              className={styles.styleIcon}
              onClick={() => dispatch({
                type: dispatchType,
                data: {
                  [property]: {
                    ...object[property],
                    displayStyle: !object[property].displayStyle,
                  }
                },
              })}
              src="/assets/campaign/pen.svg"
              style={{ display: object[property].displayStyle ? 'block' : '' }}
            />
          }
        </div>
      </div>
      { object[property].displayStyle &&
        <TextStyle
          initialValues={object[property]}
          onChange={(textStyle) => {
            dispatch({
              type: dispatchType,
              data: {
                [property]: {
                  ...object[property],
                  ...textStyle,
                }
              },
            })
          }}
        />
      }
      { object[property].displayVariables &&
        <TextVariables
          initialValues={object[property]}
          onChange={({ displayVariables, variable }) => {
            dispatch({
              type: dispatchType,
              data: {
                [property]: {
                  ...object[property],
                  displayVariables: displayVariables === true,
                  ...(variable && { value: `${object[property].value} ${variable}` })
                }
              },
            })
          }}
        />
      }
    </div>
  )
}

export default InputWithTools