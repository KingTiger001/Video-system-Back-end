import styles from '../styles/components/ImportButton.module.sass'

const ImportButton = ({ children, onChange }) => {
  return (
    <label
      className={styles.label}
      htmlFor="import"
    >
      <input
        id="import"
        accept="video/*"
        className={styles.input}
        type="file"
        onChange={onChange}
      />
      <span>{ children }</span>
    </label>
  )
}

export default ImportButton