import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Button from './Button'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()

import styles from '@/styles/components/FormContactList.module.sass'

const FormContactListSelect = ({
  buttonText,
  data = [],
  loading,
  onSubmit,
}) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [selectedOptions, setSelectedOptions] = useState([])

  const submit = (e) => {
    e.preventDefault()
    const selectedLists = selectedOptions.map((option) => option.value)
    onSubmit(selectedLists)
  }

  const options = data.map((list) => {
    return { value: list, label: list.name }
  })
  return (
    <form className={styles.form} onSubmit={submit}>
      <div>
        <label className={styles.label}>List name</label>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          defaultValue={[options[0]]}
          isMulti
          options={options}
          onChange={setSelectedOptions}
        />
      </div>
      <Button loading={loading}>{buttonText}</Button>
      <p onClick={hidePopup} className={styles.cancel}>
        Cancel
      </p>
    </form>
  )
}

export default FormContactListSelect