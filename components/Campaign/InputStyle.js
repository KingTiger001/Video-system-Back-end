import { useDispatch } from 'react-redux'

import TextStyle from '@/components/Campaign/TextStyle'

import styles from '@/styles/components/Campaign/InputStyle.module.sass'
import toolDetailsStyles from '@/styles/components/Campaign/ToolDetails.module.sass'

const InputStyle = ({ dispatchType, object, property }) => {
  const dispatch = useDispatch()

  return (
    <div className={styles.inputStyle}>
      <div className={styles.inputStyleInput}>
        <input
          className={toolDetailsStyles.toolInput}
          onChange={(e) => dispatch({
            type: dispatchType,
            data: {
              [property]: {
                ...object[property],
                value: e.target.value,
              }
            },
          })}
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
          src="/assets/campaign/options.svg"
          style={{ display: object[property].displayOptions ? 'block' : '' }}
        />
      </div>
      { object[property].displayOptions &&
        <TextStyle
          initialValues={object[property]}
          onChange={(textStyle) => dispatch({
            type: dispatchType,
            data: {
              [property]: {
                ...object[property],
                ...textStyle,
              }
            },
          })}
        />
      }
    </div>
  )
}

export default InputStyle