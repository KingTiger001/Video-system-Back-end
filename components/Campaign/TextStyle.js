import { useEffect, useState } from 'react'
import { ChromePicker } from 'react-color'

import InputNumber from '@/components/InputNumber'

import styles from '@/styles/components/TextStyle.module.sass'

const TextStyle = ({
  features = {
    color: true,
    fontSize: true,
    fontWeight: true,
    letterSpacing: true,
    lineHeight: true,
    textAlign: true,
  },
  initialValues = {},
  onChange,
}) => {
  const [color, setColor] = useState(initialValues.color)
  const [fontSize, setFontSize] = useState(initialValues.fontSize)
  const [fontWeight, setFontWeight] = useState(initialValues.fontWeight)
  const [letterSpacing, setLetterSpacing] = useState(initialValues.letterSpacing)
  const [lineHeight, setLineHeight] = useState(initialValues.lineHeight)
  const [textAlign, setTextAlign] = useState(initialValues.textAlign)

  const [displayColorPicker, showColorPicker] = useState(false)

  useEffect(() => {
    onChange({
      color,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight,
      textAlign,
    })
  }, [
    color,
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    textAlign,
  ])

  return (
    <div className={styles.textStyle}>
      { features.fontSize &&
        <div>
          <label>Size</label>
          <InputNumber
            initialValue={fontSize}
            onChange={(value) => setFontSize(parseInt(value || 1, 10))}
          />
        </div>
      }
      { features.color &&
        <div>
          <label>Color</label>
          <div className={styles.color}>
            <div
              className={styles.colorContent}
              onClick={() => showColorPicker(!displayColorPicker)}
            >
              <span style={{ background: color }}/>
              <p>{color}</p>
            </div>
            { displayColorPicker &&
              <div className={styles.colorPopover}>
                <ChromePicker
                  width={198}
                  disableAlpha={true}
                  color={color}
                  onChange={(color) => setColor(color.hex)}
                />
              </div>
            }
          </div>
        </div>
      }
      { features.fontWeight &&
        <div>
          <label>Style</label>
          <select
            onChange={(e) => setFontWeight(parseInt(e.target.value, 10))}
            value={fontWeight}
          >
            <option value={400}>Regular</option>
            <option value={500}>Medium</option>
            <option value={600}>Semi bold</option>
            <option value={700}>Bold</option>
          </select>
        </div>
      }
      { features.textAlign &&
        <div>
          <label>Alignment</label>
          <div className={styles.textAlign}>
            <div
              className={ textAlign === 'left' ? styles.selected : ''}
              onClick={() => setTextAlign('left')}
            >
              <img src={textAlign === 'left' ? "/assets/textStyle/alignLeftSelected.svg" : "/assets/textStyle/alignLeft.svg" } />
            </div>
            <div
              className={ textAlign === 'center' ? styles.selected : ''}
              onClick={() => setTextAlign('center')}
            >
              <img src={textAlign === 'center' ? "/assets/textStyle/alignCenterSelected.svg" : "/assets/textStyle/alignCenter.svg" } />
            </div>
            <div
              className={ textAlign === 'right' ? styles.selected : ''}
              onClick={() => setTextAlign('right')}
            >
              <img src={textAlign === 'right' ? "/assets/textStyle/alignRightSelected.svg" : "/assets/textStyle/alignRight.svg" } />
            </div>
          </div>
        </div>
      }
      { features.letterSpacing &&
        <div>
          <label>Letter spacing</label>
          <InputNumber
            initialValue={letterSpacing}
            onChange={(value) => setLetterSpacing(parseInt(value || 0, 10))}
          />
        </div>
      }
      { features.lineHeight &&
        <div>
          <label>Line height</label>
          <InputNumber
            initialValue={lineHeight}
            onChange={(value) => setLineHeight(parseInt(value || 0, 10))}
          />
        </div>
      }
    </div>
  )
}


export default TextStyle