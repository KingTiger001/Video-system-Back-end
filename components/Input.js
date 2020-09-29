import styles from '../styles/components/Input.module.sass'

const Input = ({ ...props }) => {
  return (
    <input
      className={styles.input}
      {...props}
    />
  )
}


export default Input