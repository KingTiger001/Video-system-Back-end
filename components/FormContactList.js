import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Button from './Button'
import Input from './Input'

import styles from '@/styles/components/FormContactList.module.sass'

const FormContactList = ({ buttonText, data = {}, loading, onSubmit }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [form, setForm] = useState(data)

  const submit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      <div>
        <label className={styles.label}>List name</label>
        <Input
          onChange={(e) => setForm({
            ...form,
            name: e.target.value,
          })}
          type="text"
          required
          value={form.name}
        />
      </div>
      <Button loading={loading}>{buttonText}</Button>
      <p
        onClick={hidePopup}
        className={styles.cancel}
      >
        Cancel
      </p>
    </form>
  )
}


export default FormContactList