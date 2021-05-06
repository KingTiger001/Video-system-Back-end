import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Button from './Button'
import Input from './Input'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import styles from '@/styles/components/FormContact.module.sass'

const animatedComponents = makeAnimated()
const customStyles = {
  control: base => ({
    ...base,
    height: 55,
    minHeight: 55
  })
};

const FormContact = ({ buttonText, data = {}, loading, onSubmit, includeLists }) => {
  const dispatch = useDispatch()
  const hidePopup = () => dispatch({ type: 'HIDE_POPUP' })

  const [form, setForm] = useState(data.contact ?? {})
  const [selectedOptions, setSelectedOptions] = useState([])

  const options = includeLists
    ? data.lists.map((list) => {
        return { value: list, label: list.name }
      })
    : []

  const submit = (e) => {
    e.preventDefault()
    const data = {
      contact: form,
      lists: selectedOptions.map((option) => option.value),
    }
    onSubmit(data)
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      <div>
        <label className={styles.label}>First name*</label>
        <Input
          onChange={(e) => setForm({
            ...form,
            firstName: e.target.value,
          })}
          type="text"
          required
          value={form.firstName}
        />
      </div>
      <div>
        <label className={styles.label}>Last name*</label>
        <Input
          onChange={(e) => setForm({
            ...form,
            lastName: e.target.value,
          })}
          type="text"
          required
          value={form.lastName}
        />
      </div>
      <div>
        <label className={styles.label}>Company*</label>
        <Input
          onChange={(e) => setForm({
            ...form,
            company: e.target.value,
          })}
          type="text"
          required
          value={form.company}
        />
      </div>
      <div>
        <label className={styles.label}>Job Title</label>
        <Input
          onChange={(e) => setForm({
            ...form,
            job: e.target.value,
          })}
          type="text"
          value={form.job}
        />
      </div>
      <div>
        <label className={styles.label}>City</label>
        <Input
          onChange={(e) => setForm({
            ...form,
            city: e.target.value,
          })}
          type="text"
          value={form.city}
        />
      </div>
      <div>
        <label className={styles.label}>Email*</label>
        <Input
          onChange={(e) => setForm({
            ...form,
            email: e.target.value,
          })}
          type="email"
          required
          value={form.email}
        />
      </div>
      <div>
        <label className={styles.label}>Phone</label>
        <Input
          onChange={(e) => setForm({
            ...form,
            phone: e.target.value,
          })}
          type="text"
          value={form.phone}
        />
      </div>
      {includeLists && (
        <div>
          <label className={styles.label}>Add to existing lists</label>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}      
            styles={customStyles}
            onChange={setSelectedOptions}
          />
        </div>
      )}
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


export default FormContact