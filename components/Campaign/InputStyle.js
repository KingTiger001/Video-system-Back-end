import { useDispatch } from 'react-redux'

import TextStyle from '@/components/Campaign/TextStyle'

import styles from '@/styles/components/Campaign/InputStyle.module.sass'
import toolBoxStyles from '@/styles/components/Campaign/ToolBox.module.sass'

const InputStyle = ({ dispatchType, object, property }) => {
  const dispatch = useDispatch()

  return (
    <div className={styles.inputStyle}>
      <div className={styles.inputStyleInput}>
        <input
          className={toolBoxStyles.toolInput}
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
            dispatch({
              type: 'HAS_CHANGES',
              data: true,
            })
          }}
          value={object[property].value}
        />
        <img
          onClick={(e) => dispatch({
            type: dispatchType,
            data: {
              [property]: {
                ...object[property],
                displayOptions: !object[property].displayOptions,
              }
            },
          })}
          src="/assets/campaign/pen.svg"
          style={{ display: object[property].displayOptions ? 'block' : '' }}
        />
      </div>
      { object[property].displayOptions &&
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
            dispatch({
              type: 'HAS_CHANGES',
              data: true,
            })
          }}
        />
      }
    </div>
  )
}

export default InputStyle