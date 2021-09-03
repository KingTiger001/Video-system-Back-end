import { useEffect, useRef, useState } from 'react'

import Button from '@/components/Button'

import styles from '@/styles/components/TextVariables.module.sass'

const TextVariables = ({ onChange }) => {
  const selectVariable = (e) => {
    onChange({
      variable: `{{${e}}}`,
    })
  }

  const variables = {
    firstName: 'First Name',
    lastName: 'Last name',
    job: 'Job title',
    company: 'Company',
    city: 'City',
    email: 'Email',
    phone: 'Phone',
  }

  return (
    <div className={styles.textVariables}>
      <ul className={styles.content}>
        {Object.keys(variables).map((key) => (
          <li onClick={() => selectVariable(key)}>{variables[key]}</li>
        ))}
      </ul>
    </div>
  )
}


export default TextVariables