import { useEffect, useRef, useState } from 'react'

import Button from '@/components/Button'

import styles from '@/styles/components/TextVariables.module.sass'

const TextVariables = ({ onChange }) => {
  const [variable, setVariable] = useState('')

  const wrapperRef = useRef(null)

  // Close click outside text style
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onChange({ displayVariables: false })
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    };
  }, [wrapperRef])

  const selectVariable = (e) => {
    e.preventDefault()
    onChange({
      displayVariables: false,
      variable: `{{${variable}}}`,
    })
  }

  return (
    <form
      className={styles.textVariables}
      onSubmit={selectVariable}
      ref={wrapperRef}
    >
      <div>
        <label>Variable</label>
        <select
          onChange={(e) => setVariable(e.target.value)}
          value={variable}
          required
        >
          <option value="" disabled>Choose variable</option>
          <option value="firstName">First name</option>
          <option value="lastName">Last name</option>
          <option value="job">Job title</option>
          <option value="company">Company</option>
          <option value="city">City</option>
          <option value="email">Email</option>
          <option value="phone">Phone number</option>
        </select>
        <Button
          size="small"
        >
          Select
        </Button>
      </div>
    </form>
  )
}


export default TextVariables