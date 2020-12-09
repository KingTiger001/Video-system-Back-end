import styles from '@/styles/components/Input.module.sass'

const InputNumber = ({ initialValue, onChange, max, ...props }) => {
  const filterChars = (e) => {
    let value = e.target.value.trim().replace(',', '.').replace(/[^0-9.]/g, '')
    if (value > max) {
      value = max
    }
    onChange(value)
    e.target.value = value || ''
  }

  return (
    <input
      className={`${styles.input} ${props.className}`}
      onChange={filterChars}
      value={initialValue || ''}
      {...props}
    />
  )
}

export default InputNumber